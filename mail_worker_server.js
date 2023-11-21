const { randomBytes } = require('crypto');

const express = require('express'),
  app = express(),
  port = process.env.PORT || 3015,
  cors = require('cors'),
  cookieParser = require('cookie-parser'), // this is for CSRF
  bodyParser = require('body-parser'),
  CREOLIC_FRONTEND_DNS_ENDPOINT = process.env.CREOLIC_FRONTEND_DNS_ENDPOINT,
  CREOLIC_FRONTEND_LOCAL_ENDPOINT = process.env.CREOLIC_FRONTEND_LOCAL_ENDPOINT,
  CREOLIC_FRONTEND_IP_ENDPOINT = process.env.CREOLIC_FRONTEND_IP_ENDPOINT,
  CREOLIC_FRONTEND_IP_ENDPOINT2 = process.env.CREOLIC_FRONTEND_IP_ENDPOINT2,
  CREOLIC_BACKEND_LOCAL_ENDPOINT_1 =
    process.env.CREOLIC_BACKEND_LOCAL_ENDPOINT_1,
  CREOLIC_BACKEND_LOCAL_ENDPOINT_2 =
    process.env.CREOLIC_BACKEND_LOCAL_ENDPOINT_2,
  CREOLIC_BACKEND_LOCAL_ENDPOINT_3 =
    process.env.CREOLIC_BACKEND_LOCAL_ENDPOINT_3,
  routes = require('./routes'),
  https = require('https'),
  fs = require('fs'),
  uuid = require('uuid-v4'),
  helmet = require('helmet'),
  compression = require('compression'),
  csrf = require('csrf'),
  expressSession = require('express-session'); // for csrf

app.use(compression());
app.use(helmet());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json()); // csrf
app.use(cookieParser()); // csrf
//https://levelup.gitconnected.com/how-to-implement-csrf-tokens-in-express-f867c9e95af0
// set up the cookie for the session
app.use(
  expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      path: '/',
      name: 'creolic_session',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      secret: 'MAKE_THIS_SECRET_SECURE',
    },
  })
);

const attachCsrfToken = (req, res, next) => {
  console.log('req.session', req.session);
  if (req.session.csrf === undefined) {
    console.log('usao u req.session.csrf');
    req.session.csrf = randomBytes(100).toString('base64');
  }
  // const csrfTokenToSendToFrontEnd = req.csrfToken();
  // console.log('csrfTokenToSendToFrontEnd: ', csrfTokenToSendToFrontEnd);
  // // this cookie must be XSRF-TOKEN, because already defined as default in Angular.
  // res.cookie('XSRF-TOKEN', csrfTokenToSendToFrontEnd);
  next();

  // next();
  // var tokenFrontEnd = req.csrfToken();
  // res.cookie('xsrf-token', tokenFrontEnd); // do not change def names
  // res.locals._csrf = tokenFrontEnd; // make the token available to all views. Do not change _csrf name
  // console.log(tokenFrontEnd);
  // next();
};

// error handler
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }
  res.status(403).json({
    message: 'error',
  });
});

// #9
app.use(function (req, res, next) {
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
  // then cors origin would be localhost:3015 (not https://localhost:3015)
});

const allowedOrigins = [
  `${CREOLIC_FRONTEND_DNS_ENDPOINT}`, // frontend prosic.th-deg.de
  `${CREOLIC_FRONTEND_LOCAL_ENDPOINT}`, // frontend localhost
  `${CREOLIC_FRONTEND_IP_ENDPOINT}`, // frontend 0.0.0.0
  `${CREOLIC_FRONTEND_IP_ENDPOINT2}`, // frontend 192.168.162.184
  `${CREOLIC_BACKEND_LOCAL_ENDPOINT_1}`, // backend #9
  `${CREOLIC_BACKEND_LOCAL_ENDPOINT_2}`, // backend #9
  `${CREOLIC_BACKEND_LOCAL_ENDPOINT_3}`, // backend #9 // delete this for production
]; // you have to include both server and client
const corsOptions = {
  origin: (origin, cb) => {
    /* IF using this and if you want to run route from server directly, then origin would be always undefined.
        Write the middleware above (#9)
      */

    if (allowedOrigins.indexOf(origin) !== -1) {
      cb(null, true);
    } else {
      console.log('origin: ', origin);
      cb(new Error('Get back! Not allowed by CORS.'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOptions));
// init middleware from body - to take from body parser
app.use(express.json({ extended: false }));

// app.use('/creolic/online_form', csrfProtect, function (req, res) {
//   console.log('usaoo.');
//   res.status(200).send(req.csrfToken());
// });

app.use('/', attachCsrfToken, routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
