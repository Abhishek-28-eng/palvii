const { Category } = require('../models');

const getAll = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.active !== 'false') where.is_active = true;
    const categories = await Category.findAll({
      where,
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    await cat.update(req.body);
    res.json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    await cat.destroy();
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create, update, remove };
