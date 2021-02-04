const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Client = require('../models/Client');
const Trainer = require('../models/Trainer');
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
  const tomorrow = new Date();
  tomorrow.setMinutes(tomorrow.getMinutes() + 1440);

  const tomorrowPlusHalfHour = new Date();
  tomorrowPlusHalfHour.setMinutes(tomorrow.getMinutes() + 1470);

  const upcomingSessions = await Session.find({
    startTime: {
      $gte: tomorrow.toISOString(),
      $lt: tomorrowPlusHalfHour.toISOString(),
    },
  });

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      type: 'OAUTH2',
      user: process.env.GMAIL_USERN,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: process.env.OAUTH_ACCESS_TOKEN,
      expires: 3599,
    },
  });

  const send = (options) => {
    transporter.sendMail(options, function (err, data) {
      if (err) {
        console.log("client email error: ', err");
      } else {
        console.log('client email success: ', data);
      }
    });
  };

  upcomingSessions.forEach((session) => {
    let foundClient = Client.findById(session.client);
    let clientMailOptions = {
      from: 'fitraxyzhealth@gmail.com',
      to: foundClient.email,
      subject: 'Upcoming Fitra Session',
    };

    let foundTrainer = Trainer.findById(session.client);
    let trainerMailOptions = {
      from: 'fitraxyzhealth@gmail.com',
      to: foundTrainer.email,
      subject: 'Upcoming Fitra Session',
    };

    send(clientMailOptions);
    send(trainerMailOptions);
  });
};

module.exports = {
  messageSorter,
  findUser,
  sendReminders,
  formatClientInfo,
  formatToken,
};
