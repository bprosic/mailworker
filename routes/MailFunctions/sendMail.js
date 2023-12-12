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
        link: process.env.CREOLIC_FRONTEND_DNS_ENDPOINT,
      },
    });
    const emailStructure = {
      body: {
        name: name,
        intro: [
          'Thank you once again for choosing Creolic for your IT needs.',
          'Please be assured that your request is important to us, and we will be working diligently to address your IT concerns promptly. If you have any additional details or specific preferences, feel free to let us know so that we can tailor our services to meet your expectations.',
          'We look forward to serving you and contributing to the success of your business.',

          'Request details:',
          '---',
        ],

        dictionary: {
          name: name,
          email: email,
          phone: `+${phone}`,
          message: message,
        },
        outro: [
          '---',
          'We commit to providing a response within one business day.',
        ],
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
