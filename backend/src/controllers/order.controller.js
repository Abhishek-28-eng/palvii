const { Order, OrderItem, User, Product, Delivery } = require('../models');
const { Op } = require('sequelize');

const generateOrderNumber = () => {
  const prefix = 'PLV';
  const timestamp = Date.now().toString().slice(-6);
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${rand}`;
};

const createOrder = async (req, res, next) => {
  try {
    const {
      items, delivery_address, preferred_delivery_date,
      preferred_delivery_time, payment_method = 'CASH',
      customer_notes, whatsapp_order = false,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = items.map(item => {
      const itemSubtotal = parseFloat(item.price) * parseFloat(item.quantity);
      subtotal += itemSubtotal;
      return {
        product_id: item.product_id || null,
        basket_id: item.basket_id || null,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit || 'kg',
        subtotal: itemSubtotal,
      };
    });

    const delivery_charge = subtotal >= 300 ? 0 : 30;
    const total = subtotal + delivery_charge;

    const order = await Order.create({
      order_number: generateOrderNumber(),
      user_id: req.user.id,
      delivery_address,
      status: 'PENDING',
      payment_method,
      subtotal,
      delivery_charge,
      total,
      preferred_delivery_date,
      preferred_delivery_time,
      customer_notes,
      whatsapp_order,
    });

    await OrderItem.bulkCreate(orderItems.map(i => ({ ...i, order_id: order.id })));

    // Create delivery record
    await Delivery.create({
      order_id: order.id,
      scheduled_date: preferred_delivery_date,
      area: delivery_address?.area,
      society: delivery_address?.society,
    });

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem }],
    });

    res.status(201).json({ success: true, data: fullOrder });
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: OrderItem }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

const getOneOrder = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.user.role !== 'ADMIN') where.user_id = req.user.id;
    const order = await Order.findOne({
      where,
      include: [{ model: OrderItem }, { model: User, attributes: ['id', 'name', 'mobile'] }, { model: Delivery }],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    await order.update({ status: req.body.status, admin_notes: req.body.admin_notes });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, date } = req.query;
    const where = {};
    if (status) where.status = status;
    if (date) where.preferred_delivery_date = date;

    const { rows, count } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'mobile'] },
        { model: OrderItem },
        { model: Delivery },
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

module.exports = { createOrder, getMyOrders, getOneOrder, updateStatus, getAllOrders };
