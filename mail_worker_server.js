const express = require('express'),
  app = express(),
  port = process.env.PORT || 3015,
  cors = require('cors'),
  cookieParser = require('cookie-parser'), // this is for CSRF
  bodyParser = require('body-parser'),
  FRONTEND_ENDPOINTS = process.env.FRONTEND_ENDPOINTS,
  BACKEND_ENDPOINTS = process.env.BACKEND_ENDPOINTS,
  BACKEND_USING_SSL = process.env.BACKEND_USING_SSL == 1,
  FRONTEND_USING_SSL = process.env.FRONTEND_USING_SSL == 1,
  // FRONTEND_ENDPOINTS_ARR = FRONTEND_ENDPOINTS
  //   ? FRONTEND_ENDPOINTS.split(';').map((x) => {
  //       return FRONTEND_USING_SSL ? `https://${x}` : `http://${x}`;
  //     })
  //   : '',
  // BACKEND_ENDPOINTS_ARR = BACKEND_ENDPOINTS
  //   ? BACKEND_ENDPOINTS.split(';').map((x) => {
  //       return BACKEND_USING_SSL ? `https://${x}` : `http://${x}`;
  //     })
  //   : '',
  FRONTEND_ENDPOINTS_ARR = FRONTEND_ENDPOINTS
    ? FRONTEND_ENDPOINTS.split(';').map((x) => {
        return FRONTEND_USING_SSL ? `https://${x}` : `http://${x}`;
      })
    : '',
  BACKEND_ENDPOINTS_ARR = BACKEND_ENDPOINTS ? BACKEND_ENDPOINTS.split(';') : '',
  routes = require('./routes'),
  path = require('path'),
  https = require('https'),
  fs = require('fs'),
  helmet = require('helmet'),
  compression = require('compression'),
  expressSession = require('express-session'), // for cs
  log4js = require('log4js');

log4js.configure({
  appenders: {
    server: { type: 'file', filename: 'mail_worker_server.log' },
    consoleLogs: { type: 'console' },
  },
  categories: {
    justConsole: { appenders: ['consoleLogs'], level: 'info' },
    default: { appenders: ['server', 'consoleLogs'], level: 'info' },
  },
});
const log = log4js.getLogger('mail_worker_server');

app.use(compression());
app.use(helmet());
// session is implemented only for csrf functionality
/* if ssl is enabled - and ssl is self signed, then firefox and chrome throws error 
  for firefox, I followed this: https://aboutssl.org/how-to-fix-mozilla-pkix-self-signed-cert-error/ (No, this doesnt work)
  In client (gatsby frontend) I added config
  {
    rejectUnauthorized: false, //add when working with https sites
    requestCert: false, //add when working with https sites
    agent: false, //add when working with https sites
  }
  and this also doesn't work.
  I added only in this file a new Agent ... no, doesnt work.
  Until now, I did not manage to work ssl.


*/

// IF USING http://DNS:8000 instead of http://localhost:8000,
// cookies will be saved in FF browser cache storage.
// When using http://localhost or IP Address - then cookies are not saved in chrome. Sometimes they are saved in FF, but not always
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET, // a secret string used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    name: 'creolic_session',
    cookie: {
      secure: BACKEND_USING_SSL, // change this to true if using https - Locally, if you set to true and use http - it will throw error.
      // Also, cookie in Chrome will not be saved and in firefox will be saved (this applies only on local development)
      // In production, you must always use HTTPS, and always enable the secure flag which stops the cookie from working over HTTP.
      path: '/',
      sameSite: 'lax', // When you are using a single domain for your pages and server, you should set SameSite to lax or strict
      // If you are using multiple origins, you must set it to none
      // In development - set to LAX and it will be saved also in Chrome!!! and also in Firefox
      httpOnly: true,
      // You must always use this option for session cookies httpOnly. httpOnly tells the browser the cookie should not be read or writable by JavaScript on the web page,
      // which is the only protection from a class of common XSS attack.
      maxAge: 24 * 60 * 60 * 1000, // 24hours
      // maxAge: 3000, // 3 seconds
      // maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days
      secret: process.env.CSRF_SECRET,
    },
  })
);
// in production use, or when hosted on heroku, uncomment next:
// app.set('trust proxy', 1);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json()); // csrf
app.use(cookieParser()); // csrf
//https://levelup.gitconnected.com/how-to-implement-csrf-tokens-in-express-f867c9e95af0
// set up the cookie for the session

// #9
app.use(function (req, res, next) {
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
  // then cors origin would be localhost:3015 (not https://localhost:3015)
});

const allowedOrigins = FRONTEND_ENDPOINTS_ARR.concat(BACKEND_ENDPOINTS_ARR); // you have to include both server and client
// console.log(BACKEND_ENDPOINTS_ARR);
// console.log(BACKEND_ENDPOINTS_ARR.indexOf('prosic.th-deg.de:3015')); // this will not find index as it is missing http or https

const corsOptions = {
  origin: (origin, cb) => {
    /* IF using this and if you want to run route from server directly, then origin would be always undefined.
        Write the middleware above (#9)
      */

    if (allowedOrigins.indexOf(origin) !== -1) {
      cb(null, true);
    } else {
      log.error(`Origin ${origin} is not allowed!`);
      // cb(new Error('Get back! Not allowed by CORS.'));
      cb(null, false);
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOptions));
// init middleware from body - to take from body parser
app.use(express.json({ extended: false }));
// in order to access public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

if (BACKEND_USING_SSL) {
  https
    .createServer(
      {
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem'),
        passphrase: '1234',
      },
      app
    )
    .listen(port, () => {
      console.log(`Using SSL - listening on https on port ${port}`);
    });
} else {
  app.listen(port, () => {
    console.log(`Listening on http on port ${port}`);
  });
}
