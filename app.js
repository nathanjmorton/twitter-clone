const express = require('express');
const app = express();
const port = 80;
const { requireLogin } = require('./middleware');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./database');
const session = require('express-session');

const server = app.listen(port, () =>
  console.log(`example app listening on localhost:${port}`)
);

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'watermelon',
    resave: true,
    saveUninitialized: false,
  })
);

// Browser Routes - Require
const loginRoute = require('./routes/loginRoutes');
const logoutRoute = require('./routes/logout');
const registerRoute = require('./routes/registerRoutes');
const postRoute = require('./routes/postRoutes');
const profileRoute = require('./routes/profileRoutes');
const uploadRoute = require('./routes/uploadRoutes');
const searchRoute = require('./routes/searchRoutes');

// API Routes - Require
const postsApiRoute = require('./routes/api/posts');
const usersApiRoute = require('./routes/api/users');

// Browser Routes - Apply
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/register', registerRoute);
app.use('/post', requireLogin, postRoute);
app.use('/profile', requireLogin, profileRoute);
app.use('/uploads', uploadRoute);
app.use('/search', requireLogin, searchRoute);

// API Routes - Apply
app.use('/api/posts', postsApiRoute);
app.use('/api/users', usersApiRoute);

app.get('/', requireLogin, (req, res, next) => {
  let payload = {
    pageTitle: 'Home',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };
  res.status(200).render('home', payload);
});
