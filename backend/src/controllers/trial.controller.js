const { TrialRequest, User } = require('../models');

const create = async (req, res, next) => {
  try {
    const {
      name, mobile, whatsapp, email, address,
      area, society, pincode, family_size, preferred_delivery_day, notes,
    } = req.body;

    if (!name || !mobile || !address) {
      return res.status(400).json({ success: false, message: 'Name, mobile and address are required' });
    }

    const trial = await TrialRequest.create({
      name, mobile, whatsapp: whatsapp || mobile,
      email, address, area, society, pincode,
      family_size, preferred_delivery_day, notes,
      user_id: req.user?.id || null,
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Trial request submitted! We will contact you on WhatsApp to schedule your free trial.',
      data: { id: trial.id },
    });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const { rows, count } = await TrialRequest.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['id', 'name', 'email'], required: false }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const trial = await TrialRequest.findByPk(req.params.id);
    if (!trial) return res.status(404).json({ success: false, message: 'Trial request not found' });
    await trial.update({
      status: req.body.status,
      admin_notes: req.body.admin_notes,
      scheduled_date: req.body.scheduled_date,
    });
    res.json({ success: true, data: trial });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const trial = await TrialRequest.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'], required: false }],
    });
    if (!trial) return res.status(404).json({ success: false, message: 'Trial request not found' });
    res.json({ success: true, data: trial });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, updateStatus, getOne };
