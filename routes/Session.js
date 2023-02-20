const express = require('express')
const { v4: uuidV4 } = require('uuid')
const Trainer = require('../models/Trainer')
const Session = require('../models/Session')
const auth = require('../middlewares/auth')
const Client = require('../models/Client')

const router = express.Router()

router.post('/new', auth, async ({ body, tokenUser: { userId } }, res) => {
  try {
    const { trainer, startTime, endTime, order } = body
    if (userId === trainer) {
      return res.status(400).send({ status: 'error', message: 'You cannot book yourself!' })
    }

    const errTrainer = await Trainer.findById(userId)
    if (errTrainer) {
      return res.status(400).send({ status: 'error', message: 'Only clients can book trainers' })
    }

    const foundClient = await Client.findById(userId)
    if (!foundClient) {
      return res.status(404).send({ status: 'error', message: 'User info not found' })
    }

    const foundTrainer = await Trainer.findById(trainer)

    const { availability } = foundTrainer
    const sessions = await Session.find({ trainer: foundTrainer._id })

    let timeBlocked = false
    const rStart = new Date(startTime)
    const rEnd = new Date(endTime)

    availability.forEach((a) => {
      const startIsBetween = rStart >= new Date(a.startDate) && rStart < new Date(a.endDate)
      const endIsBetween = rEnd >= new Date(a.startDate) && rEnd <= new Date(a.endDate)
      const blockedTimeIsBetween = new Date(a.startDate) >= rStart && new Date(a.endDate) <= rEnd
      if (startIsBetween || endIsBetween || blockedTimeIsBetween) timeBlocked = true
    })

    sessions.forEach((t) => {
      const startIsBetween = rStart >= t.startTime && rStart < t.endTime
      const endIsBetween = rEnd >= t.startTime && rEnd <= t.endTime
      const blockedTimeIsBetween = t.startTime >= rStart && t.endTime <= rEnd
      if (startIsBetween || endIsBetween || blockedTimeIsBetween) timeBlocked = true
    })

    if (timeBlocked) {
      return res.status(400).send({ status: 'error', message: 'Selected time is unavailable' })
    }

    const roomId = uuidV4()

    const newSession = new Session({
      order,
      roomId,
      endTime,
      startTime,
      status: 'scheduled',
      client: foundClient._id,
      trainer: foundTrainer._id,
    })

    const result = await newSession.save()
    if (!result) {
      return res.status(500).send({ status: 'error', message: 'Session creation failed' })
    }

    return res.status(200).send({
      status: 'success',
      newSession: result,
      message: 'Session created',
    })
  } catch (err) {
    return res
      .status(500)
      .send({ status: 'error', message: 'Database is down. We are working to fix this.' })
  }
})

module.exports = router
