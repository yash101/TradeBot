const express = require('express');

let provider = require('../provider');
let router = express.Router();

router.get('/request', (req, res) => {
  // get the type of request from req
});
