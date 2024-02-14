module.exports = {
  creolic: {
    name: 'Creolic',
    websiteUrl: 'https://www.creolic.com',
    emailFrom: 'no-reply@creolic.com',
    emailReply: 'no-reply@creolic.com',
    mail: {
      server:
        process.env.MAIL_USING_API == 1
          ? { api: process.env.MAIL_API }
          : {
              host: process.env.MAIL_HOST,
              port: process.env.MAIL_PORT,
              username: process.env.MAIL_USER,
              psw: process.env.MAIL_PSW,
            },
      content: {
        intro: [
          'Thank you once again for choosing Creolic for your IT needs.',
          'Please be assured that your request is important to us, and we will be working diligently to address your IT concerns promptly. If you have any additional details or specific preferences, feel free to let us know so that we can tailor our services to meet your expectations.',
          'We look forward to serving you and contributing to the success of your business.',

          'Request details:',
          '---',
        ],
        outro: [
          '---',
          'We commit to providing a response within one business day.',
        ],
        subject: 'Creolic Online inquiry',
      },
    },
  },
  nhfm: {
    name: 'New House Facility Management',
    websiteUrl: 'https://www.newhouse-facility.com',
    emailFrom: 'no-reply@newhouse-facility.com',
    mail: {
      server:
        process.env.MAIL_USING_API == 1
          ? { api: process.env.MAIL_API }
          : {
              host: process.env.MAIL_HOST,
              port: process.env.MAIL_PORT,
              username: process.env.MAIL_USER,
              psw: process.env.MAIL_PSW,
            },
      content: {
        intro: [
          'Hallo, Sie haben eine Nachricht von Website Online Form erhalten.',
          'Nachricht details, start:',
          '---',
        ],
        outro: ['---', 'Nachricht ende.'],
        subject: 'Nachricht von newhouse-facility.com Online Form',
      },
    },
  },
};
