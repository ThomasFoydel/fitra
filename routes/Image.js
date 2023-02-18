const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const express = require('express')
const mongoose = require('mongoose')
const GridFsStorage = require('multer-gridfs-storage')
const Trainer = require('../models/Trainer')
const { findUser } = require('../util/util')
const auth = require('../middlewares/auth')
const Client = require('../models/Client')

const mongoURI = process.env.MONGO_URI

const router = express.Router()

const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let gfs
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'images',
  })
})

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useUnifiedTopology: true },
  file: (_, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err)
        const filename = buf.toString('hex') + path.extname(file.originalname)
        const fileInfo = { filename: filename, bucketName: 'images' }
        resolve(fileInfo)
      })
    })
  },
})

const upload = multer({ storage })

const deleteImage = async (id, res) => {
  if (!id || id === 'undefined') return res.send({ err: 'no image id' })
  const _id = new mongoose.Types.ObjectId(id)
  await gfs.delete(_id)
}

router.get('/', (_, res) => {
  if (!gfs) {
    res.send({ err: 'database error' })
    process.exit(0)
  }
  gfs.find().toArray((err, files) => {
    /* check if files exist */
    if (!files || files.length === 0) {
      return res.send({ err: 'no files' })
    } else {
      const f = files
        .map((file) => {
          if (file.contentType === 'image/png' || file.contentType === 'image/jpeg') {
            file.isImage = true
          } else file.isImage = false
          return file
        })
        .sort((a, b) => new Date(b['uploadDate']).getTime() - new Date(a['uploadDate']).getTime())

      return res.render('index', { files: f })
    }
  })
})

router.post('/upload/:type/:kind', auth, upload.single('image'), async (req, res) => {
  const {
    file,
    tokenUser: { userId },
    params: { type, kind },
  } = req

  const { id } = file

  if (file.size > 1000000) {
    await await deleteImage(id)
    return res.send({ err: 'file may not exceed 1mb' })
  }

  const User = type === 'trainer' ? Trainer : Client

  const foundUser = await User.findById(userId)
  if (!foundUser) return res.send({ err: 'user not found' })
  const currentPic = foundUser[kind]
  const currentPicId = new mongoose.Types.ObjectId(currentPic)

  if (currentPic) {
    gfs.delete(currentPicId, (err) => {
      if (err) {
        return res.send({ err: 'database error' })
      }
    })
  }

  User.findOneAndUpdate({ _id: userId }, { [kind]: id }, { new: true, useFindAndModify: false })
    .then((user) => res.send({ user }))
    .catch(() => {
      return res.send({ err: 'database error' })
    })
})

router.get('/:id', ({ params: { id } }, res) => {
  if (!id || id === 'undefined') return res.send({ err: 'no image id' })
  const _id = new mongoose.Types.ObjectId(id)
  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.send({ err: 'no files exist' })
    }
    gfs.openDownloadStream(_id).pipe(res)
  })
})

/* /api/image/user/profilePic/${id} */
router.get('/user/:kind/:id', async ({ params: { id, kind } }, res) => {
  if (!id || id === 'undefined') return res.send({ err: 'no image id' })
  let user = await findUser(id)
  if (user) {
    const foundPicId = user[kind] || new mongoose.Types.ObjectId('5f470368cabb0abdebe0c9e4')

    const _id = new mongoose.Types.ObjectId(foundPicId)
    gfs.find({ _id }).toArray((err, files) => {
      if (!files || files.length === 0) {
        /* image doesnt exist, user has no profile or cover photo */
        return res.send({ err: 'no files exist' })
      }
      gfs.openDownloadStream(_id).pipe(res)
    })
  } else {
    res.send({ err: 'no user found' })
  }
})

router.delete('/:id', async ({ params: { id } }, res) => {
  try {
    await deleteImage(id)
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Image deletion failed' })
  }
  return res.status(200).json({ status: 'success', message: 'Image deleted', id: id })
})

module.exports = router
