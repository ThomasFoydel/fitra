const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const Trainer = require('../models/Trainer');
const Client = require('../models/Client');
const Appointment = require('../models/Appointment');
const { v4: uuidV4 } = require('uuid');

router.post(
  '/new',
  auth,
  async (
    { body: { trainer, startTime, endTime }, tokenUser: { userId } },
    res
  ) => {
    //  get client and trainer from db
    const foundClient = await Client.findById(userId);
    const foundTrainer = await Trainer.findById(trainer);

    let { availability } = foundTrainer;
    let appointments = await Appointment.find({ trainer: foundTrainer._id });

    let timeBlocked = false;
    let rStart = new Date(startTime);
    let rEnd = new Date(endTime);

    availability.forEach((a) => {
      let startIsBetween =
        rStart >= new Date(a.startDate) && rStart <= new Date(a.endDate);
      let endIsBetween =
        rEnd >= new Date(a.startDate) && rEnd <= new Date(a.endDate);
      let blockedTimeIsBetween =
        new Date(a.startDate) >= rStart && new Date(a.endDate) >= rEnd;
      if (startIsBetween || endIsBetween || blockedTimeIsBetween)
        timeBlocked = true;
    });
    appointments.forEach((t) => {
      let startIsBetween = rStart >= t.startTime && rStart <= t.endTime;
      let endIsBetween = rEnd >= t.startTime && rEnd <= t.endTime;
      let blockedTimeIsBetween = t.startTime >= rStart && t.endTime <= rEnd;
      if (startIsBetween || endIsBetween || blockedTimeIsBetween)
        timeBlocked = true;
    });

    if (timeBlocked) return res.send({ err: 'selected time is unavailable' });

    // create new appointment in db
    const roomId = uuidV4();
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
        res.send({ newAppt: { startTime, endTime, status, trainer, client } });
      })
      .catch((err) => res.send({ err: 'Database error' }));
  }
);

module.exports = router;
