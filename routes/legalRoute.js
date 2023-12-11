const express = require('express'),
  router = express.Router(),
  path = require('path');

// eng
router.get('/en/data_privacy', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../public/html/data_privacy/en', 'data_privacy.html')
  );
});

module.exports = router;
