const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middlewares/auth');
const Trainer = require('../models/Trainer');
const Session = require('../models/Session');
const mongoose = require('mongoose');

const util = require('../util/util');
const Client = require('../models/Client');
const { messageSorter } = util;

router.post('/register', async (req, res) => {
  let { email, name, password, confirmpassword } = req.body;

  let allFieldsExist = email && name && password && confirmpassword;
  if (!allFieldsExist) {
    return res.send({ err: 'all fields required' });
  }

  if (password.length < 8) {
    return res.send({ err: 'Password must be at least 6 characters' });
  }
  if (name.length < 2 || name.length > 15) {
    return res.send({ err: 'Name must be between 4 and 12 characters' });
  }
  if (password !== confirmpassword) {
    return res.send({ err: 'Passwords do not match' });
  }
  if (!email.includes('@') || !email.includes('.')) {
    return res.send({ err: 'Valid email required' });
  }

  const existingTrainer = await Trainer.findOne({ email: email });
  if (existingTrainer) {
    return res.send({ err: 'Account with this email already exists' });
  }

  const hashedPw = await bcrypt.hash(password, 12);

  const newTrainer = new Trainer({
    name: name,
    email: email.toLowerCase(),
    password: hashedPw,
    settings: { darkmode: false },
    availability: [],
  });

  newTrainer
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post('/login', (req, res) => {
  Trainer.findOne(
    { email: req.body.email },
    '+password settings name email bio profilePic coverPic tags',
    async function (err, user) {
      if (err) {
        return res.json({
          err:
            'Sorry, there is an issue with connecting to the database. We are working on fixing this.',
        });
      } else {
        if (!user) {
          return res.json({ err: 'No user found with this email' });
        }
        const passwordsMatch = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (passwordsMatch) {
          const token = jwt.sign(
            {
              tokenUser: {
                userId: user._id,
                email: user.email,
                userType: 'trainer',
              },
            },
            process.env.SECRET,
            { expiresIn: '1000hr' }
          );
          const messages = await messageSorter(user._id.toString());
          const userInfo = {
            userId: user._id,
            email: user.email,
            name: user.name,
            coverPic: user.coverPic,
            profilePic: user.profilePic,
            settings: user.settings,
            messages,
            id: user._id,
            tags: user.tags,
          };
          res.json({
            status: 'success',
            message: 'Login successful',
            data: {
              user: userInfo,
              token,
            },
          });
        } else {
          return res.json({ err: 'Incorrect password' });
        }
      }
    }
  );
});

router.get('/dashboard', auth, (req, res) => {
  let { userId } = req.tokenUser;
  Session.find({ trainer: userId })
    .select('-roomId')
    .then((sessions) => res.send({ sessions }))
    .catch((err) => res.send('Database error'));
  //res.send(result)
});

router.post('/editprofile/', auth, (req, res) => {
  let { userId } = req.tokenUser;
  let formInfo = req.body;
  let update = {};
  Object.keys(formInfo).forEach((key) => {
    let trimmedValue = formInfo[key].replace(/^\s+|\s+$/gm, '');
    if (trimmedValue && trimmedValue.length > 0) update[key] = trimmedValue;
  });

  Trainer.findOneAndUpdate({ _id: userId }, update, {
    new: true,
    useFindAndModify: false,
  })
    .then((result) => res.send(result))
    .catch((err) => res.send({ err: 'database error' }));
});

router.get('/schedule/', auth, async (req, res) => {
  let { userId } = req.tokenUser;
  let foundTrainer = await Trainer.findById(userId);
  let entries = foundTrainer.availability || [];

  let foundSessions = await Session.find({ trainer: userId });

  let { minimum, maximum } = foundTrainer || {};
  res.send({ entries, min: minimum, max: maximum, foundSessions });
});

router.post('/schedule/', auth, async ({ tokenUser, body }, res) => {
  let { userId } = tokenUser;
  Trainer.findOneAndUpdate(
    { _id: userId },
    { availability: body },
    { new: true, useFindAndModify: false }
  )
    .then((user) => res.send(user.availability || []))
    .catch((err) => res.send({ err }));
});

router.post(
  '/minmax/:type',
  auth,
  async ({ params: { type }, tokenUser, body: { value } }, res) => {
    let { userId } = tokenUser;

    let foundTrainer = await Trainer.findById(userId);
    if (type === 'maximum' && value < foundTrainer.minimum)
      return res.send({ err: 'maximum must be greater than minimum' });
    if (type === 'minimum' && value > foundTrainer.maximum)
      return res.send({ err: 'minimum cannot be greater than maximum' });

    Trainer.findOneAndUpdate(
      { _id: userId },
      { [type]: Number(value) },
      { new: true, useFindAndModify: false }
    )
      .then((user) => {
        return res.send({ min: user.minimum, max: user.maximum });
      })
      .catch((err) => res.send({ err }));
  }
);

router.post('/rate/', auth, async ({ tokenUser, body }, res) => {
  let { userId } = tokenUser;
  Trainer.findOneAndUpdate(
    { _id: userId },
    { rate: body },
    { new: true, useFindAndModify: false }
  )
    .then((user) => res.send(user.rate || []))
    .catch((err) => res.send({ err }));
});

router.get('/session/:id', auth, async ({ params: { id } }, res) => {
  let _id;
  try {
    _id = new mongoose.Types.ObjectId(id);
  } catch (err) {
    // mongo id cast error, user's using incorrect url
    return res.send({ err: 'No session found' });
  }
  let foundSession = await Session.findById(_id).select('-roomId');
  if (!foundSession) return res.send({ err: 'No session found' });
  let foundClient = await Client.findById(foundSession.client);
  return res.send({ foundSession, foundClient });
});

router.post('/cancel-session/', auth, async ({ body: { id } }, res) => {
  let deletedSession = await Session.findByIdAndDelete(id);
  if (deletedSession) res.send({ id: deletedSession.id });
  else res.send({ err: 'No session found' });
});

router.post(
  '/add-tag',
  auth,
  async ({ tokenUser: { userId }, body: { value } }, res) => {
    let foundTrainer = await Trainer.findById(userId);
    if (!foundTrainer) return res.send({ err: 'User not found' });
    if (foundTrainer.tags.indexOf(value) > -1)
      return res.send({ err: 'Tag duplicate' });
    if (foundTrainer.tags.length >= 4)
      return res.send({ err: 'Tag list limited to 4 tags' });
    Trainer.findOneAndUpdate(
      { _id: userId },
      { $push: { tags: value } },
      { new: true, useFindAndModify: false }
    )
      .then((result) => res.send(result.tags))
      .catch((err) => {
        console.log({ err });
        res.send({ err: 'database error' });
      });
  }
);
router.post(
  '/delete-tag',
  auth,
  async ({ tokenUser: { userId }, body: { value } }, res) => {
    let foundTrainer = await Trainer.findById(userId);
    if (!foundTrainer) return res.send({ err: 'User not found' });
    let tags = [...foundTrainer.tags];
    let filteredTags = tags.filter((t) => t !== value);
    Trainer.findOneAndUpdate(
      { _id: userId },
      { tags: filteredTags },
      { new: true, useFindAndModify: false }
    )
      .then((result) => {
        res.send(result.tags);
      })
      .catch((err) => {
        res.send({ err });
      });
  }
);
module.exports = router;
