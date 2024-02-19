const express = require('express'),
  router = express.Router(),
  { validateFormData } = require('./FormFunctions/validateFormData'),
  MailFunctions = require('./MailFunctions/sendMail'),
  { sendMail } = MailFunctions,
  log4js = require('log4js'),
  log = log4js.getLogger('nhfmRoute.js'),
  axios = require('axios'),
  rateLimitMiddleware = require('../middlewares/RateLimitFunctions'),
  BlockRouteMiddleware = require('../middlewares/BlockRoute');

router.get('/session_destroy', (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.status(200).send({ code: 200, msg: 'session destroyed' });
});

// https://clerk.com/blog/implementing-recaptcha-in-react

router.post(
  '/online_form',
  rateLimitMiddleware,
  BlockRouteMiddleware,
  async (req, res) => {
    let formData = req.body; // { name: '', email: '', phone: '', message: '', token: '', googleToken: '' }

    if (req.body.googleToken === undefined || req.body.googleToken === '') {
      log.error('Token not valid, form data:');
      delete formData['token'];
      delete formData['googleToken'];
      log.error(formData);
      return res
        .status(200)
        .send({ code: 403, msg: 'Token not valid', detail: null });
      // if you submit from address http://localhost - it will throw return this function
      // because of session token - it will not be saved in FF or Chrome!!
    }
    // remove that key - token
    delete formData['token'];
    // check if robot - recaptcha
    // const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_SECRET_KEY}&response=${googleToken}`;
    // let googleResponse = await fetch(verificationUrl);
    let googleToken = formData['googleToken'];

    let googleResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_SECRET_KEY}&response=${googleToken}`
    );
    let { data: dataFromGoogleServer } = googleResponse;

    let { success, score } = dataFromGoogleServer;
    if (success) {
      delete formData['googleToken'];
      let isFormValid = await validateFormData(formData);

      if (!isFormValid.valid) {
        return res.status(200).send({
          code: 404,
          msg: 'Form invalid, not all information were true.',
          detail: isFormValid.error,
        });
      }

      sendMail(formData, 'nhfm');
      res.status(200).send({ code: 200, msg: 'Form valid', details: formData });
    } else {
      delete formData['googleToken'];
      log.error('Google token not valid, score and form data:');
      log.error(`Google Score was: ${score} and form data was:`);
      log.error(formData);
      return res
        .status(200)
        .send({ code: 403, msg: 'Token(s) not valid', detail: null });
    }
  }
);

module.exports = router;
