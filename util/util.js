const Message = require('../models/Message');
const Client = require('../models/Client');
const Trainer = require('../models/Trainer');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Session = require('../models/Session');

const messageSorter = async (userId) => {
  let sortedMessages = {};
  const messages = await Message.find({
    participants: { $in: [userId] },
  })
    .sort({ createdAt: 1 })
    .limit(1000);
  if (messages && messages.length > 0) {
    messages.forEach((msg) => {
      let otherUser = msg.participants.filter(
        (participant) => participant !== userId
      );
      if (sortedMessages[otherUser])
        sortedMessages[otherUser] = [...sortedMessages[otherUser], msg];
      else sortedMessages[otherUser] = [msg];
    });
  }
  return sortedMessages;
};

const findUser = async (id) => {
  const client = await Client.findById(id);
  const trainer = await Trainer.findById(id);
  if (client) return client;
  else if (trainer) return trainer;
};

const formatClientInfo = async (client) => {
  if (!client || !client._id) return { err: 'invalid input' };
  const messages = await messageSorter(client._id.toString());
  const clientInfo = {
    id: client._id,
    email: client.email,
    name: client.name,
    coverPic: client.coverPic,
    profilePic: client.profilePic,
    settings: client.settings,
    bio: client.bio,
    messages,
    userType: 'client',
  };
  return clientInfo;
};

const formatToken = (client) => {
  const token = jwt.sign(
    {
      tokenUser: {
        userId: client._id,
        email: client.email,
        userType: 'client',
      },
    },
    process.env.SECRET,
    { expiresIn: '1000hr' }
  );
  return token;
};

const sendReminders = async () => {
  // find all sessions that happen between 23 and 24 hours away from current time in UTC
  // const foundSessions = await Sessions.findAll({})
  // for each session in array, check if status is 'pending' or 'reminder-sent'
  // if 'pending', send email and update to 'reminder-sent'
  const currentTime = Date.now();

  const upcomingSessions = await Session.find({
    startTime: {
      $gte: currentTime,
    },
    endTime: {
      $lt: currentTime,
    },
  });

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  upcomingSessions.forEach((session) => {
    let clientMailOptions = {
      from: 'fitraxyzhealth@gmail.com',
      to: session.clientEmail,
      subject: 'Upcoming Fitra Session',
    };

    transporter.sendMail(clientMailOptions, function (err, data) {
      if (err) {
        console.log("client email error: ', err");
      } else {
        console.log('client email success: ', data);
      }
    });

    let trainerMailOptions = {
      from: 'fitraxyzhealth@gmail.com',
      to: session.trainerEmail,
      subject: 'Upcoming Fitra Session',
    };

    transporter.sendMail(trainerMailOptions, function (err, data) {
      if (err) {
        console.log("trainer email error: ', err");
      } else {
        console.log('trainer email success: ', data);
      }
    });
  });
};

module.exports = {
  messageSorter,
  findUser,
  sendReminders,
  formatClientInfo,
  formatToken,
};
