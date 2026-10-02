const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/profile', protect, ctrl.getProfile);
router.put('/profile', protect, ctrl.updateProfile);
router.get('/addresses', protect, ctrl.getAddresses);
router.post('/addresses', protect, ctrl.addAddress);
router.put('/addresses/:id', protect, ctrl.updateAddress);
router.delete('/addresses/:id', protect, ctrl.deleteAddress);

module.exports = router;
