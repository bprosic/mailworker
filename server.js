const express = require('express'),
  app = express(),
  port = process.env.PORT || 3015;

app.get('/', (req, res) => {
  res.send('Hello World!');
});
// receive online form object and send it to email
app.post('/creolic/online-form', (req, res) => {
  res.status(200).send('sve ok');
  //   res.send('sve ok');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
