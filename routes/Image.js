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
  if (!id || id === 'undefined') {
    return res.status(400).send({ status: 'error', message: 'No image id' })
  }
  const _id = new mongoose.Types.ObjectId(id)
  await gfs.delete(_id)
}

router.get('/', (_, res) => {
  if (!gfs) return res.status(500).send({ status: 'error', message: 'Database error' })

  gfs.find().toArray((_rr, files) => {
    if (!files || files.length === 0) {
      return res.status(404).send({ status: 'error', message: 'Files not found' })
    } else {
      const f = files
        .map((file) => {
          if (file.contentType === 'image/png' || file.contentType === 'image/jpeg') {
            file.isImage = true
          } else file.isImage = false
          return file
        })
        .sort((a, b) => new Date(b['uploadDate']).getTime() - new Date(a['uploadDate']).getTime())

      return res.status(200).send({ status: 'success', message: 'Files found', files: f })
    }
  })
})

router.post('/upload/:type/:kind', auth, upload.single('image'), async (req, res) => {
  try {
    const { file, tokenUser, params } = req
    const { type, kind } = params
    const { userId } = tokenUser
    const { id } = file

    if (file.size > 1000000) {
      await await deleteImage(id)
      return res.status(400).send({ status: 'error', message: 'File may not exceed 1MB' })
    }

    const User = type === 'trainer' ? Trainer : Client

    const foundUser = await User.findById(userId)
    if (!foundUser) return res.status(404).send({ status: 'error', message: 'user not found' })

    const currentPic = foundUser[kind]
    const currentPicId = new mongoose.Types.ObjectId(currentPic)

    if (currentPic) gfs.delete(currentPicId, (err) => err && console.error(err))

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { [kind]: id },
      { new: true, useFindAndModify: false }
    )
    if (!user) return res.status(500).send({ status: 'error', message: 'User update failed' })
    return res
      .status(200)
      .send({ status: 'success', message: 'Image uploaded, user updated', user })
  } catch (err) {
    return res
      .status(500)
      .send({ status: 'error', message: 'Database is down. We are working to fix this.' })
  }
})

router.get('/:id', ({ params: { id } }, res) => {
  try {
    if (!id || id === 'undefined') {
      return res.status(400).send({ status: 'error', message: 'No image id' })
    }
    let _id
    try {
      _id = new mongoose.Types.ObjectId(id)
    } catch (err) {
      return res.status(400).send({ status: 'error', message: 'Invalid image id' })
    }
    gfs.find({ _id }).toArray((_, files) => {
      if (!files || files.length === 0) {
        return res.status(404).send({ status: 'error', message: 'Files not found' })
      }
      gfs.openDownloadStream(_id).pipe(res)
    })
  } catch (err) {
    return res
      .status(500)
      .send({ status: 'error', message: 'Database is down. We are working to fix this.' })
  }
})

/* /api/image/user/profilePic/${id} */
router.get('/user/:kind/:id', async ({ params: { id, kind } }, res) => {
  try {
    if (!id || id === 'undefined') {
      return res.status(400).send({ status: 'error', message: 'No image id' })
    }
    const user = await findUser(id)
    if (!user) return res.status(404).send({ status: 'error', message: 'User not found' })

    const foundPicId = user[kind] || new mongoose.Types.ObjectId('5f470368cabb0abdebe0c9e4')
    const _id = new mongoose.Types.ObjectId(foundPicId)
    gfs.find({ _id }).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).send({ status: 'error', message: 'Files not found' })
      }
      gfs.openDownloadStream(_id).pipe(res)
    })
  } catch (err) {
    return res
      .status(500)
      .send({ status: 'error', message: 'Database is down. We are working to fix this.' })
  }
})

router.delete('/:id', async ({ params: { id } }, res) => {
  try {
    await deleteImage(id)
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Image deletion failed' })
  }
  return res.status(200).json({ status: 'success', message: 'Image deleted', id })
})

module.exports = router
