const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const Trainer = require('../models/Trainer');
const Client = require('../models/Client');
const Session = require('../models/Session');
const { v4: uuidV4 } = require('uuid');

router.post(
  '/new',
  auth,
  async (
    { body: { trainer, startTime, endTime, order }, tokenUser: { userId } },
    res
  ) => {
    if (userId === trainer)
      return res.send({ err: 'you cannot book yourself!' });

    const errTrainer = await Trainer.findById(userId);
    if (errTrainer) return res.send({ err: 'only clients can book trainers' });

    const foundClient = await Client.findById(userId);
    if (!foundClient) return res.send({ err: 'user info not found' });
    const foundTrainer = await Trainer.findById(trainer);

    let { availability } = foundTrainer;
    let sessions = await Session.find({ trainer: foundTrainer._id });

    let timeBlocked = false;
    let rStart = new Date(startTime);
    let rEnd = new Date(endTime);
    availability.forEach((a) => {
      let startIsBetween =
        rStart >= new Date(a.startDate) && rStart < new Date(a.endDate);
      let endIsBetween =
        rEnd >= new Date(a.startDate) && rEnd <= new Date(a.endDate);
      let blockedTimeIsBetween =
        new Date(a.startDate) >= rStart && new Date(a.endDate) <= rEnd;
      if (startIsBetween || endIsBetween || blockedTimeIsBetween) {
        timeBlocked = true;
      }
    });
    sessions.forEach((t) => {
      let startIsBetween = rStart >= t.startTime && rStart <= t.endTime;
      let endIsBetween = rEnd >= t.startTime && rEnd <= t.endTime;
      let blockedTimeIsBetween = t.startTime >= rStart && t.endTime <= rEnd;
      if (startIsBetween || endIsBetween || blockedTimeIsBetween) {
        timeBlocked = true;
      }
    });
    if (timeBlocked) return res.send({ err: 'selected time is unavailable' });

    const roomId = uuidV4();
    const newSession = new Session({
      status: 'scheduled',
      client: foundClient._id,
      trainer: foundTrainer._id,
      startTime,
      endTime,
      roomId,
      order,
    });

    newSession
      .save()
      .then((result) => {
        let { startTime, endTime, status, trainer, client } = result;
        res.send({
          newSession: { startTime, endTime, status, trainer, client },
        });
      })
      .catch((err) => res.send({ err: 'Database error' }));
  }
);

module.exports = router;
