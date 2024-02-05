const express = require('express'),
  router = express.Router(),
  creolicRoute = require('./creolicRoute'),
  nhfmRoute = require('./nhfmRoute'),
  legalRoute = require('./legalRoute');

router.use('/creolic', creolicRoute);
router.use('/nhfm', nhfmRoute);
router.use('/legal', legalRoute);

module.exports = router;
