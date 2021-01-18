const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const Trainer = require('../models/Trainer');
const Client = require('../models/Client');

const util = require('../util/util');
const { messageSorter } = util;

/* get user auth info (happens on every reload of ui, in app.js) */
router.get('/', auth, async (req, res) => {
  let { tokenUser } = req;
  if (tokenUser) {
    let { userId, userType } = tokenUser;
    let isClient = userType === 'client';
    let User = isClient ? Client : Trainer;

    User.findOne(
      { _id: userId },
      `+password settings email bio name profilePic coverPic ${
        !isClient && 'tags'
      }`
    )
      .then(async (foundUser) => {
        const {
          name,
          email,
          _id,
          coverPic,
          profilePic,
          settings,
          tags,
          bio,
        } = foundUser;
        let sortedMessages = await messageSorter(userId);
        return res.send({
          name,
          email,
          id: _id,
          coverPic,
          profilePic,
          userType: tokenUser.userType,
          messages: sortedMessages,
          settings,
          tags,
          bio,
        });
      })
      .catch((err) => {
        console.log('err: ', err);
        res.send({ err: 'database error' });
      });
  } else {
    return res.send({ err: 'no token' });
  }
});
module.exports = router;
