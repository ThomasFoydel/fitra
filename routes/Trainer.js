const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { messageSorter } = require('../util/util')
const Trainer = require('../models/Trainer')
const Session = require('../models/Session')
const auth = require('../middlewares/auth')
const Client = require('../models/Client')

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, name, password, confirmpassword } = req.body

  const allFieldsExist = email && name && password && confirmpassword
  if (!allFieldsExist) {
    return res.send({ err: 'all fields required' })
  }

  if (password.length < 8) {
    return res.send({ err: 'password must be at least 8 characters' })
  }

  if (name.length < 4 || name.length > 12) {
    return res.send({ err: 'name must be between 4 and 12 characters' })
  }

  if (password !== confirmpassword) {
    return res.send({ err: 'passwords do not match' })
  }

  if (!email.includes('@') || !email.includes('.')) {
    return res.send({ err: 'valid email required' })
  }

  const existingTrainer = await Trainer.findOne({ email: email })
  if (existingTrainer) {
    return res.send({ err: 'account with this email already exists' })
  }

  const hashedPw = await bcrypt.hash(password, 12)

  const newTrainer = new Trainer({
    name,
    minimum: 1,
    maximum: 4,
    availability: [],
    password: hashedPw,
    settings: { active: false },
    email: email.toLowerCase(),
  })

  newTrainer
    .save()
    .then((result) => {
      result = { ...result._doc }
      delete result.password
      res.status(201).send(result)
    })
    .catch((err) => res.status(400).send(err))
})

router.post('/login', (req, res) => {
  Trainer.findOne(
    { email: req.body.email },
    '+password settings name email bio profilePic coverPic tags displayEmail',
    async function (err, user) {
      if (err) {
        return res.json({
          err: 'sorry, there is an issue with connecting to the database. We are working on fixing this.',
        })
      } else {
        if (!user) {
          return res.json({ err: 'no user found with this email' })
        }
        const passwordsMatch = await bcrypt.compare(req.body.password, user.password)
        if (passwordsMatch) {
          const token = jwt.sign(
            { tokenUser: { userId: user._id, email: user.email, userType: 'trainer' } },
            process.env.SECRET,
            { expiresIn: '1000hr' }
          )
          const messages = await messageSorter(user._id.toString())
          const userInfo = {
            messages,
            id: user._id,
            bio: user.bio,
            name: user.name,
            tags: user.tags,
            userId: user._id,
            email: user.email,
            userType: 'trainer',
            settings: user.settings,
            coverPic: user.coverPic,
            profilePic: user.profilePic,
            displayEmail: user.displayEmail,
          }
          res.json({
            status: 'success',
            message: 'login successful',
            data: { user: userInfo, token },
          })
        } else {
          return res.json({ err: 'incorrect password' })
        }
      }
    }
  )
})

router.get('/dashboard', auth, (req, res) => {
  let { userId } = req.tokenUser
  Session.find({ trainer: userId })
    .sort({ startTime: -1 })
    .limit(12)
    .then((sessions) => res.send({ sessions }))
    .catch(() => res.send('database error'))
})

router.put('/editprofile/', auth, ({ tokenUser, body }, res) => {
  const { userId } = tokenUser
  const formInfo = body
  let update = {}
  Object.keys(formInfo).forEach((key) => {
    const trimmedValue = formInfo[key].replace(/^\s+|\s+$/gm, '')
    if (trimmedValue && trimmedValue.length > 0) update[key] = trimmedValue
  })

  Trainer.findOneAndUpdate({ _id: userId }, update, { new: true, useFindAndModify: false })
    .then((result) => res.send(result))
    .catch(() => res.send({ err: 'database error' }))
})

router.get('/schedule/', auth, async ({ tokenUser }, res) => {
  const { userId } = tokenUser
  const foundTrainer = await Trainer.findById(userId)
  if (!foundTrainer) return res.send({ err: 'no trainer found' })
  const entries = foundTrainer.availability || []
  const foundSessions = await Session.find({ trainer: userId })
  const { minimum, maximum } = foundTrainer || {}
  res.send({ entries, min: minimum, max: maximum, foundSessions })
})

router.put('/schedule/', auth, async ({ tokenUser, body }, res) => {
  const { userId } = tokenUser
  Trainer.findOneAndUpdate(
    { _id: userId },
    { availability: body },
    { new: true, useFindAndModify: false }
  )
    .then((user) => res.send(user.availability || []))
    .catch(() => res.send('database error'))
})

router.put('/minmax/:type', auth, async ({ params: { type }, tokenUser, body: { value } }, res) => {
  const { userId } = tokenUser

  const foundTrainer = await Trainer.findById(userId)
  if (type === 'maximum' && value < foundTrainer.minimum) {
    return res.send({ err: 'maximum must be greater than minimum' })
  }
  if (type === 'minimum' && value > foundTrainer.maximum) {
    return res.send({ err: 'minimum cannot be greater than maximum' })
  }

  Trainer.findOneAndUpdate(
    { _id: userId },
    { [type]: Number(value) },
    { new: true, useFindAndModify: false }
  )
    .then((user) => res.send({ min: user.minimum, max: user.maximum }))
    .catch(() => res.send({ err: 'database error' }))
})

router.get('/session/:id', auth, async ({ params: { id } }, res) => {
  let _id
  try {
    _id = new mongoose.Types.ObjectId(id)
  } catch (err) {
    return res.send({ err: 'no session found' })
  }
  const foundSession = await Session.findById(_id)
  if (!foundSession) return res.send({ err: 'no session found' })
  const foundClient = await Client.findById(foundSession.client)
  return res.send({ foundSession, foundClient })
})

router.delete('/cancel-session/', auth, async ({ headers: { id } }, res) => {
  const deletedSession = await Session.findByIdAndDelete(id)
  if (deletedSession) res.send({ id: deletedSession.id })
  else res.send({ err: 'no session found' })
})

router.put('/add-tag', auth, async ({ tokenUser: { userId }, body: { value } }, res) => {
  const foundTrainer = await Trainer.findById(userId)
  if (!foundTrainer) return res.send({ err: 'user not found' })
  if (foundTrainer.tags.indexOf(value) > -1) return res.send({ err: 'no tag duplicate' })
  if (foundTrainer.tags.length >= 4) return res.send({ err: 'tag list limited to 4 tags' })
  Trainer.findOneAndUpdate(
    { _id: userId },
    { $push: { tags: value } },
    { new: true, useFindAndModify: false }
  )
    .then((result) => res.send(result.tags))
    .catch(() => res.send({ err: 'database error' }))
})

router.delete('/delete-tag', auth, async ({ tokenUser: { userId }, headers: { value } }, res) => {
  const foundTrainer = await Trainer.findById(userId)
  if (!foundTrainer) {
    return res.send({ err: 'user not found' })
  }
  const tags = [...foundTrainer.tags]
  const filteredTags = tags.filter((t) => t !== value)
  Trainer.findOneAndUpdate(
    { _id: userId },
    { tags: filteredTags },
    { new: true, useFindAndModify: false }
  )
    .then((result) => res.send(result.tags))
    .catch(() => res.send({ err: 'database error' }))
})
module.exports = router
