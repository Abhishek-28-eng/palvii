const { User, Order, Subscription, TrialRequest, Delivery } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalCustomers,
      trialRequests,
      activeSubscriptions,
      todaysOrders,
      pendingOrders,
      todaysDeliveries,
    ] = await Promise.all([
      User.count({ where: { role: 'CUSTOMER' } }),
      TrialRequest.count({ where: { status: 'PENDING' } }),
      Subscription.count({ where: { status: 'ACTIVE' } }),
      Order.count({ where: { created_at: { [Op.gte]: new Date(today) } } }),
      Order.count({ where: { status: 'PENDING' } }),
      Delivery.count({ where: { scheduled_date: today } }),
    ]);

    const revenueResult = await Order.findOne({
      attributes: [[fn('SUM', col('total')), 'total_revenue']],
      where: { status: { [Op.not]: 'CANCELLED' } },
      raw: true,
    });

    res.json({
      success: true,
      data: {
        totalCustomers,
        trialRequests,
        activeSubscriptions,
        todaysOrders,
        pendingOrders,
        todaysDeliveries,
        totalRevenue: parseFloat(revenueResult?.total_revenue || 0),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const where = { role: 'CUSTOMER' };
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
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

module.exports = { getDashboardStats, getCustomers };
