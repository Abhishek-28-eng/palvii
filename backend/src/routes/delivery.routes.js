const router = require('express').Router();
const ctrl = require('../controllers/delivery.controller');
const { protect, requireAdmin, requireDelivery } = require('../middleware/auth.middleware');

router.get('/', protect, requireAdmin, ctrl.getAll);
router.put('/:id', protect, requireDelivery, ctrl.updateDelivery);

module.exports = router;
