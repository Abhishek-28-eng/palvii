const router = require('express').Router();
const ctrl = require('../controllers/subscription.controller');
const { protect, requireAdmin } = require('../middleware/auth.middleware');

// Public
router.get('/plans', ctrl.getPlans);

// Customer
router.post('/', protect, ctrl.subscribe);
router.get('/my', protect, ctrl.getMySubscriptions);
router.put('/:id/pause', protect, ctrl.pauseSubscription);
router.put('/:id/resume', protect, ctrl.resumeSubscription);
router.put('/:id/cancel', protect, ctrl.cancelSubscription);

// Admin
router.get('/', protect, requireAdmin, ctrl.getAllSubscriptions);
router.get('/plans/all', protect, requireAdmin, ctrl.getAllPlans);
router.post('/plans', protect, requireAdmin, ctrl.createPlan);
router.put('/plans/:id', protect, requireAdmin, ctrl.updatePlan);

module.exports = router;
