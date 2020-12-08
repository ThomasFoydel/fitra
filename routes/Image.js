const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

const Client = require('../models/Client');
const Trainer = require('../models/Trainer');

const util = require('../util/util');
const { findUser } = util;

const mongoURI = process.env.MONGO_URI;

const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once('open', () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'images',
  });
});

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'images',
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({
  storage,
});

const deleteImage = (id) => {
  if (!id || id === 'undefined') return res.send({ err: 'no image id' });
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err, data) => {
    if (err) return res.send({ err: err.message });
  });
};

router.get('/', (req, res) => {
  if (!gfs) {
    res.send({ err: 'Database error' });
    process.exit(0);
  }
  gfs.find().toArray((err, files) => {
    // check if files exist
    if (!files || files.length === 0) {
      return res.send({ err: 'no files' });
    } else {
      const f = files
        .map((file) => {
          if (
            file.contentType === 'image/png' ||
            file.contentType === 'image/jpeg'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
          return file;
        })
        .sort((a, b) => {
          return (
            new Date(b['uploadDate']).getTime() -
            new Date(a['uploadDate']).getTime()
          );
        });

      return res.render('index', {
        files: f,
      });
    }
  });
});

router.post(
  '/upload/:type/:kind',
  auth,
  upload.single('image'),
  async (req, res) => {
    const {
      file,
      params: { type, kind },
      tokenUser: { userId },
    } = req;

    const { id } = file;
    if (file.size > 1000000) {
      deleteImage(id);
      return res.send({ err: 'File may not exceed 1mb' });
    }
    const User = type === 'trainer' ? Trainer : Client;

    const foundUser = await User.findById(userId);
    if (!foundUser) return res.send({ err: 'User not found' });
    let currentPic = foundUser[kind];
    let currentPicId = new mongoose.Types.ObjectId(currentPic);

    if (currentPic) {
      gfs.delete(currentPicId, (err, data) => {
        if (err) return res.send({ err: err.message });
      });
    }

    User.findOneAndUpdate(
      { _id: userId },
      { [kind]: id },
      { new: true, useFindAndModify: false }
    )
      .then((user) => res.send({ user }))
      .catch((err) => res.send({ err }));
  }
);

router.get('/:id', ({ params: { id } }, res) => {
  if (!id || id === 'undefined') return res.send({ err: 'no image id' });
  const _id = new mongoose.Types.ObjectId(id);
  gfs.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.send({ err: 'No files exist' });
    }
    gfs.openDownloadStream(_id).pipe(res);
  });
});

// /api/image/user/profilePic/${id}
router.get('/user/:kind/:id', async ({ params: { id, kind } }, res) => {
  if (!id || id === 'undefined') return res.send({ err: 'no image id' });
  let user = await findUser(id);
  if (user) {
    let foundPicId =
      user[kind] || new mongoose.Types.ObjectId('5f470368cabb0abdebe0c9e4');

    const _id = new mongoose.Types.ObjectId(foundPicId);
    gfs.find({ _id }).toArray((err, files) => {
      if (!files || files.length === 0) {
        // user has no profile or cover photo
        // TODO: send back a default
        return res.send({ err: 'No files exist' });
      }
      gfs.openDownloadStream(_id).pipe(res);
    });
  } else {
    res.send({ err: 'no user found' });
  }
});

router.delete('/:id', (req, res) => {
  let { id } = req.params;
  deleteImage(id);
});

module.exports = router;
