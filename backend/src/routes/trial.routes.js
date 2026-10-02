const router = require('express').Router();
const ctrl = require('../controllers/trial.controller');
const { protect, requireAdmin } = require('../middleware/auth.middleware');

// Public + logged-in customers can submit trial requests
router.post('/', ctrl.create);

// Admin only
router.get('/', protect, requireAdmin, ctrl.getAll);
router.get('/:id', protect, requireAdmin, ctrl.getOne);
router.put('/:id/status', protect, requireAdmin, ctrl.updateStatus);

module.exports = router;
