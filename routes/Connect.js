const express = require('express')
const Session = require('../models/Session')
const Trainer = require('../models/Trainer')
const auth = require('../middlewares/auth')
const Client = require('../models/Client')

const router = express.Router()

router.get('/:connectionId', auth, async ({ params, tokenUser }, res) => {
  const { userId } = tokenUser
  const { connectionId } = params
  const foundClient = await Client.findById(userId)
  const foundTrainer = await Trainer.findById(userId)

  const noUserFound = !foundClient && !foundTrainer
  if (noUserFound) return res.send({ err: 'user info not found' })

  let foundSession
  try {
    foundSession = await Session.findById(connectionId).select('+roomId')
  } catch (err) {
    return res.send({ err: 'Invalid session id' })
  }

  if (!foundSession) return res.send({ err: 'no session found' })
  const { roomId } = foundSession

  const isClient = foundSession.client === userId
  const isTrainer = foundSession.trainer === userId
  const userNotOnSession = !isClient && !isTrainer
  if (userNotOnSession) {
    return res.send({ err: 'you are not logged in as a member of this session' })
  }

  const { startTime, endTime } = foundSession
  const startDate = new Date(startTime)
  const endDate = new Date(endTime)
  const currentTime = new Date(Date.now())
  const started = currentTime > startDate
  const ended = currentTime > endDate
  const active = started && !ended

  if (!started) return res.send({ err: 'this session has not yet begun' })
  if (!active) return res.send({ err: 'this session has ended' })

  return res.send({ isClient, isTrainer, roomId })
})

module.exports = router
