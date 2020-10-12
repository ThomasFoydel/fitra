const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middlewares/auth');
const Trainer = require('../models/Trainer');
const Appointment = require('../models/Appointment');

const util = require('../util/util');
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
    '+password settings name email bio profilePic coverPic',
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
  // Trainer.findById(userId).then((result) =>
  //   console.log('resultttt:  ', result)
  // );
  Appointment.find({ trainer: userId })
    .select('-roomId')
    .then((appointments) => res.send({ appointments }))
    .catch((err) => res.send('Database error'));
  //res.send(result)
});

router.post('/editprofile/', auth, (req, res) => {
  let { userId } = req.tokenUser;
  let formInfo = req.body;
  Trainer.findOneAndUpdate({ _id: userId }, formInfo, { new: true })
    .then((result) => res.send(result))
    .catch((err) => res.send({ err: 'database error' }));
});

router.get('/schedule/', auth, async (req, res) => {
  let { userId } = req.tokenUser;
  let foundTrainer = await Trainer.findById(userId);
  let entries = foundTrainer.availability || [];
  res.send({ entries, min: foundTrainer.minimum });
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

router.post('/minimum/', auth, async ({ tokenUser, body: { value } }, res) => {
  let { userId } = tokenUser;

  Trainer.findOneAndUpdate(
    { _id: userId },
    { minimum: Number(value) },
    { new: true, useFindAndModify: false }
  )
    .then((user) => {
      return res.send({ min: user.minimum });
    })
    .catch((err) => res.send({ err }));
});

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
module.exports = router;
