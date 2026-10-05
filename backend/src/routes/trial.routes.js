const router = require('express').Router();
const ctrl = require('../controllers/trial.controller');
const { protect, requireAdmin } = require('../middleware/auth.middleware');

// Public: submit trial request
router.post('/', ctrl.create);

// Public: pre-check mobile before form submit (used on mobile blur)
router.get('/check', ctrl.checkByMobile);

// Admin only
router.get('/',        protect, requireAdmin, ctrl.getAll);
router.get('/:id',    protect, requireAdmin, ctrl.getOne);
router.put('/:id/status', protect, requireAdmin, ctrl.updateStatus);
router.delete('/:id', protect, requireAdmin, ctrl.remove);

module.exports = router;
