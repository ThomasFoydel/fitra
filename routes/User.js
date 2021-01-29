const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Trainer = require('../models/Trainer');
const Client = require('../models/Client');

router.get('/:id', auth, async (req, res) => {
  let { id } = req.params;
  const foundClient = await Client.findById(id);
  if (foundClient)
    res.send({ user: { ...foundClient, email: foundClient.displayEmail } });
  else {
    const foundTrainer = await Trainer.findById(id);
    if (foundTrainer)
      res.send({ user: { ...foundTrainer, email: foundTrainer.displayEmail } });
    else res.send({ err: 'no user found' });
  }
});

router.post('/settings/:type/:setting', auth, async (req, res) => {
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
    .catch((err) => res.send({ err }));
});
module.exports = router;
