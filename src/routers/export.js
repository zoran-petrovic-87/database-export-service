const express = require('express');
const exportController = require('../controllers/exportController');

const router = new express.Router();

router.get('/', exportController);

module.exports = router;
