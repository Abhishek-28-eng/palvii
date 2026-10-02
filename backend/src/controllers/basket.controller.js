const { Basket, BasketItem, Product, Category } = require('../models');
const { Op } = require('sequelize');

const getAll = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.active !== 'false') where.is_active = true;
    const baskets = await Basket.findAll({
      where,
      include: [{
        model: BasketItem,
        include: [{
          model: Product,
          include: [{ model: Category, attributes: ['id', 'name'] }],
          attributes: ['id', 'name', 'unit', 'price', 'image'],
        }],
      }],
      order: [['sort_order', 'ASC']],
    });
    res.json({ success: true, data: baskets });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const basket = await Basket.findOne({
      where: { [Op.or]: [{ id: req.params.id }, { slug: req.params.id }] },
      include: [{
        model: BasketItem,
        include: [{ model: Product, include: [{ model: Category }] }],
      }],
    });
    if (!basket) return res.status(404).json({ success: false, message: 'Basket not found' });
    res.json({ success: true, data: basket });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { items, ...basketData } = req.body;
    const basket = await Basket.create(basketData);
    if (items && items.length > 0) {
      await BasketItem.bulkCreate(items.map(i => ({ ...i, basket_id: basket.id })));
    }
    res.status(201).json({ success: true, data: basket });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const basket = await Basket.findByPk(req.params.id);
    if (!basket) return res.status(404).json({ success: false, message: 'Basket not found' });
    const { items, ...basketData } = req.body;
    await basket.update(basketData);
    if (items !== undefined) {
      await BasketItem.destroy({ where: { basket_id: basket.id } });
      if (items.length > 0) {
        await BasketItem.bulkCreate(items.map(i => ({ ...i, basket_id: basket.id })));
      }
    }
    res.json({ success: true, data: basket });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const basket = await Basket.findByPk(req.params.id);
    if (!basket) return res.status(404).json({ success: false, message: 'Basket not found' });
    await basket.destroy();
    res.json({ success: true, message: 'Basket deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
