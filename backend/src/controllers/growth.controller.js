const { ServiceArea, Waitlist, TrialRequest, Subscription } = require('../models');
const { Op, fn, col } = require('sequelize');
const { notifyOwner } = require('../utils/notify');

// ── Public: check if an area/pincode is serviceable ────────────────────────
const checkServiceability = async (req, res, next) => {
  try {
    const { area, pincode } = req.query;
    if (!area && !pincode) {
      return res.status(400).json({ success: false, message: 'area or pincode required' });
    }

    const where = { is_active: true };
    const orConditions = [];
    if (pincode) orConditions.push({ pincode });
    if (area)    orConditions.push({ area: { [Op.like]: `%${area}%` } });
    where[Op.or] = orConditions;

    const match = await ServiceArea.findOne({ where });
    res.json({ success: true, serviceable: !!match, area: match?.area || null });
  } catch (err) {
    next(err);
  }
};

// ── Public: join waitlist (non-serviceable area) ────────────────────────────
const joinWaitlist = async (req, res, next) => {
  try {
    const { name, mobile, area, pincode, society } = req.body;
    if (!name || !mobile || !area) {
      return res.status(400).json({ success: false, message: 'name, mobile and area are required' });
    }

    // Prevent duplicate waitlist entries for same mobile
    const existing = await Waitlist.findOne({ where: { mobile } });
    if (existing) {
      return res.json({
        success: true,
        message: `You're already on our waitlist for ${existing.area}. We'll notify you as soon as we launch there! 🌿`,
        already_registered: true,
      });
    }

    await Waitlist.create({ name, mobile, area, pincode, society });

    // Notify owner about new waitlist signup
    notifyOwner(
      `📋 *Waitlist Signup*\n👤 ${name} · 📱 ${mobile}\n📍 ${area}${pincode ? ` (${pincode})` : ''}${society ? `\n🏠 ${society}` : ''}`
    ).catch(() => {});

    res.status(201).json({
      success: true,
      message: `You're on the list, ${name.split(' ')[0]}! We'll WhatsApp you the moment we launch in ${area}. 🌿`,
    });
  } catch (err) {
    next(err);
  }
};

// ── Admin: list all service areas ──────────────────────────────────────────
const getServiceAreas = async (req, res, next) => {
  try {
    const areas = await ServiceArea.findAll({ order: [['area', 'ASC']] });
    res.json({ success: true, data: areas });
  } catch (err) {
    next(err);
  }
};

// ── Admin: add a service area ──────────────────────────────────────────────
const addServiceArea = async (req, res, next) => {
  try {
    const { area, pincode, city, notes } = req.body;
    if (!area) return res.status(400).json({ success: false, message: 'area is required' });
    const sa = await ServiceArea.create({ area, pincode, city, notes });
    res.status(201).json({ success: true, data: sa });
  } catch (err) {
    next(err);
  }
};

// ── Admin: toggle area active/inactive ─────────────────────────────────────
const updateServiceArea = async (req, res, next) => {
  try {
    const sa = await ServiceArea.findByPk(req.params.id);
    if (!sa) return res.status(404).json({ success: false, message: 'Not found' });
    await sa.update(req.body);
    res.json({ success: true, data: sa });
  } catch (err) {
    next(err);
  }
};

const deleteServiceArea = async (req, res, next) => {
  try {
    const sa = await ServiceArea.findByPk(req.params.id);
    if (!sa) return res.status(404).json({ success: false, message: 'Not found' });
    await sa.destroy();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// ── Admin: waitlist grouped by area (demand heatmap) ─────────────────────
const getWaitlist = async (req, res, next) => {
  try {
    const { notified } = req.query;
    const where = {};
    if (notified === 'false') where.notified = false;
    if (notified === 'true')  where.notified = true;

    const entries = await Waitlist.findAll({
      where,
      order: [['created_at', 'DESC']],
    });

    // Group by area for the demand heatmap
    const byArea = entries.reduce((acc, e) => {
      const key = e.area;
      if (!acc[key]) acc[key] = { area: e.area, count: 0, entries: [] };
      acc[key].count++;
      acc[key].entries.push(e);
      return acc;
    }, {});

    res.json({
      success: true,
      data: entries,
      total: entries.length,
      by_area: Object.values(byArea).sort((a, b) => b.count - a.count),
    });
  } catch (err) {
    next(err);
  }
};

// ── Admin: notify waitlist for an area (when you expand there) ───────────
const notifyWaitlistArea = async (req, res, next) => {
  try {
    const { area } = req.params;
    const entries = await Waitlist.findAll({
      where: { area: { [Op.like]: `%${area}%` }, notified: false },
    });

    if (entries.length === 0) {
      return res.json({ success: true, message: 'No unnotified entries for this area', count: 0 });
    }

    // Send WhatsApp to each person on the waitlist for this area
    const { notifyOwner: send } = require('../utils/notify');
    let sent = 0;
    for (const e of entries) {
      const msg = `Hi ${e.name.split(' ')[0]}! 🌿 Great news — Palvii is now delivering fresh vegetables in *${e.area}*! Click here to claim your FREE starter basket: https://palvii.devwithabhi.de/trial`;
      await send(msg).catch(() => {});
      await e.update({ notified: true, notified_at: new Date() });
      sent++;
    }

    res.json({ success: true, message: `Notified ${sent} people in ${area}`, count: sent });
  } catch (err) {
    next(err);
  }
};

// ── Admin: conversion funnel analytics ────────────────────────────────────
const getAnalytics = async (req, res, next) => {
  try {
    const trialStatuses = ['PENDING', 'APPROVED', 'SCHEDULED', 'DELIVERED', 'FEEDBACK_RECEIVED', 'CONVERTED', 'NOT_CONVERTED', 'REJECTED'];

    // Trial funnel
    const trialFunnel = await Promise.all(
      trialStatuses.map(async (status) => ({
        status,
        count: await TrialRequest.count({ where: { status } }),
      }))
    );

    // Trial → subscriber conversion rate
    const totalDelivered  = trialFunnel.find(t => t.status === 'DELIVERED')?.count || 0;
    const totalConverted  = trialFunnel.find(t => t.status === 'CONVERTED')?.count || 0;
    const conversionRate  = totalDelivered > 0 ? Math.round((totalConverted / totalDelivered) * 100) : 0;

    // Top areas by trial volume
    const { sequelize } = require('../models');
    const areaBreakdown = await TrialRequest.findAll({
      attributes: ['area', [fn('COUNT', col('id')), 'count']],
      where: { area: { [Op.not]: null } },
      group: ['area'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: 10,
      raw: true,
    });

    // Family size distribution
    const familySizes = await TrialRequest.findAll({
      attributes: ['family_size', [fn('COUNT', col('id')), 'count']],
      where: { family_size: { [Op.not]: null } },
      group: ['family_size'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      raw: true,
    });

    // Waitlist demand heatmap
    const waitlistDemand = await Waitlist.findAll({
      attributes: ['area', [fn('COUNT', col('id')), 'count']],
      group: ['area'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: 10,
      raw: true,
    });

    // Active subscriptions
    const activeSubscriptions = await Subscription.count({ where: { status: 'ACTIVE' } });

    res.json({
      success: true,
      data: {
        trial_funnel: trialFunnel,
        conversion_rate: conversionRate,
        total_delivered: totalDelivered,
        total_converted: totalConverted,
        active_subscriptions: activeSubscriptions,
        top_areas: areaBreakdown,
        family_size_distribution: familySizes,
        waitlist_demand: waitlistDemand,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkServiceability,
  joinWaitlist,
  getServiceAreas,
  addServiceArea,
  updateServiceArea,
  deleteServiceArea,
  getWaitlist,
  notifyWaitlistArea,
  getAnalytics,
};
