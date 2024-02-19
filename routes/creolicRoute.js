const express = require('express'),
  router = express.Router(),
  BlockRouteMiddleware = require('../middlewares/BlockRoute'),
  { validateFormData } = require('./FormFunctions/validateFormData'),
  { randomBytes } = require('crypto'),
  MailFunctions = require('./MailFunctions/sendMail'),
  { sendMail } = MailFunctions,
  rateLimitMiddleware = require('../middlewares/RateLimitFunctions');

// express routes, - and . are interpreted literally
router.get('/is_server_online', (req, res) => {
  res.status(200).send({ code: 200, msg: 'ok' });
});

router.post('/check_status', BlockRouteMiddleware, (req, res) => {
  console.log('usao u checkstatus');
  const isCookieSecure = process.env.NODE_ENV === 'production';

  if (req.session.csrf === undefined) {
    req.session.csrf = randomBytes(100).toString('base64');

    // res
    //   .cookie('csrfToken', req.session.csrf, {
    //     httpOnly: false,
    //     secure: false,
    //     sameSite: 'none',
    //     domain: '.192.168.162.184',
    //   })
    //   .status(200);

    // watch out, if using mobile phone, then this req.session will not be saved into session variable
    // it is because of http protocol
  }
  // console.log('there is session csrf token, ', req.session.csrf);
  return res
    .cookie('csr', req.session.csrf, {
      httpOnly: true, // set to false in production
      secure: isCookieSecure, // when ssl, set to true. Without ssl, false!
      domain: '192.168.162.184',
    })
    .status(200)
    .send({ code: 200, msg: { csrf: req.session.csrf } });

  // res.status(200).send({ code: 200, msg: { csrf: req.session.csrf } });
});

router.get('/session_destroy', (req, res) => {
  if (req.session) {
    // console.log('session destroyed');
    req.session.destroy();
  }

  res.status(200).send({ code: 200, msg: 'session destroyed' });
});

router.post('/send_mail', async (req, res) => {
  // delete this
  let formData = req.body;
  sendMail(formData);
});

router.get('/test', async (req, res) => {
  // delete this
  console.log('usao u test');
  const isCookieSecure = process.env.NODE_ENV === 'production';

  if (req.session.csrf === undefined) {
    req.session.csrf = randomBytes(100).toString('base64');

    // res.
    // watch out, if using mobile phone, then this req.session will not be saved into session variable
    // it is because of http protocol
    return res
      .cookie('csrfToken2', req.session.csrf, {
        httpOnly: isCookieSecure,
        secure: isCookieSecure, // when ssl, set to true. Without ssl, false!
        domain: '.192.168.162.184',
      })
      .status(200)
      .send({ code: 200, msg: { csrf: req.session.csrf } });
  }
});
router.post('/test', rateLimitMiddleware, async (req, res) => {
  // delete this
  const formData = req.body;
  sendMail(formData, 'creolic', res);
});

router.post('/online_form', rateLimitMiddleware, async (req, res) => {
  let formData = req.body; // { name: '', email: '', phone: '', message: '' }
  // console.log('/online-form');
  // console.log('req.body.token: ', req.body.token);
  // console.log('req.session.csrf: ', req.session.csrf);
  if (req.body.token === undefined || req.session.csrf !== req.body.token) {
    return res
      .status(200)
      .send({ code: 403, msg: 'Token not valid', detail: null });
  }
  // remove that key - token
  delete formData['token'];

  let isFormValid = await validateFormData(formData);

  if (!isFormValid.valid) {
    console.log('form not valid?', isFormValid);
    res
      .status(200)
      .send({ code: 404, msg: 'Form not valid', detail: isFormValid.error });
  } else {
    console.log('sending mail...');
    // sendMail(formData, 'creolic');

    res.status(200).send({ code: 200, msg: 'Form valid', details: formData });
  }
});

module.exports = router;
