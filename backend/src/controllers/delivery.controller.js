const { Delivery, Order, User, OrderItem } = require('../models');
const { Op } = require('sequelize');

const getAll = async (req, res, next) => {
  try {
    const { date, area, society, status, page = 1, limit = 50 } = req.query;
    const where = {};
    if (date) where.scheduled_date = date;
    if (area) where.area = { [Op.like]: `%${area}%` };
    if (society) where.society = { [Op.like]: `%${society}%` };
    if (status) where.status = status;

    const { rows, count } = await Delivery.findAndCountAll({
      where,
      include: [{
        model: Order,
        include: [
          { model: User, attributes: ['id', 'name', 'mobile', 'whatsapp'] },
          { model: OrderItem },
        ],
      }],
      order: [['scheduled_date', 'ASC'], ['society', 'ASC']],
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

const updateDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });
    await delivery.update(req.body);
    if (req.body.status === 'DELIVERED') {
      await delivery.update({ delivered_at: new Date() });
      await Order.update({ status: 'DELIVERED' }, { where: { id: delivery.order_id } });
    }
    res.json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, updateDelivery };
