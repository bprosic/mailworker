const nodemailer = require('nodemailer'),
  Mailgen = require('mailgen'),
  ClientsList = require('../clientsList'),
  log4js = require('log4js'),
  log = log4js.getLogger('sendMail.js');

const sendMail = (formDataObj, client, res) => {
  if (formDataObj === undefined || formDataObj === null) {
    // console.log('no form data to validate, obj is null.');
    if (res) {
      return res.status(500).send('no form data to validate, obj is null.');
    }
    return;
    // obj { name: '', email: '', phone: '', message: '' }
  }
  if (!client) {
    // console.log('no client name, client string is null.');
    if (res) {
      res.status(500).send('no client name, client string is null.');
    }
    return;
  }
  if (!ClientsList[client]) {
    // console.log(
    //   `No client name found in clientList.js dictionary. Keyword search was: '${client}', but no data found in dictionary.`
    // );
    if (res) {
      return res.status(500).send('no client name in dictionary');
    }
    return;
  }
  // console.log('Client:', ClientsList[client]);
  const {
      mail,
      name: CompanyName,
      websiteUrl: CompanyWebsite,
      companyEmail: CompanyEmail1,
    } = ClientsList[client],
    { server, contentForClient, contentForOwner } = mail,
    {
      host: emailHost,
      port: emailPort,
      username: emailUsername,
      psw: emailPsw,
      api: emailApi,
      inProduction: inProductionUse,
    } = server,
    {
      intro: introClient,
      outro: outroClient,
      subject: subjectClient,
    } = contentForClient,
    {
      intro: introOwner,
      outro: outroOwner,
      subject: subjectOwner,
    } = contentForOwner;

  let { name, email, phone, message } = formDataObj;
  try {
    name = name.trim();
    email = email.trim();
    message = message.trim();
  } catch (error) {
    // console.log('no form data');
    if (res) {
      return res
        .status(500)
        .send('form data exists, but some of info are missing.');
    }
    return;
  }

  if (name.length === 0 || email.length === 0 || message.length === 0) {
    // console.log('no form data');
    if (res) {
      return res.status(500).send('no form data.');
    }
    return;
  }

  // https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/

  // generate email body using Mailgen
  const MailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: CompanyName,
      link: CompanyWebsite,
    },
  });
  const emailForOwner = {
    body: {
      name: 'Pavle',
      intro: introOwner,
      // gathered information from form
      dictionary: {
        'Kunde Name': name,
        'Kunde Email': email,
        'Kunde Phone':
          phone === undefined || phone.length == 0
            ? `KUNDE HAT NICHT EINGETRAGEN`
            : `+${phone}`,
        Nachricht: message,
      },
      signature: false,
      outro: outroOwner,
    },
  };

  const emailBodyOwner = MailGenerator.generate(emailForOwner);
  // send mail with defined transport object
  const mailOptions = {
    to: 'boris.prosic@gmail.com', // to creolic or to nhfm owner
    from: inProductionUse == 1 ? CompanyEmail1 : email, // use email from form
    subject: subjectOwner,
    html: emailBodyOwner,
  };

  if (inProductionUse == 1) {
    // web api - used in production
    // console.log('using api in production');
    // console.log('api:', emailApi);
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(emailApi);

    sgMail
      .send(mailOptions)
      .then(() => {
        // console.log('Email sent');
      })
      .catch((error) => {
        log.error('Error in sgMail while sending Email - error:');
        log.error(error);
      });
  } else {
    // smtp - using in development

    try {
      const transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        auth: {
          user: emailUsername,
          pass: emailPsw,
        },
      });

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          // console.log('err in transporter send mail:', error);
          if (res) {
            res.status(500).send('Error sending email');
          }
        } else {
          // console.log('Email sent: ' + info.response);
          // console.log('res.status', res.status);
          // console.log('res.status', res.status);
          if (res) {
            res.send({ code: 200, msg: 'Form valid', details: formData });
          } else return true;
        }
      });
    } catch (error) {
      log.error(
        'Error in send mail function, in big try...catch, error:',
        error
      );
    }
  }

  // if everything was alright, then return true
};
module.exports = { sendMail };
