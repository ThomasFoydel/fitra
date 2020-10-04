const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const Client = require('../models/Client');
const Appointment = require('../models/Appointment');
const Trainer = require('../models/Trainer');

router.get('/client/:connectionId', auth, async (req, res) => {
  const { connectionId } = req.params;
  const { userId } = req.tokenUser;
  const foundClient = await Client.findById(userId);
  const foundTrainer = await Trainer.findById(userId);

  const noUserFound = !foundClient && !foundTrainer;
  if (noUserFound) return res.send({ err: 'User info not found' });

  let foundAppointment;
  try {
    foundAppointment = await Appointment.findById(connectionId);
  } catch (err) {
    return res.send({ err: 'No appointment found' });
  }

  if (!foundAppointment) return res.send({ err: 'No appointment found' });
  const { roomId } = foundAppointment;

  const isClient = foundAppointment.client === userId;
  const isTrainer = foundAppointment.trainer === userId;
  const userNotOnAppt = !isClient && !isTrainer;
  if (userNotOnAppt)
    return res.send({
      err: 'You are not logged in as a member of this appointment',
    });

  let { startTime, endTime } = foundAppointment;
  let startDate = new Date(startTime);
  let endDate = new Date(endTime);
  let currentTime = new Date(Date.now());
  let started = currentTime > startDate;
  let ended = currentTime > endDate;
  let active = started && !ended;

  if (!started) return res.send({ err: 'This appointment has not yet begun' });
  if (!active) return res.send({ err: 'This appointment has ended' });
  // change status of appointment if !started or !active
  // if !started and time until appt is less than 5hrs
  // then send back time until appt starts
  // and display a countdown on the front end
  // cause page to reload when timer hits zero

  res.send({ isClient, isTrainer, roomId });
});

module.exports = router;
