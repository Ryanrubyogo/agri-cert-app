const express = require('express');
const router = express.Router();

const store = require('../data/store');

// GET / - Get all certificates
router.get('/', (req, res) => {
  res.json(store.certificates);
});

module.exports = router;