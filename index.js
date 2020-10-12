const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const util = require('./util/util');
const { sendReminders } = util;
require('dotenv').config();

const socketio = require('socket.io');

const clientRoutes = require('./routes/Client');
const trainerRoutes = require('./routes/Trainer');
const authRoutes = require('./routes/Auth');
const appointmentRoutes = require('./routes/Appointment');
const connectRoutes = require('./routes/Connect');
const imageRoutes = require('./routes/Image');
const userRoutes = require('./routes/User');

const Message = require('./models/Message');

const app = express();

app.use(bodyParser.json());

app.use('/api/client', clientRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/connect', connectRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/user', userRoutes);

// static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors());

// production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendfile(path.join((__dirname = 'client/build/index.html')));
  });
}

// build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});

let users = [];
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    const expressServer = app.listen(process.env.PORT || 8000);

    const io = socketio(expressServer);
    app.post('/api/message', (req, res) => {
      let { userId, message, sender, name } = req.body;

      const newMessage = new Message({
        authorName: name,
        sender,
        receiver: userId,
        content: message,
        participants: [sender, userId],
      });
      newMessage
        .save()
        .then((result) => {
          let receiver = users.filter((user) => user.userId === userId)[0];
          if (receiver) io.to(receiver.socketId).emit('chat-message', result);
          res.send(result);
        })
        .catch((err) => res.send({ err: 'message error' }));
    });

    io.on('connection', (socket) => {
      // set up initial connection for chat and notifications
      const token = socket.handshake.query.token;
      if (!token) {
        // console.log('no token auth denied');
      } else {
        try {
          const decoded = jwt.verify(token, process.env.SECRET);
          let current_time = Date.now() / 1000;
          if (decoded.exp < current_time) {
            // token is expired, not authorized
          } else {
            let { userId } = decoded.tokenUser;
            const currentUser = {
              userId: userId,
              socketId: socket.id,
            };
            users.push(currentUser);
          }
        } catch (err) {
          console.log('err: ', err);
        }
      }

      socket.on('join-room', ({ roomId, mySocketId, token, peerId }) => {
        // find appointment in db
        // check if user is client for this appointment
        // check if appointment is currently happening
        // if not, send back err and redirect or display countdown, if so, do the following
        socket.join(roomId);
        socket
          .to(roomId)
          .broadcast.emit('user-connected', { mySocketId, userId: peerId });

        socket.on('message', (message) => {
          //send message to the same room
          io.to(roomId).emit('create-message', message);
        });

        socket.on('disconnect-room', (id) => {
          console.log('disconnected-room, id: ', id);
          socket.to(roomId).broadcast.emit('user-disconnected', id);
        });

        socket.on('disconnect', () => {
          socket.to(roomId).broadcast.emit('user-disconnected', socket.id);
          users = users.filter((user) => user.socketId !== socket.id);
        });
      });

      socket.on('chat-message', (message) => {
        console.log('socket on CHAT MESSAGE: ', message);
      });

      socket.on('disconnect', () => {
        users = users.filter((user) => user.socketId !== socket.id);
      });

      socket.on('sending-signal', ({ newUser, callerId, signal }) => {
        console.log('sending signal to new user: ', newUser);
        io.to(newUser).emit('user-joined', { callerId, signal });
      });

      socket.on('returning signal', ({ callerId, signal, returningPeer }) => {
        io.to(callerId).emit('receiving returned signal', {
          signal: signal,
          id: socket.id,
          returningPeer,
        });
      });
    });

    setInterval(sendReminders, 3600000);
  });

// const path = require('path');
// const express = require('express');
// const port = process.env.PORT || 8000;
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const socketio = require('socket.io');

// const clientRoutes = require('./routes/Client');
// const trainerRoutes = require('./routes/Trainer');
// const authRoutes = require('./routes/Auth');
// const appointmentRoutes = require('./routes/Appointment');
// const connectRoutes = require('./routes/Connect');

// const app = express();

// app.use(bodyParser.json());

// app.use('/api/client', clientRoutes);
// app.use('/api/trainer', trainerRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/appointment', appointmentRoutes);
// app.use('/api/connect', connectRoutes);

// // static file declaration
// app.use(express.static(path.join(__dirname, 'client/build')));
// app.use(cors());

// // production mode
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'client/build')));
//   app.get('*', (req, res) => {
//     res.sendfile(path.join((__dirname = 'client/build/index.html')));
//   });
// }

// // build mode
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/client/public/index.html'));
// });

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then((res) => {
//     // app.listen(port, () => {
//     //   console.log(`Server is up on port ${port}!`);
//     // });
//     const expressServer = app.listen(process.env.PORT || 8000);
//     const io = socketio(expressServer);
//     io.on('connection', (socket) => {
//       // set up initial connection for chat and notifications
//       // console.log('io connection. socket: ', socket);

//       socket.on('join-room', (joinInfo) => {
//         let { roomId, mySocketId, token } = joinInfo;
//         // find appointment in db
//         // check if user is client for this appointment
//         // check if appointment is currently happening
//         // if not, send back err and redirect or display countdown, if so, do the following
//         socket.join(roomId);
//         socket.to(roomId).broadcast.emit('user-connected', mySocketId);
//       });
//       socket.on('sending-signal', ({ newUser, callerId, signal }) => {
//         console.log('sending signal to new user: ', newUser);
//         io.to(newUser).emit('user-joined', { callerId, signal });
//       });

//       socket.on('returning signal', ({ callerId, signal, returningPeer }) => {
//         // console.log('returning peer: ', returningPeer.signal);
//         io.to(callerId).emit('receiving returned signal', {
//           signal: signal,
//           id: socket.id,
//           returningPeer,
//         });
//       });

//       // messages
//       // socket.on('message', (message) => {
//       //   //send message to the same room
//       //   io.to(roomId).emit('createMessage', message);
//       // });

//       // socket.on('disconnect', (disconnectedUser) => {
//       //   socket.to(roomId).broadcast.emit('user-disconnected', disconnectedUser);
//       // });

//       const setUpSocket = async () => {
//         const token = socket.handshake.query.token;
//         if (!token) {
//           // console.log('no token auth denied');
//         } else {
//           try {
//             const decoded = jwt.verify(token, process.env.SECRET);
//             console.log('socket token: ', token);
//             let current_time = Date.now() / 1000;
//           } catch (err) {
//             console.log('socket setup error: ', err);
//           }
//         }
//       };
//     });
//   });