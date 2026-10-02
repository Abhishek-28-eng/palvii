const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const { protect, requireAdmin } = require('../middleware/auth.middleware');

router.get('/dashboard', protect, requireAdmin, ctrl.getDashboardStats);
router.get('/customers', protect, requireAdmin, ctrl.getCustomers);

module.exports = router;
