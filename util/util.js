const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const Message = require('../models/Message')
const Trainer = require('../models/Trainer')
const Session = require('../models/Session')
const Client = require('../models/Client')

const messageSorter = async (userId) => {
  let sortedMessages = {}
  const messages = await Message.find({ participants: { $in: [userId] } })
    .sort({ createdAt: 1 })
    .limit(1000)
  if (messages && messages.length > 0) {
    messages.forEach((msg) => {
      let otherUser = msg.participants.filter((participant) => participant !== userId)
      if (sortedMessages[otherUser]) sortedMessages[otherUser] = [...sortedMessages[otherUser], msg]
      else sortedMessages[otherUser] = [msg]
    })
  }
  return sortedMessages
}

const findUser = async (id) => {
  const client = await Client.findById(id)
  const trainer = await Trainer.findById(id)
  if (client) return client
  else if (trainer) return trainer
  else return null
}

const formatClientInfo = async (client) => {
  if (!client || !client._id) return { err: 'invalid input' }
  const messages = await messageSorter(client._id.toString())
  return {
    messages,
    id: client._id,
    bio: client.bio,
    name: client.name,
    userType: 'client',
    email: client.email,
    coverPic: client.coverPic,
    settings: client.settings,
    profilePic: client.profilePic,
  }
}

const formatToken = (client) => {
  return jwt.sign(
    { tokenUser: { userId: client._id, email: client.email, userType: 'client' } },
    process.env.SECRET,
    { expiresIn: '1000hr' }
  )
}

const sendReminders = async () => {
  const tomorrow = new Date()
  tomorrow.setMinutes(tomorrow.getMinutes() + 1440)

  const tomorrowPlusHalfHour = new Date()
  tomorrowPlusHalfHour.setMinutes(tomorrow.getMinutes() + 1470)

  const upcomingSessions = await Session.find({
    startTime: { $gte: tomorrow.toISOString(), $lt: tomorrowPlusHalfHour.toISOString() },
  })

  let transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      expires: 3599,
      type: 'OAUTH2',
      user: process.env.GMAIL_USERN,
      clientId: process.env.OAUTH_CLIENT_ID,
      accessToken: process.env.OAUTH_ACCESS_TOKEN,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
    },
  })

  const send = (options) => {
    transporter.sendMail(options, function (err, data) {
      if (err) console.error('client email error: ', err)
      else console.log('client email success: ', data)
    })
  }

  upcomingSessions.forEach((session) => {
    const foundClient = Client.findById(session.client)
    const clientMailOptions = {
      to: foundClient.email,
      from: 'fitraxyzhealth@gmail.com',
      subject: 'Upcoming Fitra Session',
    }

    const foundTrainer = Trainer.findById(session.client)
    const trainerMailOptions = {
      to: foundTrainer.email,
      from: 'fitraxyzhealth@gmail.com',
      subject: 'Upcoming Fitra Session',
    }

    send(clientMailOptions)
    send(trainerMailOptions)
  })
}

module.exports = {
  findUser,
  formatToken,
  messageSorter,
  sendReminders,
  formatClientInfo,
}
