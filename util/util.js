const Message = require('../models/Message');
const Client = require('../models/Client');
const Trainer = require('../models/Trainer');
// const Session = require('../models/Session');
// const nodemailer = require('nodemailer');

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

const sendReminders = async () => {
  // fine all sessions that happen between 23 and 24 hours away from current time in UTC
  // const foundSessions = await Sessions.findAll({})
  // for each session in array, check if status is 'pending' or 'reminder-sent'
  // if 'pending', send email and update to 'reminder-sent'
  console.log('timer');
};

module.exports = { messageSorter, findUser, sendReminders };
