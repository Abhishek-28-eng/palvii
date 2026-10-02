const { User, Address } = require('../models');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
      include: [{ model: Address }],
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, whatsapp } = req.body;
    await User.update({ name, whatsapp }, { where: { id: req.user.id } });
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
};

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({ where: { user_id: req.user.id } });
    res.json({ success: true, data: addresses });
  } catch (err) {
    next(err);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const address = await Address.create({ ...req.body, user_id: req.user.id });
    res.status(201).json({ success: true, data: address });
  } catch (err) {
    next(err);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });
    await address.update(req.body);
    res.json({ success: true, data: address });
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });
    await address.destroy();
    res.json({ success: true, message: 'Address deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, getAddresses, addAddress, updateAddress, deleteAddress };
