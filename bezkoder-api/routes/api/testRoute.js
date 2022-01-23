const express = require('express');
const router = express.Router();
const testCtrl = require('../../controllers/testCtrl');

router.post('/sendDataToRedis', testCtrl.sendDataToRedis);

module.exports = router;
