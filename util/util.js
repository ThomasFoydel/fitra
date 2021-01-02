const Message = require('../models/Message');
const Client = require('../models/Client');
const Trainer = require('../models/Trainer');
const jwt = require('jsonwebtoken');

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
  console.log('timer');
};

module.exports = {
  messageSorter,
  findUser,
  sendReminders,
  formatClientInfo,
  formatToken,
};
