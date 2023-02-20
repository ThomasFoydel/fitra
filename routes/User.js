const express = require('express')
const bcrypt = require('bcryptjs')
const Trainer = require('../models/Trainer')
const auth = require('../middlewares/auth')
const Client = require('../models/Client')

const router = express.Router()

router.get('/:id', auth, async ({ params: { id } }, res) => {
  try {
    const foundClient = await Client.findById(id)
    if (foundClient) {
      return res.status(200).send({ user: { ...foundClient, email: foundClient.displayEmail } })
    }
    const foundTrainer = await Trainer.findById(id)
    if (foundTrainer) {
      return res.status(200).send({ user: { ...foundTrainer, email: foundTrainer.displayEmail } })
    }
    return res.status(404).send({ status: 'error', message: 'User not found' })
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})

router.put('/settings/:type/:setting', auth, async ({ params, body, tokenUser }, res) => {
  try {
    const { value } = body
    const { userId } = tokenUser
    const { type, setting } = params
    const User = type === 'client' ? Client : Trainer

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { [`settings.${setting}`]: value } },
      { new: true, useFindAndModify: false, fields: { settings: 1 } }
    )
    return res
      .status(200)
      .send({ status: 'success', message: 'User updated', settings: updatedUser.settings })
  } catch (err) {
    return res.status(500).send({ status: 'error', message: 'Database is down' })
  }
})

router.delete(
  '/delete_my_account/:type',
  auth,
  async ({ tokenUser: { userId }, params: { type }, headers: { pass } }, res) => {
    try {
      const User = type === 'client' ? Client : Trainer
      const foundUser = await User.findById(userId)
      if (!foundUser) return res.status(404).send({ status: 'error', message: 'User not found' })

      const passwordsMatch = bcrypt.compare(pass, foundUser.password)
      if (!passwordsMatch) {
        return res.status(401).send({ status: 'error', message: 'Incorrect password' })
      }

      await User.findByIdAndDelete(userId)
      return res.status(200).send({ status: 'success', message: 'Account deleted' })
    } catch (err) {
      return res.status(500).send({ status: 'error', message: 'Database is down' })
    }
  }
)
module.exports = router
