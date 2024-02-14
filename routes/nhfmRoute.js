const express = require('express'),
  router = express.Router(),
  { validateFormData } = require('./FormFunctions/validateFormData'),
  { randomBytes } = require('crypto'),
  MailFunctions = require('./MailFunctions/sendMail'),
  { sendMail } = MailFunctions;

router.post('/check_status', (req, res) => {
  if (req.session.csrf === undefined) {
    req.session.csrf = randomBytes(100).toString('base64');
    res.cookie('csrfToken', req.session.csrf);
  }
  res.status(200).send({ code: 200, msg: { csrf: req.session.csrf } });
});

router.get('/session_destroy', (req, res) => {
  if (req.session) {
    req.session.destroy();
  }

  res.status(200).send({ code: 200, msg: 'session destroyed' });
});

router.post('/send_mail', async (req, res) => {
  let formData = req.body;
  sendMail(formData, 'nhfm');
});

router.post('/online_form', async (req, res) => {
  console.log('Entered route /nhfm/online_form');
  let formData = req.body; // { name: '', email: '', phone: '', message: '' }

  if (req.body.token === undefined || req.session.csrf !== req.body.token) {
    return res
      .status(200)
      .send({ code: 403, msg: 'Token not valid', detail: null });
  }
  // remove that key - token
  delete formData['token'];

  let isFormValid = await validateFormData(formData);

  if (!isFormValid.valid) {
    res
      .status(200)
      .send({ code: 404, msg: 'Form not valid', detail: isFormValid.error });
  } else {
    sendMail(formData, 'nhfm', res);
  }
});

module.exports = router;
