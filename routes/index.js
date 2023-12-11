const express = require('express'),
  router = express.Router(),
  creolicRoute = require('./creolicRoute'),
  legalRoute = require('./legalRoute');

router.use('/creolic', creolicRoute);
router.use('/legal', legalRoute);

module.exports = router;
