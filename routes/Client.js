const express = require('express')
const bcrypt = require('bcryptjs')
const fetch = require('node-fetch')
const mongoose = require('mongoose')
const auth = require('../middlewares/auth')
const { OAuth2Client } = require('google-auth-library')
const { formatClientInfo, formatToken } = require('../util/util')
const Trainer = require('../models/Trainer')
const Session = require('../models/Session')
const Message = require('../models/Message')
const Client = require('../models/Client')
const Review = require('../models/Review')

const router = express.Router()

const googleClient = new OAuth2Client(
  '1034940197721-bs2c0n1opcqmdlcumn3c1bubrm3ga77k.apps.googleusercontent.com'
)

router.post('/fblogin', async ({ body: { userID, accessToken } }, res) => {
  const sendLogin = async (client) => {
    const clientInfo = await formatClientInfo(client)
    const token = formatToken(client)
    res.json({
      status: 'success',
      message: 'Login successful',
      data: { user: clientInfo, token },
    })
  }

  const userURL = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`
  fetch(userURL)
    .then((res) => res.json())
    .then(async ({ email, name }) => {
      if (!email || !name) return res.send({ err: 'One or more fields empty' })
      const foundClient = await Client.findOne(
        { email: email.toLowerCase() },
        '+settings email bio name profilePic coverPic displayEmail tags'
      )
      if (!foundClient) {
        const password = email + process.env.SECRET
        const hashedPw = await bcrypt.hash(password, 12)
        const newClient = new Client({
          name: name,
          password: hashedPw,
          email: email.toLowerCase(),
          settings: { darkmode: false },
        })

        newClient
          .save()
          .then((result) => sendLogin(result))
          .catch(() => res.status(400).send({ err: 'registration error' }))
      } else {
        sendLogin(foundClient)
      }
    })
    .catch(() => res.status(400).send({ err: 'registration error' }))
})

router.post('/googlelogin', async ({ body: { tokenId } }, res) => {
  const sendLogin = async (client) => {
    const clientInfo = await formatClientInfo(client)
    const token = formatToken(client)
    res.json({
      status: 'success',
      message: 'Login successful',
      data: { user: clientInfo, token },
    })
  }

  googleClient
    .verifyIdToken({
      idToken: tokenId,
      audience: '1034940197721-bs2c0n1opcqmdlcumn3c1bubrm3ga77k.apps.googleusercontent.com',
    })
    .then(async (response) => {
      const { email_verified, name, email } = response.payload
      if (email_verified) {
        const foundUser = await Client.findOne({ email })
        if (foundUser) return sendLogin(foundUser)

        const password = email + process.env.SECRET
        const hashedPw = await bcrypt.hash(password, 12)
        const newClient = new Client({
          name: name,
          email: email.toLowerCase(),
          password: hashedPw,
          settings: { darkmode: false },
        })

        newClient
          .save()
          .then((result) => {
            sendLogin(result)
          })
          .catch(() => res.status(400).send({ err: 'registration error' }))
      }
    })
    .catch(() => res.status(400).send({ err: 'registration error' }))
})

router.post('/register', async (req, res) => {
  const { email, name, password, confirmpassword } = req.body

  const allFieldsExist = email && name && password && confirmpassword
  if (!allFieldsExist) return res.send({ err: 'all fields required' })

  if (password.length < 8) return res.send({ err: 'Password must be at least 8 characters' })

  if (name.length < 4 || name.length > 12) {
    return res.send({ err: 'Name must be between 4 and 12 characters' })
  }

  if (password !== confirmpassword) {
    return res.send({ err: 'Passwords do not match' })
  }

  if (!email.includes('@') || !email.includes('.')) {
    return res.send({ err: 'Valid email required' })
  }

  const existingClient = await Client.findOne({ email: email })
  if (existingClient) {
    return res.send({ err: 'Account with this email already exists' })
  }

  const hashedPw = await bcrypt.hash(password, 12)

  const newClient = new Client({
    name,
    password: hashedPw,
    email: email.toLowerCase(),
    settings: { darkmode: false },
  })

  newClient
    .save()
    .then((result) => {
      result = { ...result._doc }
      delete result.password
      res.status(201).send(result)
    })
    .catch(() => res.status(400).send({ err: 'registration error' }))
})

router.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.send({ err: 'all fields required' })
  }

  Client.findOne(
    { email: req.body.email },
    '+password settings email name coverPic profilePic bio',
    async function (err, client) {
      if (err) {
        return res.json({
          err: 'Sorry, there is an issue with connecting to the database. We are working on fixing this issue.',
        })
      } else {
        if (!client) {
          return res.json({ err: 'No client found with this email' })
        }
        const passwordsMatch = await bcrypt.compare(req.body.password, client.password)
        if (!passwordsMatch) return res.json({ err: 'Incorrect password' })
        const token = formatToken(client)
        const clientInfo = await formatClientInfo(client)
        return res.json({
          status: 'success',
          message: 'Login successful',
          data: { user: clientInfo, token },
        })
      }
    }
  )
})

router.get('/trainers', async (_, res) => {
  const trainers = await Trainer.find()
  res.send({ trainers })
})

router.get('/trainer/:trainerId', async ({ params: { trainerId } }, res) => {
  try {
    trainerId = new mongoose.Types.ObjectId(trainerId)
  } catch (err) {
    return res.send({ err: 'Invalid ID' })
  }
  const foundTrainer = await Trainer.findById(trainerId)
  if (!foundTrainer) return res.send({ err: 'No trainer found' })

  const foundTrainerWithSettings = await Trainer.findById(trainerId).select('+ settings')
  const { rate, active } = foundTrainerWithSettings.settings

  const foundReviews = await Review.find({ trainer: trainerId })

  const averageAggregate = await Review.aggregate([
    { $group: { _id: trainerId, average: { $avg: '$rating' } } },
  ])
  const foundAvg = averageAggregate[0] ? averageAggregate[0].average : 0

  const trainer = { ...foundTrainer._doc, rate, active }

  const foundSessions = await Session.find({ trainer: foundTrainer._id }).select(
    '-createdAt -updatedAt -status -client -trainer -order'
  )
  res.send({
    trainer,
    foundAvg,
    foundReviews,
    foundSessions,
  })
})

router.get('/profile/:id', async ({ params: { id } }, res) => {
  try {
    id = new mongoose.Types.ObjectId(id)
  } catch (err) {
    return res.send({ err: 'No user found' })
  }
  const foundUser = await Client.findById(id)
  if (foundUser.email) delete foundUser.email
  if (foundUser) return res.send({ foundUser })
  else return res.send({ err: 'No user found' })
})

router.put('/editprofile/', auth, (req, res) => {
  const { userId } = req.tokenUser
  const formInfo = req.body
  let update = {}
  Object.keys(formInfo).forEach((key) => {
    const trimmedValue = formInfo[key].replace(/^\s+|\s+$/gm, '')
    if (trimmedValue?.length > 0) update[key] = trimmedValue
  })

  Client.findOneAndUpdate({ _id: userId }, update, { new: true, useFindAndModify: false })
    .then((result) => res.send(result))
    .catch(() => res.send({ err: 'database error' }))
})

router.get('/dashboard', auth, async (req, res) => {
  const { userId } = req.tokenUser
  const sessions = await Session.find({ client: userId }).sort({ startTime: -1 }).limit(12)
  res.send({ sessions })
})

router.get('/messages', auth, async (req, res) => {
  const { userId } = req.tokenUser
  const userMessages = await Message.find({ participants: { $in: [userId] } })
    .sort({ createdAt: 1 })
    .limit(1000)
  if (!userMessages || userMessages.length < 1) return res.send({ err: 'no messages' })
  let sortedMessages = {}
  userMessages.forEach((msg) => {
    const otherUser = msg.participants.filter((participant) => participant !== userId)
    if (sortedMessages[otherUser]) sortedMessages[otherUser] = [...sortedMessages[otherUser], msg]
    else sortedMessages[otherUser] = [msg]
  })
  res.send({ messages: sortedMessages })
})

router.get('/search', async ({ query: { search, type } }, res) => {
  const searchArray = search.split(' ')
  const filteredArray = searchArray.filter(Boolean)
  const queryFilter = []
  filteredArray.forEach((term) =>
    queryFilter.push({ [type]: { $regex: `${term}`, $options: '$i' } })
  )
  if (queryFilter.length < 1) return res.send({ err: 'requires at least one term' })
  Trainer.find({ $or: queryFilter })
    .then((result) => res.send({ result }))
    .catch(() => res.send({ err: 'database is down, please try again later' }))
})

router.post(
  '/review/:sessionId',
  auth,
  async ({ body: { rating, comment }, params: { sessionId }, tokenUser: { userId } }, res) => {
    const foundSession = await Session.findById(sessionId)
    if (!foundSession) return res.send({ err: 'No session found' })
    if (rating < 0) return res.send({ err: 'Must select a rating' })
    if (foundSession.client !== userId) return res.send({ err: 'Not authorized' })
    if (comment.length < 20) return res.send({ err: 'Comment must be at least 20 characters' })
    if (foundSession.status === 'reviewed') return res.send({ err: 'Session already reviewed' })
    const newReview = new Review({
      rating,
      comment,
      client: userId,
      session: sessionId,
      trainer: foundSession.trainer,
    })
    newReview
      .save()
      .then(async (savedReview) => {
        const updatedSession = await Session.findOneAndUpdate(
          { _id: sessionId },
          { status: 'reviewed' },
          { useFindAndModify: false, new: true }
        )
        res.send({ updatedSession, savedReview })
      })
      .catch(() => res.send({ err: 'databse error' }))
  }
)

module.exports = router
