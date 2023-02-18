const express = require('express')
const bcrypt = require('bcryptjs')
const Trainer = require('../models/Trainer')
const auth = require('../middlewares/auth')
const Client = require('../models/Client')

const router = express.Router()

router.get('/:id', auth, async ({ params: { id } }, res) => {
  const foundClient = await Client.findById(id)
  if (foundClient) {
    return res.send({ user: { ...foundClient, email: foundClient.displayEmail } })
  }
  const foundTrainer = await Trainer.findById(id)
  if (foundTrainer) {
    return res.send({ user: { ...foundTrainer, email: foundTrainer.displayEmail } })
  } else return res.send({ err: 'no user found' })
})

router.put('/settings/:type/:setting', auth, async (req, res) => {
  const { type, setting } = req.params
  const { value } = req.body
  const { userId } = req.tokenUser
  const User = type === 'client' ? Client : Trainer

  User.findByIdAndUpdate(
    userId,
    { $set: { [`settings.${setting}`]: value } },
    { new: true, useFindAndModify: false, fields: { settings: 1 } }
  )
    .then(({ settings }) => res.send(settings))
    .catch(() => res.send({ err: 'database error' }))
})

router.delete(
  '/delete_my_account/:type',
  auth,
  async ({ tokenUser: { userId }, params: { type }, headers: { pass } }, res) => {
    const User = type === 'client' ? Client : Trainer
    const foundUser = await User.findById(userId)
    if (!foundUser) return res.send({ err: 'No user found' })

    const passwordsMatch = await bcrypt.compare(pass, foundUser.password)
    if (!passwordsMatch) {
      return res.json({ err: 'Incorrect password' })
    }
    User.findByIdAndDelete(userId)
      .then(() => res.send({ message: 'deletion successful' }))
      .catch(() => res.send({ err: 'database error' }))
  }
)
module.exports = router
