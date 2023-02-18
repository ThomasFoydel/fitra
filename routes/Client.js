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
    res.status(200).send({
      status: 'success',
      message: 'Login successful',
      data: { user: clientInfo, token },
    })
  }

  const userURL = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`
  const result = await fetch(userURL)
  const { email, name } = await result.json()

  if (!email || !name) {
    return res.status(400).send({ status: 'error', message: 'One or more fields empty' })
  }
  const foundClient = await Client.findOne(
    { email: email.toLowerCase() },
    '+settings email bio name profilePic coverPic displayEmail tags'
  )

  if (foundClient) return sendLogin(foundClient)

  const password = email + process.env.SECRET
  const hashedPw = await bcrypt.hash(password, 12)
  const newClient = new Client({
    name: name,
    password: hashedPw,
    email: email.toLowerCase(),
    settings: { darkmode: false },
  })

  try {
    const savedClient = await newClient.save()
    return sendLogin(savedClient)
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Authentication error' })
  }
})

router.post('/googlelogin', async ({ body: { tokenId } }, res) => {
  const sendLogin = async (client) => {
    const clientInfo = await formatClientInfo(client)
    const token = formatToken(client)
    res.status(200).send({
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
          .then((result) => sendLogin(result))
          .catch(() => res.status(400).send({ status: 'error', message: 'Registration error' }))
      }
    })
    .catch(() => res.status(400).send({ status: 'error', message: 'Registration error' }))
})

router.post('/register', async (req, res) => {
  const { email, name, password, confirmpassword } = req.body

  const allFieldsExist = email && name && password && confirmpassword
  if (!allFieldsExist) {
    return res.status(400).send({ status: 'error', message: 'All fields required' })
  }

  if (password.length < 8) {
    return res
      .status(400)
      .send({ status: 'error', message: 'Password must be at least 8 characters' })
  }

  if (name.length < 4 || name.length > 12) {
    return res
      .status(400)
      .send({ status: 'error', message: 'Name must be between 4 and 12 characters' })
  }

  if (password !== confirmpassword) {
    return res.status(400).send({ status: 'error', message: 'Passwords do not match' })
  }

  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).send({ status: 'error', message: 'Valid email required' })
  }

  const existingClient = await Client.findOne({ email: email })
  if (existingClient) {
    return res
      .status(400)
      .send({ status: 'error', message: 'Account with this email already exists' })
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
    .catch(() => res.status(500).send({ status: 'error', message: 'Registration error' }))
})

router.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ status: 'error', message: 'All fields required' })
  }

  try {
    const client = await Client.findOne(
      { email: req.body.email },
      '+password settings email name coverPic profilePic bio'
    )
    if (!client) return res.status(404).send({ status: 'error', message: 'User not found' })

    const passwordsMatch = await bcrypt.compare(req.body.password, client.password)
    if (!passwordsMatch) {
      return res.status(400).send({ status: 'error', message: 'Incorrect password' })
    }

    const token = formatToken(client)
    const clientInfo = await formatClientInfo(client)
    return res.status(200).send({
      status: 'success',
      message: 'Login successful',
      data: { user: clientInfo, token },
    })
  } catch (err) {
    res.status(500).send({
      status: 'error',
      message: 'Database connection failed. We are working on fixing this issue.',
    })
  }
})

router.get('/trainers', async (_, res) => {
  const trainers = await Trainer.find()
  res.status(200).send({ status: 'success', message: 'Trainers found', trainers })
})

router.get('/trainer/:trainerId', async ({ params: { trainerId } }, res) => {
  try {
    trainerId = new mongoose.Types.ObjectId(trainerId)
  } catch (err) {
    return res.status(400).send({ status: 'error', message: 'Invalid ID' })
  }
  const foundTrainer = await Trainer.findById(trainerId)
  if (!foundTrainer) return res.status(404).send({ status: 'error', message: 'Trainer not found' })

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

  res.status(200).send({
    trainer,
    foundAvg,
    foundReviews,
    foundSessions,
    status: 'success',
    message: 'Trainer found',
  })
})

router.get('/profile/:id', async ({ params: { id } }, res) => {
  try {
    id = new mongoose.Types.ObjectId(id)
  } catch (err) {
    return res.status(400).send({ status: 'error', message: 'Invalid user ID' })
  }
  try {
    const foundUser = await Client.findById(id)
    if (foundUser.email) delete foundUser.email
    if (!foundUser) return res.status(404).send({ status: 'error', message: 'No user found' })
    return res.status(200).send({ status: 'success', message: 'User found', foundUser })
  } catch (err) {
    res
      .status(500)
      .send({ status: 'error', message: 'Database is down. We are working to fix this.' })
  }
})

router.put('/editprofile/', auth, async ({ tokenUser, body }, res) => {
  const { userId } = tokenUser
  const formInfo = body
  let update = {}
  Object.keys(formInfo).forEach((key) => {
    const trimmedValue = formInfo[key].replace(/^\s+|\s+$/gm, '')
    if (trimmedValue?.length > 0) update[key] = trimmedValue
  })

  try {
    const updatedProfile = await Client.findOneAndUpdate({ _id: userId }, update, {
      new: true,
      useFindAndModify: false,
    })
    if (!updatedProfile) {
      return res.status(404).send({ status: 'error', message: 'Profile not found' })
    }
    return res.status(200).send({ status: 'success', message: 'Profile updated', updatedProfile })
  } catch (err) {
    return res
      .status(500)
      .send({ status: 'error', message: 'Database is down. We are working to fix this.' })
  }
})

router.get('/dashboard', auth, async ({ tokenUser: { userId } }, res) => {
  try {
    const sessions = await Session.find({ client: userId }).sort({ startTime: -1 }).limit(12)
    if (!sessions) return res.status(404).send({ status: 'error', message: 'Sessions not found' })
    return res.status(200).send({ status: 'success', message: 'Sessions found', sessions })
  } catch (err) {
    return res
      .status(500)
      .send({ status: 'error', message: 'Database is down. We are working to fix this.' })
  }
})

router.get('/messages', auth, async (req, res) => {
  const { userId } = req.tokenUser
  try {
    const userMessages = await Message.find({ participants: { $in: [userId] } })
      .sort({ createdAt: 1 })
      .limit(1000)
    if (!userMessages) {
      return res.status(404).send({ status: 'error', message: 'No messages' })
    }
    let messages = {}
    userMessages.forEach((msg) => {
      const otherUser = msg.participants.filter((participant) => participant !== userId)
      if (messages[otherUser]) messages[otherUser] = [...messages[otherUser], msg]
      else messages[otherUser] = [msg]
    })
    return res.status(200).send({ status: 'success', message: 'Messages found', messages })
  } catch (err) {
    return res
      .status(500)
      .send({ status: 'error', message: 'Database is down. We are working to fix this.' })
  }
})

router.get('/search', async ({ query: { search, type } }, res) => {
  const searchArray = search.split(' ')
  const filteredArray = searchArray.filter(Boolean)
  const queryFilter = []
  filteredArray.forEach((term) =>
    queryFilter.push({ [type]: { $regex: `${term}`, $options: '$i' } })
  )
  if (queryFilter.length < 1) {
    return res.status(400).send({ status: 'error', message: 'Requires at least one term' })
  }
  try {
    const trainers = await Trainer.find({ $or: queryFilter })
    return res.status(200).send({ status: 'success', message: 'Trainers found', trainers })
  } catch (err) {
    return res
      .status(500)
      .send({ status: 'error', message: 'Database is down. We are working to fix this.' })
  }
})

router.post(
  '/review/:sessionId',
  auth,
  async ({ body: { rating, comment }, params: { sessionId }, tokenUser: { userId } }, res) => {
    try {
      const foundSession = await Session.findById(sessionId)
      if (!foundSession) {
        return res.status(404).send({ status: 'error', message: 'Session not found' })
      }
      if (rating < 0) {
        return res.status(400).send({ status: 'error', message: 'Must select a rating' })
      }
      if (foundSession.client !== userId) {
        return res.status(401).send({ status: 'error', message: 'Not authorized' })
      }
      if (comment.length < 20) {
        return res
          .status(400)
          .send({ status: 'error', message: 'Comment must be at least 20 characters' })
      }
      if (foundSession.status === 'reviewed') {
        return res.status(400).send({ status: 'error', message: 'Session already reviewed' })
      }
      const newReview = new Review({
        rating,
        comment,
        client: userId,
        session: sessionId,
        trainer: foundSession.trainer,
      })

      const savedReview = await newReview.save()
      const updatedSession = await Session.findOneAndUpdate(
        { _id: sessionId },
        { status: 'reviewed' },
        { useFindAndModify: false, new: true }
      )
      return res
        .status(200)
        .send({ status: 'success', message: 'Review created', updatedSession, savedReview })
    } catch (err) {
      return res
        .status(500)
        .send({ status: 'error', message: 'Database is down. We are working to fix this.' })
    }
  }
)

module.exports = router
