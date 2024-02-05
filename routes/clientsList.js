module.exports = {
  creolic: {
    name: 'Creolic',
    websiteUrl: process.env.CREOLIC_FRONTEND_DNS_ENDPOINT,
    email1: 'no-reply@creolic.de',
    email2: 'no-reply@creolic.de',
    mailSettings: {
      host: process.env.CREOLIC_MAIL_HOST,
      port: process.env.CREOLIC_MAIL_PORT,
      username: process.env.CREOLIC_MAIL_USER,
      psw: process.env.CREOLIC_MAIL_PSW,
      introMailMessage: [
        'Thank you once again for choosing Creolic for your IT needs.',
        'Please be assured that your request is important to us, and we will be working diligently to address your IT concerns promptly. If you have any additional details or specific preferences, feel free to let us know so that we can tailor our services to meet your expectations.',
        'We look forward to serving you and contributing to the success of your business.',

        'Request details:',
        '---',
      ],
      outroMailMessage: [
        '---',
        'We commit to providing a response within one business day.',
      ],
      subject: 'Creolic Online inquiry',
    },
  },
  nhfm: {},
};
