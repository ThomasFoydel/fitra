require('dotenv').config()
const path = require('path')
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const socketio = require('socket.io')
const trainerRoutes = require('./routes/Trainer')
const sessionRoutes = require('./routes/Session')
const connectRoutes = require('./routes/Connect')
const clientRoutes = require('./routes/Client')
const imageRoutes = require('./routes/Image')
const authRoutes = require('./routes/Auth')
const userRoutes = require('./routes/User')
const Message = require('./models/Message')

mongoose.set('useCreateIndex', true)

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/trainer', trainerRoutes)
app.use('/api/session', sessionRoutes)
app.use('/api/connect', connectRoutes)
app.use('/api/client', clientRoutes)
app.use('/api/image', imageRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

let users = []

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const expressServer = app.listen(process.env.PORT || 8000)

    const io = socketio(expressServer)

    app.post('/api/message', (req, res) => {
      const { userId, message, sender, name, fromTrainer } = req.body
      const newMessage = new Message({
        sender,
        fromTrainer,
        content: message,
        authorName: name,
        receiver: userId,
        participants: [sender, userId],
      })
      newMessage
        .save()
        .then((result) => {
          const receiver = users.filter((user) => user.userId === userId)[0]
          if (receiver) io.to(receiver.socketId).emit('chat-message', result)
          return res
            .status(200)
            .send({ status: 'success', message: 'Message created', newMessage: result })
        })
        .catch(() => res.status(500).send({ status: 'error', message: 'Message error' }))
    })

    io.on('connection', (socket) => {
      /* set up initial connection for chat and notifications */
      const token = socket.handshake.query.token
      if (!token) return console.error('No token, auth denied')

      try {
        const decoded = jwt.verify(token, process.env.SECRET)
        const currentTime = Date.now() / 1000
        if (decoded.exp >= currentTime) {
          /* token is expired, not authorized */
        } else {
          const { userId } = decoded.tokenUser
          const currentUser = { userId: userId, socketId: socket.id }
          users = users.filter((user) => user.userId !== userId)
          users.push(currentUser)
        }
      } catch (err) {
        console.error('JWT decode error: ', err)
      }

      socket.on('join-room', ({ roomId, mySocketId, token, peerId }) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', { mySocketId, userId: peerId })

        socket.on('message', (message) => io.to(roomId).emit('create-message', message))

        socket.on('disconnect-room', (id) => {
          socket.to(roomId).broadcast.emit('user-disconnected', id)
        })

        socket.on('disconnect', () => {
          socket.to(roomId).broadcast.emit('user-disconnected', socket.id)
          users = users.filter((user) => user.socketId !== socket.id)
        })
      })

      socket.on('disconnect', () => {
        users = users.filter((user) => user.socketId !== socket.id)
      })

      socket.on('sending-signal', ({ newUser, callerId, signal }) => {
        io.to(newUser).emit('user-joined', { callerId, signal })
      })

      socket.on('returning signal', ({ callerId, signal, returningPeer }) => {
        io.to(callerId).emit('receiving returned signal', {
          id: socket.id,
          returningPeer,
          signal: signal,
        })
      })
    })

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, 'client/build')))
      app.get('*', (_, res) => res.sendFile(path.join(__dirname + '/client/build/index.html')))
    }
  })
  .catch((err) => console.error('Database connection error: ', err))
