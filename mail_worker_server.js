const express = require('express'),
  app = express(),
  port = process.env.PORT || 3015,
  cors = require('cors'),
  bodyParser = require('body-parser'),
  CREOLIC_FRONTEND_DNS_ENDPOINT = process.env.CREOLIC_FRONTEND_DNS_ENDPOINT,
  CREOLIC_FRONTEND_LOCAL_ENDPOINT = process.env.CREOLIC_FRONTEND_LOCAL_ENDPOINT,
  CREOLIC_FRONTEND_IP_ENDPOINT = process.env.CREOLIC_FRONTEND_IP_ENDPOINT,
  CREOLIC_BACKEND_LOCAL_ENDPOINT_1 =
    process.env.CREOLIC_BACKEND_LOCAL_ENDPOINT_1,
  CREOLIC_BACKEND_LOCAL_ENDPOINT_2 =
    process.env.CREOLIC_BACKEND_LOCAL_ENDPOINT_2,
  routes = require('./routes'),
  https = require('https'),
  fs = require('fs'),
  uuid = require('uuid-v4'),
  helmet = require('helmet'),
  compression = require('compression');

app.use(compression());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// #9
app.use(function (req, res, next) {
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
  // then cors origin would be localhost:3015 (not https://localhost:3015)
});

const allowedOrigins = [
  `${CREOLIC_FRONTEND_DNS_ENDPOINT}`, // frontend
  `${CREOLIC_FRONTEND_LOCAL_ENDPOINT}`, // frontend
  `${CREOLIC_FRONTEND_IP_ENDPOINT}`, // frontend
  `${CREOLIC_BACKEND_LOCAL_ENDPOINT_1}`, // backend #9
  `${CREOLIC_BACKEND_LOCAL_ENDPOINT_2}`, // backend #9
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
      cb(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOptions));
// init middleware from body - to take from body parser
app.use(express.json({ extended: false }));

app.use('/', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
