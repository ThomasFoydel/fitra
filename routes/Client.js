const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Client = require('../models/Client');
const Trainer = require('../models/Trainer');
const Review = require('../models/Review');
const Session = require('../models/Session');
const Message = require('../models/Message');
const util = require('../util/util');
const mongoose = require('mongoose');
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

  const existingClient = await Client.findOne({ email: email });
  if (existingClient) {
    return res.send({ err: 'Account with this email already exists' });
  }

  const hashedPw = await bcrypt.hash(password, 12);

  const newClient = new Client({
    name: name,
    email: email.toLowerCase(),
    password: hashedPw,
    settings: { darkmode: false },
  });

  newClient
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.send({ err: 'all fields required' });
  }
  Client.findOne(
    { email: req.body.email },
    '+password settings email name coverPic profilePic bio',
    async function (err, client) {
      if (err) {
        return res.json({
          err:
            'Sorry, there is an issue with connecting to the database. We are working on fixing this issue.',
        });
      } else {
        if (!client) {
          return res.json({ err: 'No client found with this email' });
        }
        const passwordsMatch = await bcrypt.compare(
          req.body.password,
          client.password
        );
        if (passwordsMatch) {
          const token = jwt.sign(
            {
              tokenUser: {
                userId: client._id,
                email: client.email,
                userType: 'client',
              },
            },
            process.env.SECRET,
            { expiresIn: '1000hr' }
          );
          const messages = await messageSorter(client._id.toString());
          const clientInfo = {
            id: client._id,
            email: client.email,
            name: client.name,
            coverPic: client.coverPic,
            profilePic: client.profilePic,
            settings: client.settings,
            bio: client.bio,
            messages,
          };
          res.json({
            status: 'success',
            message: 'Login successful',
            data: {
              user: clientInfo,
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

// search for relevant trainers
router.get('/trainers', async (req, res) => {
  const trainers = await Trainer.find();
  res.send({ trainers });
});

// get profile info of specific trainer
router.get('/trainer/:trainerId', async ({ params: { trainerId } }, res) => {
  try {
    trainerId = new mongoose.Types.ObjectId(trainerId);
  } catch (err) {
    return res.send({ err: 'No user found' });
  }
  let foundTrainer = await Trainer.findById(trainerId);
  let foundReviews = await Review.find({ trainer: trainerId });

  let averageAggregate = await Review.aggregate([
    {
      $group: { _id: trainerId, average: { $avg: '$rating' } },
    },
  ]);
  let foundAvg = averageAggregate[0].average;
  let foundSession = await Session.find({
    trainer: foundTrainer._id,
  }).select('-roomId -createdAt -updatedAt -status -client -trainer -order');
  res.send({ trainer: foundTrainer, foundSession, foundReviews, foundAvg });
});

router.get('/profile/:id', auth, async ({ params: { id } }, res) => {
  try {
    id = new mongoose.Types.ObjectId(id);
  } catch (err) {
    return res.send({ err: 'No user found' });
  }
  let foundUser = await Client.findById(id);
  if (foundUser) return res.send({ foundUser });
  else return res.send({ err: 'No user found' });
});

router.post('/editprofile/', auth, (req, res) => {
  let { userId } = req.tokenUser;
  let formInfo = req.body;
  let update = {};
  Object.keys(formInfo).forEach((key) => {
    let trimmedValue = formInfo[key].replace(/^\s+|\s+$/gm, '');
    if (trimmedValue && trimmedValue.length > 0) update[key] = trimmedValue;
  });

  Client.findOneAndUpdate({ _id: userId }, update, {
    new: true,
    useFindAndModify: false,
  })
    .then((result) => res.send(result))
    .catch((err) => res.send({ err: 'database error' }));
});

router.get('/dashboard', auth, async (req, res) => {
  const { userId } = req.tokenUser;
  const foundSession = await Session.find(
    { client: userId }
    // { sort: ['startTime', 'asc'] }
  )
    .sort({ startTime: 1 })
    .select('-roomId');
  res.send({ sessions: foundSession });
});
router.get('/messages', auth, async (req, res) => {
  const { userId } = req.tokenUser;
  const userMessages = await Message.find({
    participants: { $in: [userId] },
  })
    .sort({ createdAt: 1 })
    .limit(1000);
  if (!userMessages || userMessages.length < 1)
    return res.send({ err: 'no messages' });
  let sortedMessages = {};
  userMessages.forEach((msg) => {
    let otherUser = msg.participants.filter(
      (participant) => participant !== userId
    );
    if (sortedMessages[otherUser])
      sortedMessages[otherUser] = [...sortedMessages[otherUser], msg];
    else sortedMessages[otherUser] = [msg];
  });
  res.send({ messages: sortedMessages });
});

router.get('/info/:id', auth, async (req, res) => {
  let foundUser;

  Client.findById(req.params.id)
    .then((user) => {
      if (user) foundUser = user;
    })
    .catch((err) => res.send({ err }));

  Trainer.findById(req.params.id)
    .then((user) => {
      if (user) foundUser = user;
    })
    .catch((err) => res.send({ err }));

  if (foundUser) res.send({ user: foundUser });
});

router.post(
  '/search/:queryType',
  async ({ body: { search }, params: { queryType } }, res) => {
    let searchArray = search.split(' ');
    let filteredArray = searchArray.filter(Boolean);
    let queryFilter = [];
    filteredArray.forEach((term) =>
      queryFilter.push({ [queryType]: { $regex: `${term}`, $options: '$i' } })
    );
    if (queryFilter.length < 1)
      return res.send({ err: 'requires at least one term' });
    Trainer.find({ $or: queryFilter }).then((result) => {
      console.log({ [search]: result });
      res.send({ result });
    });
    // Trainer.find(     { $or: [{ tags: { $regex: `${term}`, $options: '$i' } }, { name: { $regex: `${term}`, $options: '$i' } },   ]}  )
  }
);

router.post(
  '/review/:sessionId',
  auth,
  async (
    { body: { rating, comment }, params: { sessionId }, tokenUser: { userId } },
    res
  ) => {
    let foundSession = await Session.findById(sessionId);
    if (!foundSession) return res.send({ err: 'No session found' });
    if (foundSession.client !== userId)
      return res.send({ err: 'Not authorized' });
    const newReview = new Review({
      client: userId,
      trainer: foundSession.trainer,
      session: sessionId,
      rating,
      comment,
    });
    newReview
      .save()
      .then(async (savedReview) => {
        let updatedSession = await Session.findOneAndUpdate(
          { _id: sessionId },
          { status: 'reviewed' },
          { useFindAndModify: false, new: true }
        );
        res.send({ updatedSession, savedReview });
      })
      .catch((err) => res.send({ err }));
  }
);

module.exports = router;
