const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const Client = require('../models/Client');
const Session = require('../models/Session');
const Trainer = require('../models/Trainer');

router.get('/client/:connectionId', auth, async (req, res) => {
  const { connectionId } = req.params;
  const { userId } = req.tokenUser;
  const foundClient = await Client.findById(userId);
  const foundTrainer = await Trainer.findById(userId);

  const noUserFound = !foundClient && !foundTrainer;
  if (noUserFound) return res.send({ err: 'user info not found' });

  let foundSession;
  try {
    foundSession = await Session.findById(connectionId).select('+roomId');
  } catch (err) {
    return res.send({ err: 'no session found' });
  }

  if (!foundSession) return res.send({ err: 'no session found' });
  const { roomId } = foundSession;

  const isClient = foundSession.client === userId;
  const isTrainer = foundSession.trainer === userId;
  const userNotOnSession = !isClient && !isTrainer;
  if (userNotOnSession)
    return res.send({
      err: 'you are not logged in as a member of this session',
    });

  let { startTime, endTime } = foundSession;
  let startDate = new Date(startTime);
  let endDate = new Date(endTime);
  let currentTime = new Date(Date.now());
  let started = currentTime > startDate;
  let ended = currentTime > endDate;
  let active = started && !ended;

  if (!started) return res.send({ err: 'this session has not yet begun' });
  if (!active) return res.send({ err: 'this session has ended' });

  // change status of session if !started or !active
  // if !started and time until session is less than 5hrs
  // then send back time until session starts
  // and display a countdown on the front end
  // cause page to reload when timer hits zero
  return res.send({ isClient, isTrainer, roomId });
});

module.exports = router;
