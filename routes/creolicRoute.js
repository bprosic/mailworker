const express = require('express'),
  router = express.Router(),
  { validateFormData } = require('./FormFunctions/validateFormData');
// express routes, - and . are interpreted literally
router.get('/is_server_online', (req, res) => {
  res.status(200).send('sve ok');
});

router.post('/online_form', (req, res) => {
  console.log(req.body);
  let formData = req.body; // { name: '', email: '', phone: '', message: '' }
  let isFormValid = validateFormData(formData);
  res.status(200).send('saved');
});

module.exports = router;
