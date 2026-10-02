const router = require('express').Router();
const ctrl = require('../controllers/review.controller');
const { protect, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', ctrl.getApproved);
router.post('/', protect, ctrl.create);
router.get('/all', protect, requireAdmin, ctrl.getAll);
router.put('/:id/approve', protect, requireAdmin, ctrl.approveReview);

module.exports = router;
