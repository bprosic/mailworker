module.exports = {
  creolic: {
    name: 'Creolic',
    websiteUrl: 'https://www.creolic.com',
    companyEmail: 'no-reply@creolic.com', // this will be email where is sending to owner
    mail: {
      server:
        process.env.CREOLIC_MAIL_USING_API == 1
          ? { api: process.env.CREOLIC_MAIL_API, inProduction: true }
          : {
              host: process.env.CREOLIC_MAIL_HOST,
              port: process.env.CREOLIC_MAIL_PORT,
              username: process.env.CREOLIC_MAIL_USER,
              psw: process.env.CREOLIC_MAIL_PSW,
              inProduction: false,
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
    companyEmail: 'boris.prosic@gmail.com', // this email should be the same in sendgrid
    mail: {
      server:
        process.env.NHFM_MAIL_USING_API == 1
          ? { api: process.env.NHFM_MAIL_API, inProduction: true }
          : {
              host: process.env.NHFM_MAIL_HOST,
              port: process.env.NHFM_MAIL_PORT,
              username: process.env.NHFM_MAIL_USER,
              psw: process.env.NHFM_MAIL_PSW,
              inProduction: false,
            },
      contentForClient: {
        intro: ['Danke Kunde ...', 'Nachricht details:', '___'],
        outro: ['___', 'Nachricht ende.'],
        subject: 'not defined',
      },
      contentForOwner: {
        intro: [
          'ein Kunde hat über das Online-Formular der Website eine Nachricht gesendet.',
          'Nachricht details:',
          '___',
        ],
        outro: [
          '___',
          'Nachricht ende.',
          'Um dem Kunden weiterzuhelfen, klicken Sie einfach auf die E-Mail des Kunden.',
        ],
        subject: 'Nachricht von newhouse-facility.com Online Form',
      },
    },
  },
};
