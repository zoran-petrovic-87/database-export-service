const express = require('express');

const router = new express.Router();

router.get(
  '/',
  (_req, res) => res.status(200).send({ message: 'OK' }),
);

module.exports = router;
