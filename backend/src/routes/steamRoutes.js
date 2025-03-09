// Steam API Routes

var express = require('express');
const { getUserGames } = require("../controllers/steamController");

const router = express.Router();

router.get("/user-games/:steamId", getUserGames);

module.exports = router;