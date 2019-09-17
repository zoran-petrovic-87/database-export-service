const express = require('express');
const pkg = require('../../package.json');

const router = new express.Router();

router.get(
  ['/health', '/healthz'],
  (_req, res) => res.status(200).send({ message: 'OK', version: pkg.version }),
);

module.exports = router;
