const express = require('express')
const Session = require('../models/Session')
const Trainer = require('../models/Trainer')
const auth = require('../middlewares/auth')
const Client = require('../models/Client')

const router = express.Router()

router.get('/:connectionId', auth, async ({ params, tokenUser }, res) => {
  try {
    const { userId } = tokenUser

    const { connectionId } = params
    const foundClient = await Client.findById(userId)
    const foundTrainer = await Trainer.findById(userId)

    const noUserFound = !foundClient && !foundTrainer
    if (noUserFound) {
      return res.status(404).send({ status: 'error', message: 'User info not found' })
    }

    let foundSession
    try {
      foundSession = await Session.findById(connectionId).select('+roomId')
    } catch (err) {
      return res.status(400).send({ status: 'error', message: 'Invalid session id' })
    }

    if (!foundSession) return res.status(404).send({ status: 'error', message: 'No session found' })
    const { roomId } = foundSession
    const isClient = foundSession.client === userId
    const isTrainer = foundSession.trainer === userId
    const userNotOnSession = !isClient && !isTrainer

    if (userNotOnSession) {
      return res.status(401).send({ status: 'error', message: 'Not authenticated' })
    }

    const { startTime, endTime } = foundSession
    const startDate = new Date(startTime)
    const endDate = new Date(endTime)
    const currentTime = new Date(Date.now())
    const started = currentTime > startDate
    const ended = currentTime > endDate
    const active = started && !ended

    if (!started) {
      return res.status(400).send({ status: 'error', message: 'This session has not yet begun' })
    }

    if (!active) {
      return res.status(400).send({ status: 'error', message: 'This session has ended' })
    }

    return res
      .status(200)
      .send({ status: 'success', message: 'Session found', isClient, isTrainer, roomId })
  } catch (err) {
    return res
      .status(500)
      .send({ status: 'error', message: 'Database is down. We are working to fix this.' })
  }
})

module.exports = router
