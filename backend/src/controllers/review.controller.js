const { Review, User, TrialRequest } = require('../models');

const create = async (req, res, next) => {
  try {
    const {
      trial_request_id, order_id,
      overall_rating, quality_rating, packing_rating,
      delivery_rating, comment, continue_preference,
    } = req.body;

    const review = await Review.create({
      user_id: req.user.id,
      trial_request_id: trial_request_id || null,
      order_id: order_id || null,
      overall_rating, quality_rating, packing_rating,
      delivery_rating, comment, continue_preference,
    });

    // Update trial request status if feedback received
    if (trial_request_id) {
      await TrialRequest.update(
        { status: 'FEEDBACK_RECEIVED' },
        { where: { id: trial_request_id } }
      );
    }

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

const getApproved = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { is_approved: true },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['is_featured', 'DESC'], ['created_at', 'DESC']],
      limit: 10,
    });
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'mobile'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};

const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.update({ is_approved: req.body.is_approved, is_featured: req.body.is_featured });
    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getApproved, getAll, approveReview };
