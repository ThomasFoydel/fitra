const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const Trainer = require('../models/Trainer');
const Client = require('../models/Client');

const util = require('../util/util');
const { messageSorter } = util;

router.post('/', async (req, res) => {
  let { search, type } = req.body;
  res.send(`testing: ${search}`);
});

module.exports = router;
