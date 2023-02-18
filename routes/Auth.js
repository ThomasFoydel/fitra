const express = require('express')
const Trainer = require('../models/Trainer')
const auth = require('../middlewares/auth')
const Client = require('../models/Client')
const util = require('../util/util')

const router = express.Router()
const { messageSorter } = util

router.get('/', auth, async ({ tokenUser }, res) => {
  if (!tokenUser) return res.send({ err: 'no token' })
  const { userId, userType } = tokenUser
  const isClient = userType === 'client'
  const User = isClient ? Client : Trainer

  User.findOne(
    { _id: userId },
    `+password settings email bio name profilePic coverPic displayEmail ${!isClient && 'tags'}`
  )
    .then(async (foundUser) => {
      const { name, email, _id, coverPic, profilePic, settings, tags, bio, displayEmail } =
        foundUser
      const sortedMessages = await messageSorter(userId)
      return res.send({
        bio,
        tags,
        name,
        email,
        id: _id,
        settings,
        coverPic,
        profilePic,
        displayEmail,
        messages: sortedMessages,
        userType: tokenUser.userType,
      })
    })
    .catch(() => res.send({ err: 'database error' }))
})
module.exports = router
