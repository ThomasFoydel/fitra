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
  try {
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

    const existingTrainer = await Trainer.findOne({ email: email })
    if (existingTrainer) {
      return res
        .status(400)
        .send({ status: 'error', message: 'Account with this email already exists' })
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

    try {
      const result = await newTrainer.save()
      const trainer = { ...result._doc }
      delete trainer.password
      return res.status(201).send({ status: 'success', message: 'Account created', trainer })
    } catch (err) {
      return res.status(500).send({ status: 'error', message: 'Account creation failed' })
    }
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const trainer = await Trainer.findOne(
      { email: req.body.email },
      '+password settings name email bio profilePic coverPic tags displayEmail'
    )
    if (!trainer) {
      return res.status(404).send({ status: 'error', message: 'No user found with this email' })
    }

    const passwordsMatch = await bcrypt.compare(req.body.password, trainer.password)
    if (!passwordsMatch) {
      return res.status(400).send({ status: 'error', message: 'Incorrect password' })
    }

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
    res.status(200).send({
      status: 'success',
      message: 'Login successful',
      data: { user: userInfo, token },
    })
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})

router.get('/dashboard', auth, async ({ tokenUser: { userId } }, res) => {
  try {
    const sessions = await Session.find({ trainer: userId }).sort({ startTime: -1 }).limit(12)
    res.status(200).send({ status: 'success', message: 'Sessions found', sessions })
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})

router.put('/editprofile/', auth, async ({ tokenUser, body }, res) => {
  try {
    const { userId } = tokenUser
    const formInfo = body
    let update = {}
    Object.keys(formInfo).forEach((key) => {
      const trimmedValue = formInfo[key].replace(/^\s+|\s+$/gm, '')
      if (trimmedValue && trimmedValue.length > 0) update[key] = trimmedValue
    })

    try {
      const updatedProfile = await Trainer.findOneAndUpdate({ _id: userId }, update, {
        new: true,
        useFindAndModify: false,
      })
      return res.status(200).send({ status: 'success', message: 'Profile updated', updatedProfile })
    } catch (err) {
      return res.status(500).send({ status: 'error', message: 'Profile update failed' })
    }
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})

router.get('/schedule/', auth, async ({ tokenUser: { userId } }, res) => {
  try {
    const foundTrainer = await Trainer.findById(userId)
    if (!foundTrainer) {
      return res.status(404).send({ status: 'error', message: 'Trainer not found' })
    }
    const entries = foundTrainer.availability || []
    const foundSessions = await Session.find({ trainer: userId })
    const { minimum, maximum } = foundTrainer
    return res.status(200).send({
      entries,
      min: minimum,
      max: maximum,
      foundSessions,
      status: 'success',
      message: 'Schedule found',
    })
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})

router.put('/schedule/', auth, async ({ tokenUser: { userId }, body }, res) => {
  try {
    const updatedTrainer = await Trainer.findOneAndUpdate(
      { _id: userId },
      { availability: body },
      { new: true, useFindAndModify: false }
    )

    return res.status().send({
      status: 'success',
      message: 'Schedule updated',
      updatedSchedule: updatedTrainer.availability,
    })
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})

router.put('/minmax/:type', auth, async ({ params: { type }, tokenUser, body: { value } }, res) => {
  try {
    const { userId } = tokenUser

    const foundTrainer = await Trainer.findById(userId)

    if (!foundTrainer) {
      return res.status(404).send({ status: 'error', message: 'Trainer not found' })
    }

    if (type === 'maximum' && value < foundTrainer.minimum) {
      return res
        .status(400)
        .send({ status: 'error', message: 'Maximum must be greater than minimum' })
    }

    if (type === 'minimum' && value > foundTrainer.maximum) {
      return res
        .status(400)
        .send({ status: 'error', message: 'Minimum cannot be greater than maximum' })
    }

    try {
      const updatedTrainer = await Trainer.findOneAndUpdate(
        { _id: userId },
        { [type]: Number(value) },
        { new: true, useFindAndModify: false }
      )

      const { min, max } = updatedTrainer
      return res
        .status(200)
        .send({ status: 'success', message: 'Trainer min max updated', min, max })
    } catch (err) {
      return res.status(500).send({ status: 'error', message: 'Trainer update failed' })
    }
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})

router.get('/session/:id', auth, async ({ params: { id } }, res) => {
  try {
    let _id
    try {
      _id = new mongoose.Types.ObjectId(id)
    } catch (err) {
      return res.status(400).send({ status: 'error', message: 'Invalid session id' })
    }
    const foundSession = await Session.findById(_id)
    if (!foundSession) {
      return res.status(404).send({ status: 'error', message: 'Session not found' })
    }
    const foundClient = await Client.findById(foundSession.client)
    return res
      .status(200)
      .send({ status: 'success', message: 'Session found', foundSession, foundClient })
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})

router.delete('/cancel-session/', auth, async ({ headers: { id } }, res) => {
  try {
    const deletedSession = await Session.findByIdAndDelete(id)
    if (!deletedSession) {
      return res.status(404).send({ status: 'error', message: 'Session not found' })
    }
    return res
      .status(200)
      .send({ status: 'success', message: 'Session canceled', id: deletedSession.id })
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})

router.put('/add-tag', auth, async ({ tokenUser: { userId }, body: { value } }, res) => {
  try {
    const foundTrainer = await Trainer.findById(userId)
    if (!foundTrainer) {
      return res.status(404).send({ status: 'error', message: 'User not found' })
    }
    if (foundTrainer.tags.indexOf(value) > -1) {
      return res.status(400).send({ status: 'error', message: 'No tag duplicate' })
    }
    if (foundTrainer.tags.length >= 4) {
      return res.status(400).send({ status: 'error', message: 'Tag list limited to 4 tags' })
    }
    const updatedTrainer = await Trainer.findOneAndUpdate(
      { _id: userId },
      { $push: { tags: value } },
      { new: true, useFindAndModify: false }
    )
    return res
      .status(200)
      .send({ status: 'success', message: 'Tag added', tags: updatedTrainer.tags })
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})

router.delete('/delete-tag', auth, async ({ tokenUser: { userId }, headers: { value } }, res) => {
  try {
    const foundTrainer = await Trainer.findById(userId)
    if (!foundTrainer) {
      return res.status(404).send({ status: 'error', message: 'User not found' })
    }
    const tags = [...foundTrainer.tags]
    const filteredTags = tags.filter((t) => t !== value)
    const updatedTrainer = await Trainer.findOneAndUpdate(
      { _id: userId },
      { tags: filteredTags },
      { new: true, useFindAndModify: false }
    )
    return res
      .status(200)
      .send({ status: 'success', message: 'Tage deleted', tags: updatedTrainer.tags })
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})
module.exports = router
