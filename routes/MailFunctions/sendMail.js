const nodemailer = require('nodemailer'),
  Mailgen = require('mailgen'),
  ClientsList = require('../clientsList');

const sendMail = (formDataObj, client, res) => {
  if (formDataObj === undefined || formDataObj === null) {
    console.log('no form data to validate, obj is null.');
    if (res) {
      return res.status(500).send('no form data to validate, obj is null.');
    }
    return;
    // obj { name: '', email: '', phone: '', message: '' }
  }
  if (!client) {
    console.log('no client name, client string is null.');
    if (res) {
      res.status(500).send('no client name, client string is null.');
    }
    return;
  }
  if (!ClientsList[client]) {
    console.log(
      `No client name found in clientList.js dictionary. Keyword search was: '${client}', but no data found in dictionary.`
    );
    if (res) {
      return res.status(500).send('no client name in dictionary');
    }
    return;
  }

  const {
      mail,
      name: CompanyName,
      websiteUrl: CompanyWebsite,
      emailFrom: CompanyEmail1,
    } = ClientsList[client],
    { server, content } = mail,
    {
      host: emailHost,
      port: emailPort,
      username: emailUsername,
      psw: emailPsw,
      api: emailApi,
    } = server,
    { intro, outro, subject } = content;

  let { name, email, phone, message } = formDataObj;
  try {
    name = name.trim();
    email = email.trim();
    message = message.trim();
  } catch (error) {
    console.log('no form data');
    if (res) {
      return res
        .status(500)
        .send('form data exists, but something is undefined.');
    }
    return;
  }

  if (name.length === 0 || email.length === 0 || message.length === 0) {
    console.log('no form data');
    if (res) {
      return res.status(500).send('no form data.');
    }
    return;
  }

  // https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/

  if (process.env.MAIL_USING_API == 1) {
    // web api - used in production
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
      // generate email body using Mailgen
      const MailGenerator = new Mailgen({
        theme: 'default',
        product: {
          name: CompanyName,
          link: CompanyWebsite,
        },
      });
      const emailStructure = {
        body: {
          name: name,
          intro: intro,
          // gathered information from form
          dictionary: {
            name: name,
            email: email,
            phone: phone === undefined ? `-` : `+${phone}`,
            message: message,
          },
          outro: outro,
        },
      };

      const emailBody = MailGenerator.generate(emailStructure);
      // send mail with defined transport object
      const mailOptions = {
        from: email, // use email from form
        to: CompanyEmail1, // to creolic or to nhfm
        subject: subject, // subject
        html: emailBody,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('err in transporter send mail:', error);
          if (res) {
            res.status(500).send('Error sending email');
          }
        } else {
          console.log('Email sent: ' + info.response);
          if (res) {
            res
              .status(200)
              .send({ code: 200, msg: 'Form valid', details: formData });
          }
        }
      });
    } catch (error) {
      console.log(
        'Error in send mail function, in big try...catch, error:',
        error
      );
    }
  }

  // if everything was alright, then return true
};
module.exports = { sendMail };
