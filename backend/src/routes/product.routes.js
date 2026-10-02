const router = require('express').Router();
const ctrl = require('../controllers/product.controller');
const { protect, requireAdmin } = require('../middleware/auth.middleware');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', protect, requireAdmin, ctrl.create);
router.put('/:id', protect, requireAdmin, ctrl.update);
router.delete('/:id', protect, requireAdmin, ctrl.remove);

module.exports = router;
