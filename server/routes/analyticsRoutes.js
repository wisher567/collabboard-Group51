const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/', analyticsController.getAnalytics);
router.post('/resolve-bottlenecks', analyticsController.resolveBottlenecks);
router.get('/export', analyticsController.exportReport);

module.exports = router;
