const { TrialRequest, User } = require('../models');
const { Op } = require('sequelize');
const { notifyNewTrialRequest } = require('../utils/notify');

const create = async (req, res, next) => {
  try {
    const {
      name, mobile, whatsapp, email, address,
      area, society, pincode, family_size, preferred_delivery_day, notes,
    } = req.body;

    if (!name || !mobile || !address) {
      return res.status(400).json({ success: false, message: 'Name, mobile and address are required' });
    }

    // ── Duplicate guard ──────────────────────────────────────────────────────
    // Check by mobile number. Also check by user_id if the request is logged-in.
    const whereClause = { mobile };
    if (req.user?.id) {
      whereClause[Op.or] = [{ mobile }, { user_id: req.user.id }];
      delete whereClause.mobile; // replaced by Op.or above
    }

    const existing = await TrialRequest.findOne({
      where: whereClause,
      order: [['created_at', 'DESC']],
    });

    if (existing) {
      // Friendly, warm status messages — reads like a helpful friend, not an error
      const firstName = existing.name ? existing.name.split(' ')[0] : 'there';
      const statusMsg = {
        PENDING:           `Hi ${firstName}, your request is already with us! We'll WhatsApp you soon.`,
        APPROVED:          `Your free basket is approved, ${firstName}! Check WhatsApp for delivery details.`,
        SCHEDULED:         `Delivery is on the way, ${firstName}! Check your WhatsApp for the date.`,
        DELIVERED:         `You've already had your free basket, ${firstName}. Subscribe to keep it coming!`,
        FEEDBACK_RECEIVED: `Your free trial is done, ${firstName}. Ready for a weekly plan?`,
        CONVERTED:         `You're already a Palvii subscriber, ${firstName}!`,
        NOT_CONVERTED:     `Your free trial is used, ${firstName}. Subscribe anytime!`,
        REJECTED:          `We couldn't reach your area yet, ${firstName}. WhatsApp us and we'll help!`,
      }[existing.status] || `You've already submitted a free trial request. We'll be in touch soon!`;

      return res.status(409).json({
        success: false,
        code: 'DUPLICATE_TRIAL',
        status: existing.status,
        message: statusMsg,
        data: { existing_id: existing.id, trial_status: existing.status },
      });
    }
    // ────────────────────────────────────────────────────────────────────────

    const trial = await TrialRequest.create({
      name, mobile, whatsapp: whatsapp || mobile,
      email, address, area, society, pincode,
      family_size, preferred_delivery_day, notes,
      user_id: req.user?.id || null,
      status: 'PENDING',
    });

    // 🔔 Notify owner on WhatsApp — fire-and-forget, never blocks the response
    notifyNewTrialRequest(trial).catch(() => {});

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
    const { status, page = 1, limit = 20, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name:   { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } },
        { area:   { [Op.like]: `%${search}%` } },
      ];
    }

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

// Check if a mobile number already has a trial (used by frontend on blur)
const checkByMobile = async (req, res, next) => {
  try {
    const { mobile } = req.query;
    if (!mobile) return res.json({ success: true, exists: false });
    const existing = await TrialRequest.findOne({ where: { mobile }, order: [['created_at', 'DESC']] });
    if (!existing) return res.json({ success: true, exists: false });
    res.json({ success: true, exists: true, status: existing.status });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const trial = await TrialRequest.findByPk(req.params.id);
    if (!trial) return res.status(404).json({ success: false, message: 'Not found' });
    await trial.destroy();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, updateStatus, getOne, checkByMobile, remove };

