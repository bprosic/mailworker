const nodemailer = require('nodemailer'),
  Mailgen = require('mailgen'),
  ClientsList = require('../clientsList');

const sendMail = (formDataObj, client, res) => {
  if (formDataObj === undefined || formDataObj === null) {
    console.log('no form data to validate, obj is null.');
    return false;
    // obj { name: '', email: '', phone: '', message: '' }
  }
  if (!client) {
    console.log('no client name, client string is null.');
    return false;
  }
  if (!ClientsList[client]) {
    console.log(
      `No client name found in clientList.js dictionary. Keyword search was: '${client}', but no data found in dictionary.`
    );
    return false;
  }
  console.log('tu sam');
  console.log('Clients', ClientsList);
  console.log(ClientsList[client].mailSettings.intro);
  res.status(200).send('ok');
  const {
      mailSettings,
      name: CompanyName,
      websiteUrl: CompanyWebsite,
      email1: CompanyEmail1,
      email2: CompanyEmail2,
    } = ClientsList[client],
    {
      host: emailHost,
      port: emailPort,
      username: emailUsername,
      psw: emailPsw,
      introMailMessage,
      outroMailMessage,
      subject: emailSubject,
    } = mailSettings;
  console.log(ddd);
  return;

  let { name, email, phone, message } = formDataObj;
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
      host: process.env.CREOLIC_MAIL_HOST,
      port: process.env.CREOLIC_MAIL_PORT,
      auth: {
        user: process.env.CREOLIC_MAIL_USER,
        pass: process.env.CREOLIC_MAIL_PSW,
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
        // gathered information from form
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
      from: email, // use email from form
      to: 'no-reply@creolic.com', // to creolic or to nhfm
      subject: 'Creolic Online inquiry', // subject
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
