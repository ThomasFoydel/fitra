const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Client = require('../models/Client');
const Trainer = require('../models/Trainer');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');
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
    '+password settings',
    async function (err, client) {
      if (err) {
        return res.json({
          err:
            'Sorry, there is an issue with connecting to the database. We are working on fixing this.',
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
            userId: client._id,
            email: client.email,
            name: client.name,
            coverPic: client.coverPic,
            profilePic: client.profilePic,
            settings: client.settings,
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
  // get user id from req.tokenUser
  // fetch user from db
  // check user preferences
  // search db for trainers
  // return relevant trainers
  // console.log(' get trainers. tokenUser', req.tokenUser.userId);
  const trainers = await Trainer.find();
  res.send({ trainers });
});

// get profile info of specific trainer
router.get('/trainer/:trainerId', async (req, res) => {
  // get trainer id from req.params
  let { trainerId } = req.params;
  // fetch trainer from db
  // get user id from req.tokenUser
  // fetch user from db, check if subscribed to trainer
  // send back profile of trainer, and ifSubscribed
  // console.log(' get trainer. tokenUser', req.tokenUser.userId);
  let trainer = await Trainer.findById(trainerId);
  res.send({ trainer });
});

router.get('/dashboard', auth, async (req, res) => {
  const { userId } = req.tokenUser;
  const foundAppointments = await Appointment.find(
    { client: userId }
    // { sort: ['startTime', 'asc'] }
  )
    .sort({ startTime: 1 })
    .select('-roomId');
  console.log(foundAppointments);
  res.send({ appointments: foundAppointments });
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
// const privateMessagesArray = await PrivateMessage.find({
//   $and: [
//     { participants: { $in: [friendId] } },
//     { participants: { $in: [message.senderId] } }
//   ]
// })

router.get('/info/:id', auth, async (req, res) => {
  // Client.findById(req.params.id)
  // .then((user) => res.send({ user }))
  // .catch((err) => res.send({ err }));

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
module.exports = router;
