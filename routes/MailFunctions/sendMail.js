const nodemailer = require('nodemailer'),
  Mailgen = require('mailgen');

const sendMail = (obj) => {
  if (obj === undefined || obj === null) {
    console.log('no form data to validate, obj is null.');
    return;
  }
  // obj { name: '', email: '', phone: '', message: '' }

  let { name, email, phone, message } = obj;
  name = name.trim();
  email = email.trim();
  message = message.trim();

  if (name.length === 0 || email.length === 0 || message.length === 0) {
    console.log('no form data');
    return;
  }

  // https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/

  // let transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     type: 'OAuth2',
  //     user: process.env.MAIL_USERNAME,
  //     pass: process.env.MAIL_PASSWORD,
  //     clientId: process.env.OAUTH_CLIENTID,
  //     clientSecret: process.env.OAUTH_CLIENT_SECRET,
  //     refreshToken: process.env.OAUTH_REFRESH_TOKEN
  //   }
  // });
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PSW,
      },
    });
    // generate email body using Mailgen
    const MailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Creolic',
        link: 'https://creolic.com/',
      },
    });
    const emailStructure = {
      body: {
        name: name,
        intro: 'thank you for your question',
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    const emailBody = MailGenerator.generate(emailStructure);
    // send mail with defined transport object
    const mailOptions = {
      from: email,
      to: 'no-reply@creolic.com',
      subject: 'Creolic Online inquiry',
      html: emailBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Email sent successfully');
      }
    });
  } catch (error) {
    console.log(
      'Error in send mail function, in big try...catch, error:',
      error
    );
  }

  // if everything was alright, then return true
};
module.exports = { sendMail };
