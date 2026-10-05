const router = require('express').Router();
const ctrl   = require('../controllers/growth.controller');
const { protect, requireAdmin } = require('../middleware/auth.middleware');

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/serviceability', ctrl.checkServiceability);
router.post('/waitlist',      ctrl.joinWaitlist);

// ── Admin ──────────────────────────────────────────────────────────────────
router.get('/analytics',           protect, requireAdmin, ctrl.getAnalytics);
router.get('/service-areas',       protect, requireAdmin, ctrl.getServiceAreas);
router.post('/service-areas',      protect, requireAdmin, ctrl.addServiceArea);
router.put('/service-areas/:id',   protect, requireAdmin, ctrl.updateServiceArea);
router.delete('/service-areas/:id',protect, requireAdmin, ctrl.deleteServiceArea);
router.get('/waitlist',            protect, requireAdmin, ctrl.getWaitlist);
router.post('/waitlist/notify/:area', protect, requireAdmin, ctrl.notifyWaitlistArea);

module.exports = router;
