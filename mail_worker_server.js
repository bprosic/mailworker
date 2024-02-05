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
  CREOLIC_BACKEND_DNS_ENDPOINT = process.env.CREOLIC_BACKEND_DNS_ENDPOINT,
  CREOLIC_BACKEND_LOCAL_ENDPOINT_3 =
    process.env.CREOLIC_BACKEND_LOCAL_ENDPOINT_3,
  routes = require('./routes'),
  path = require('path'),
  https = require('https'),
  fs = require('fs'),
  helmet = require('helmet'),
  compression = require('compression'),
  expressSession = require('express-session'); // for csrf

app.use(compression());
app.use(helmet());
// session is implemented only for csrf functionality
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET, // a secret string used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    name: 'creolic_session',
    cookie: {
      secure: false, // change this to true if using https
      path: '/',
      sameSite: 'none',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24hours
      // maxAge: 3000, // 3 seconds
      // maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days
      secret: process.env.CSRF_SECRET,
    },
  })
);

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
  // then cors origin would be localhost:3015 (not https://localhost:3015)
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
});

const allowedOrigins = [
  `${CREOLIC_FRONTEND_DNS_ENDPOINT}`, // frontend prosic.th-deg.de
  `${CREOLIC_FRONTEND_LOCAL_ENDPOINT}`, // frontend localhost
  `${CREOLIC_FRONTEND_IP_ENDPOINT}`, // frontend 0.0.0.0
  `${CREOLIC_FRONTEND_IP_ENDPOINT2}`, // frontend 192.168.162.184
  `${'http://192.168.162.184:8000/'}`, // frontend 192.168.162.184
  `${CREOLIC_BACKEND_LOCAL_ENDPOINT_1}`, // backend #9
  `${CREOLIC_BACKEND_LOCAL_ENDPOINT_2}`, // backend #9
  `${CREOLIC_BACKEND_DNS_ENDPOINT}`, // backend #10
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
      console.log('Not allowed next origin: ', origin);
      cb(new Error('Get back! Not allowed by CORS.'));
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
