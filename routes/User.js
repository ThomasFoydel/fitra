const express = require('express');
const bcrypt = require('bcryptjs');

const auth = require('../middlewares/auth');
const Trainer = require('../models/Trainer');
const Client = require('../models/Client');

const router = express.Router();

router.get('/:id', auth, async (req, res) => {
  let { id } = req.params;
  const foundClient = await Client.findById(id);
  if (foundClient)
    res.send({ user: { ...foundClient, email: foundClient.displayEmail } });
  else {
    const foundTrainer = await Trainer.findById(id);
    if (foundTrainer)
      return res.send({
        user: { ...foundTrainer, email: foundTrainer.displayEmail },
      });
    else return res.send({ err: 'no user found' });
  }
});

router.put('/settings/:type/:setting', auth, async (req, res) => {
  let { type, setting } = req.params;
  let { value } = req.body;
  let { userId } = req.tokenUser;
  let User = type === 'client' ? Client : Trainer;

  User.findByIdAndUpdate(
    userId,
    { $set: { [`settings.${setting}`]: value } },
    { new: true, useFindAndModify: false, fields: { settings: 1 } }
  )
    .then(({ settings }) => res.send(settings))
    .catch((err) => {
      console.log('setting update error: ', err);
      return res.send({ err: 'database error' });
    });
});

router.delete(
  '/delete_my_account/:type',
  auth,
  async (
    { tokenUser: { userId }, params: { type }, headers: { pass } },
    res
  ) => {
    let User = type === 'client' ? Client : Trainer;
    const foundUser = await User.findById(userId);
    if (!foundUser) return res.send({ err: 'No user found' });

    const passwordsMatch = await bcrypt.compare(pass, foundUser.password);
    if (passwordsMatch) {
      User.findByIdAndDelete(userId)
        .then((result) => {
          console.log('delete client success : ', result);
          return res.send({ message: 'deletion successful' });
        })
        .catch((err) => {
          console.log('find client database error: ', err);
          return res.send({ err: 'database error' });
        });
    } else {
      return res.json({ err: 'Incorrect password' });
    }
  }
);
module.exports = router;
