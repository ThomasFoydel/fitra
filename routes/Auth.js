const express = require('express')
const Trainer = require('../models/Trainer')
const auth = require('../middlewares/auth')
const Client = require('../models/Client')
const util = require('../util/util')

const router = express.Router()
const { messageSorter } = util

router.get('/', auth, async ({ tokenUser }, res) => {
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
      return res.status(200).send({
        status: 'success',
        message: 'Auth success',
        user: {
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
        },
      })
    })
    .catch(() => res.status(500).send({ status: 'error', message: 'Database error' }))
})
module.exports = router
