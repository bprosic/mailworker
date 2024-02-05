const express = require('express'),
  router = express.Router(),
  { validateFormData } = require('./FormFunctions/validateFormData'),
  { randomBytes } = require('crypto'),
  MailFunctions = require('./MailFunctions/sendMail'),
  { sendMail } = MailFunctions,
  rateLimitMiddleware = require('../middlewares/RateLimitFunctions');

// express routes, - and . are interpreted literally
router.get('/is_server_online', (req, res) => {
  res.status(200).send({ code: 200, msg: 'ok' });
});

router.post('/check_status', (req, res) => {
  if (req.session.csrf === undefined) {
    req.session.csrf = randomBytes(100).toString('base64');

    console.log('no csrf token, adding: ', req.session.csrf);
    res.cookie('csrfToken', req.session.csrf);
    // watch out, if using mobile phone, then this req.session will not be saved into session variable
    // it is because of http protocol
  }
  console.log('there is session csrf token, ', req.session.csrf);
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
  sendMail(formData);
});

router.get('/test', async (req, res) => {
  let a = sendMail(
    { name: 'ff', email: 'dd@th-deg.de', message: 'ded' },
    'creolic1',
    res
  );
  if (!a) {
    return res
      .status(500)
      .send({ code: 500, msg: 'Email not sent, error', detail: null });
  }
});

router.post('/online_form', rateLimitMiddleware, async (req, res) => {
  let formData = req.body; // { name: '', email: '', phone: '', message: '' }
  console.log('/online-form');
  console.log('req.body.token: ', req.body.token);
  console.log('req.session.csrf: ', req.session.csrf);
  if (req.body.token === undefined || req.session.csrf !== req.body.token) {
    console.log('token not valid');
    return res
      .status(200)
      .send({ code: 403, msg: 'Token not valid', detail: null });
  }
  // remove that key - token
  delete formData['token'];

  let isFormValid = await validateFormData(formData);

  if (!isFormValid.valid) {
    console.log('form not valid?');
    res
      .status(200)
      .send({ code: 404, msg: 'Form not valid', detail: isFormValid.error });
  } else {
    console.log('sending mail...');
    sendMail(formData);

    res.status(200).send({ code: 200, msg: 'Form valid', details: formData });
  }
});

module.exports = router;
