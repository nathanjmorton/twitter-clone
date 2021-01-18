const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.put('/:userId/follow', async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (user === null) {
    return res.sendStatus(404);
  }

  const isFollowing =
    user.followers && user.followers.includes(req.session.user._id);
  const option = isFollowing ? '$pull' : '$addToSet';

  // Insert logged in user following the profile user
  req.session.user = await User.findByIdAndUpdate(
    req.session.user._id,
    { [option]: { following: userId } },
    { new: true }
  ).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

  // Insert user logged in as follower to profile user
  User.findByIdAndUpdate(userId, {
    [option]: { followers: req.session.user._id },
  }).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });

  res.status(200).send(req.session.user);
});

module.exports = router;
