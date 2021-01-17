const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');

router.get('/', (req, res, next) => {
  let payload = {
    pageTitle: req.session.user.username,
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    profileUser: req.session.user,
  };
  res.status(200).render('profilePage', payload);
});

router.get('/:username', async (req, res, next) => {
  const payload = await getPayload(req.params.username, req.session.user);
  console.log('payload:', payload);
  res.status(200).render('profilePage', payload);
});

const getPayload = async (username, userLoggedIn) => {
  const user = await User.findOne({
    username,
  });
  if (user === null) {
    return {
      pageTitle: 'user not found',
      userLoggedIn,
      userLoggedInJs: JSON.stringify(userLoggedIn),
    };
  }

  return {
    pageTitle: user.username,
    userLoggedIn,
    userLoggedInJs: JSON.stringify(userLoggedIn),
    profileUser: user,
  };
};

module.exports = router;
