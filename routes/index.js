var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var msg = {msg: 'Please use the API to create, view, update, or delete a job.'};
  res.json(msg);
});
router.use('/api', require('./api'));

module.exports = router;
