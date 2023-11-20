const express = require('express'),
  router = express.Router(),
  { validateFormData } = require('./FormFunctions/validateFormData');
// express routes, - and . are interpreted literally
router.get('/is_server_online', (req, res) => {
  res.status(200).send('sve ok');
});

router.post('/online_form', async (req, res) => {
  let formData = req.body; // { name: '', email: '', phone: '', message: '' }
  let isFormValid = await validateFormData(formData);
  if (!isFormValid.valid) {
    res
      .status(200)
      .send({ code: 404, msg: 'Form not valid', detail: isFormValid.error });
  } else {
    res.status(200).send({ code: 200, msg: 'Form valid', details: req.body });
  }
});

module.exports = router;
