const express = require('express');
const app = express();
const port = 3001;
const { requireLogin } = require('./middleware');
const path = require('path');

const server = app.listen(port, () =>
  console.log(`example app listening on localhost:${port}`)
);

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const loginRoute = require('./routes/loginRoutes');

app.use('/login', loginRoute);

app.get('/', requireLogin, (req, res, next) => {
  let payload = {
    pageTitle: 'Home',
  };
  res.status(200).render('home', payload);
});
