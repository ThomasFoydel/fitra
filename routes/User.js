const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Trainer = require('../models/Trainer');
const Client = require('../models/Client');

// get user auth info (happens on every reload of ui, in app.js)
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
  console.log('settings!');
  let { type, setting } = req.params;
  let { checked } = req.body;
  let { userId } = req.tokenUser;
  let User = type === 'client' ? Client : Trainer;
  if (setting === 'darkmode') {
    console.log('darkmode!', checked, type, setting);
    User.findByIdAndUpdate(
      userId,
      { $set: { 'settings.darkmode': checked } },
      { new: true, useFindAndModify: false, fields: { settings: 1 } }
    )
      .then(({ settings }) => res.send(settings))
      .catch((err) => res.send({ err }));
  }
});
module.exports = router;