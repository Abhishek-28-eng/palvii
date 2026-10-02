const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SALT_ROUNDS = 12;

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, mobile, email, password, whatsapp } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ success: false, message: 'Name, mobile and password are required' });
    }

    const existingMobile = await User.findOne({ where: { mobile } });
    if (existingMobile) {
      return res.status(409).json({ success: false, message: 'Mobile number already registered' });
    }

    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name,
      mobile,
      email: email || null,
      whatsapp: whatsapp || mobile,
      password_hash,
      role: 'CUSTOMER',
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier = email or mobil

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Identifier and password are required' });
    }

    const user = await User.findOne({
      where: identifier.includes('@')
        ? { email: identifier }
        : { mobile: identifier },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Your account is inactive. Contact support.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password_hash'] },
  });
  res.json({ success: true, data: user });
};

const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await User.findByPk(req.user.id);
    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password_hash = await bcrypt.hash(new_password, SALT_ROUNDS);
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, changePassword };
