const express = require('express')
const { v4: uuidV4 } = require('uuid')
const Trainer = require('../models/Trainer')
const Session = require('../models/Session')
const auth = require('../middlewares/auth')
const Client = require('../models/Client')

const router = express.Router()

router.post(
  '/new',
  auth,
  async ({ body: { trainer, startTime, endTime, order }, tokenUser: { userId } }, res) => {
    if (userId === trainer) return res.send({ err: 'you cannot book yourself!' })

    const errTrainer = await Trainer.findById(userId)
    if (errTrainer) return res.send({ err: 'only clients can book trainers' })

    const foundClient = await Client.findById(userId)
    if (!foundClient) return res.send({ err: 'user info not found' })
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

    if (timeBlocked) return res.send({ err: 'selected time is unavailable' })

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

    newSession
      .save()
      .then(({ startTime, endTime, status, trainer, client }) => {
        res.send({ newSession: { startTime, endTime, status, trainer, client } })
      })
      .catch(() => res.send({ err: 'database error' }))
  }
)

module.exports = router
