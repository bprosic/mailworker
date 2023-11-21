const express = require('express'),
  router = express.Router(),
  { validateFormData } = require('./FormFunctions/validateFormData');
// express routes, - and . are interpreted literally
router.get('/is_server_online', (req, res) => {
  res.status(200).send({ code: 200, msg: 'ok' });
});

router.get('/check_status', (req, res) => {
  res.status(200).send({ code: 200, msg: { csrf: req.session.csrf } });
});

router.post('/online_form', async (req, res) => {
  let formData = req.body; // { name: '', email: '', phone: '', message: '' }
  console.log('req body', req.body);
  if (req.session.csrf !== req.body.token) {
    console.log('req.session.csrf', req.session.csrf);
    console.log('req.body.token', req.body.token);
    return res
      .status(200)
      .send({ code: 403, msg: 'Csrf token not valid', detail: null });
  }
  // remove that key - token
  let newArray = formData.forEach((element) => {
    delete element.token;
  });
  console.log('newArray', newArray);
  let isFormValid = await validateFormData(newArray);
  if (!isFormValid.valid) {
    res
      .status(200)
      .send({ code: 404, msg: 'Form not valid', detail: isFormValid.error });
  } else {
    res.status(200).send({ code: 200, msg: 'Form valid', details: newArray });
  }
});

module.exports = router;
