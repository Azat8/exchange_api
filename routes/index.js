const express = require('express');
const IndexController = require('../controllers/IndexController');
const router = express.Router();

/* GET home page. */
router.get('/api/quote', function(req, res, next) {
  IndexController.calculateRate(req.query, res);
});

module.exports = router;
