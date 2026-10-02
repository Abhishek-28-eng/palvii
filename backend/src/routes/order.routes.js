const router = require('express').Router();
const ctrl = require('../controllers/order.controller');
const { protect, requireAdmin } = require('../middleware/auth.middleware');

router.post('/', protect, ctrl.createOrder);
router.get('/my', protect, ctrl.getMyOrders);
router.get('/:id', protect, ctrl.getOneOrder);
router.get('/', protect, requireAdmin, ctrl.getAllOrders);
router.put('/:id/status', protect, requireAdmin, ctrl.updateStatus);

module.exports = router;
