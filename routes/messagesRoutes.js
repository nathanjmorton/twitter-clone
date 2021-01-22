const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');
const Chat = require('../schemas/ChatSchema');

router.get('/', (req, res, next) => {
  res.status(200).render('inboxPage', {
    pageTitle: 'Inbox',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  });
});

router.get('/new', (req, res, next) => {
  res.status(200).render('newMessage', {
    pageTitle: 'New message',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  });
});

router.get('/:chatId', async (req, res, next) => {
  const userId = req.session.user._id;
  const chatId = req.params.chatId;

  const payload = {
    pageTitle: 'Chat',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };

  const chat = await Chat.findOne({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  }).populate('users');

  if (chat !== null) {
    // Check if chatId is really userId
    const userFound = await User.findById(chatId);

    if (userFound === null) {
      // get chat using user id
    }
  }

  if (chat === null) {
    payload.errorMessage =
      'Chat does not exist or you do not have permission to view it';
  } else {
    payload.chat = chat;
  }

  res.status(200).render('chatPage', payload);
});

module.exports = router;
