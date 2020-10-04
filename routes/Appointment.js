const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const Trainer = require('../models/Trainer');
const Client = require('../models/Client');
const Appointment = require('../models/Appointment');
const { v4: uuidV4 } = require('uuid');

router.post('/new', auth, async (req, res) => {
  // get userid from token,
  const { userId } = req.tokenUser;
  const { trainer, startTime, endTime } = req.body;

  //  get client and trainer from db
  const foundClient = await Client.findById(userId);
  const foundTrainer = await Trainer.findById(trainer);

  const roomId = uuidV4();

  // create new appointment in db
  const newAppointment = new Appointment({
    status: 'scheduled',
    client: foundClient._id,
    trainer: foundTrainer._id,
    startTime,
    endTime,
    roomId,
  });
  newAppointment
    .save()
    .then((result) => {
      let { startTime, endTime, status, trainer, client } = result;
      res.send({ startTime, endTime, status, trainer, client });
    })
    .catch((err) => res.send({ err: 'Database error' }));
});

module.exports = router;
