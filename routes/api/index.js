var router = require('express').Router();
var mongoose = require('mongoose');
var Job = mongoose.model('Job');

router.post('/jobs', function(req, res, next) {
  var job = new Job(req.body);

  job.save().then(function() {
    return res.json(job);
  }).then(function() {
    job.getHTML();
  }).catch(next);
});

router.get('/jobs/:job', function(req, res, next) {
  res.json(req.job);
});

router.param('job', function (req, res, next, id) {
  var query = Job.findById(id);

  query.exec(function (err, job) {
    if (err) { return next(err); }
    if (!job) { return next(new Error("can't find that job")); }

    req.job = job;
    return next();
  });
});

module.exports = router;
