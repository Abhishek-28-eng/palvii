const { Subscription, SubscriptionPlan, User, Basket, Address } = require('../models');

const getPlans = async (req, res, next) => {
  try {
    const plans = await SubscriptionPlan.findAll({
      where: { is_active: true },
      include: [{ model: Basket, attributes: ['id', 'name', 'image', 'price'] }],
      order: [['sort_order', 'ASC']],
    });
    res.json({ success: true, data: plans });
  } catch (err) {
    next(err);
  }
};

const getAllPlans = async (req, res, next) => {
  try {
    const plans = await SubscriptionPlan.findAll({
      include: [{ model: Basket, attributes: ['id', 'name'] }],
      order: [['sort_order', 'ASC']],
    });
    res.json({ success: true, data: plans });
  } catch (err) {
    next(err);
  }
};

const createPlan = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
};

const updatePlan = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    await plan.update(req.body);
    res.json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
};

const subscribe = async (req, res, next) => {
  try {
    const { plan_id, address_id, start_date } = req.body;

    const plan = await SubscriptionPlan.findByPk(plan_id);
    if (!plan || !plan.is_active) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found or inactive' });
    }

    // Check existing active subscription
    const existing = await Subscription.findOne({
      where: { user_id: req.user.id, plan_id, status: 'ACTIVE' },
    });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You already have an active subscription for this plan' });
    }

    const startDate = start_date || new Date().toISOString().split('T')[0];
    let nextDelivery = new Date(startDate);
    if (plan.frequency === 'WEEKLY') nextDelivery.setDate(nextDelivery.getDate() + 7);
    else if (plan.frequency === 'MONTHLY') nextDelivery.setMonth(nextDelivery.getMonth() + 1);

    const subscription = await Subscription.create({
      user_id: req.user.id,
      plan_id,
      address_id: address_id || null,
      start_date: startDate,
      next_delivery_date: nextDelivery.toISOString().split('T')[0],
      status: 'ACTIVE',
      payment_status: 'PENDING',
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (err) {
    next(err);
  }
};

const getMySubscriptions = async (req, res, next) => {
  try {
    const subs = await Subscription.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: SubscriptionPlan, include: [{ model: Basket, attributes: ['id', 'name', 'image'] }] },
        { model: Address },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: subs });
  } catch (err) {
    next(err);
  }
};

const pauseSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });
    if (sub.status !== 'ACTIVE') return res.status(400).json({ success: false, message: 'Subscription is not active' });
    await sub.update({ status: 'PAUSED', paused_at: new Date() });
    res.json({ success: true, data: sub });
  } catch (err) {
    next(err);
  }
};

const resumeSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });
    if (sub.status !== 'PAUSED') return res.status(400).json({ success: false, message: 'Subscription is not paused' });
    await sub.update({ status: 'ACTIVE', paused_at: null });
    res.json({ success: true, data: sub });
  } catch (err) {
    next(err);
  }
};

const cancelSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });
    await sub.update({ status: 'CANCELLED', cancelled_at: new Date() });
    res.json({ success: true, message: 'Subscription cancelled', data: sub });
  } catch (err) {
    next(err);
  }
};

const getAllSubscriptions = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const { rows, count } = await Subscription.findAndCountAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'mobile'] },
        { model: SubscriptionPlan, include: [{ model: Basket }] },
      ],
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

module.exports = {
  getPlans, getAllPlans, createPlan, updatePlan,
  subscribe, getMySubscriptions, pauseSubscription, resumeSubscription,
  cancelSubscription, getAllSubscriptions,
};
