const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Trainer = require('../models/Trainer');
const Client = require('../models/Client');

router.get('/:id', auth, async (req, res) => {
  let { id } = req.params;
  const foundClient = await Client.findById(id);
  if (foundClient) res.send({ user: foundClient });
  else {
    const foundTrainer = await Trainer.findById(id);
    if (foundTrainer) res.send({ user: foundTrainer });
    else res.send({ err: 'no user found' });
  }
});

router.post('/settings/:type/:setting', auth, async (req, res) => {
  let { type, setting } = req.params;
  let { checked, value } = req.body;
  let { userId } = req.tokenUser;
  let User = type === 'client' ? Client : Trainer;
  if (setting === 'darkmode') {
    User.findByIdAndUpdate(
      userId,
      { $set: { 'settings.darkmode': checked } },
      { new: true, useFindAndModify: false, fields: { settings: 1 } }
    )
      .then(({ settings }) => res.send(settings))
      .catch((err) => res.send({ err }));
  } else if (setting === 'rate') {
    User.findByIdAndUpdate(
      userId,
      { $set: { 'settings.rate': Number(value) } },
      { new: true, useFindAndModify: false, fields: { settings: 1 } }
    )
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.send({ err });
      });
  }
});
module.exports = router;
