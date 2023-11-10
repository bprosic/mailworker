const express = require('express'),
  router = express.Router(),
  creolicRoute = require('./creolicRoute');

router.use('/creolic', creolicRoute);

module.exports = router;
