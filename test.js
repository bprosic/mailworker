const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://prosic.th-deg.de');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Route to set a cookie
app.get('/set-cookie', (req, res) => {
  console.log('usao u set cookie');
  res.cookie('myCookie', 'cookieValue', { maxAge: 900000, httpOnly: true });
  res.send('Cookie has been set');
});

app.listen(3015, () => {
  console.log('Server is running on port 3015');
});
