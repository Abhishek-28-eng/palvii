const { Product, Category } = require('../models');
const { Op } = require('sequelize');

const getAll = async (req, res, next) => {
  try {
    const { category, featured, seasonal, search, page = 1, limit = 20 } = req.query;
    const where = { is_active: true };
    if (category) where.category_id = category;
    if (featured === 'true') where.is_featured = true;
    if (seasonal === 'true') where.is_seasonal = true;
    if (search) where.name = { [Op.like]: `%${search}%` };

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { [Op.or]: [{ id: req.params.id }, { slug: req.params.id }] },
      include: [{ model: Category }],
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.update(req.body);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.destroy();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
