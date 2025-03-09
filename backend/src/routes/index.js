// main routes

var express = require('express');
var steamRoutes = require('./steamRoutes.js')

const router = express.Router();

router.use("/steam", steamRoutes);

module.exports = router;