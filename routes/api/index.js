var router = require('express').Router();
    mongoose = require('mongoose');
    Job = mongoose.model('Job');

router.get('/jobs', function(req, res, next) {
  Job.find(function (err, jobs) {
    if (err) { return next(err); }

    res.json(jobs);
  });
});

router.post('/jobs', function(req, res, next) {
  if (!req.body.target_url) {
    var err = new Error("Please provide a target_url.");
    err.status = 400;
    return next(err);
  }
  var job = new Job(req.body);

  job.enter(req, res, next);
});

router.get('/jobs/:job', function(req, res, next) {
  res.json(req.job);
});

router.put('/jobs/:job', function(req, res, next) {
  if (!req.body.target_url) {
    var err = new Error("Please provide a target_url to update.");
    err.status = 400;
    return next(err);
  }
  req.job.target_url = req.body.target_url;
  req.job.status = 'pending';
  req.job.enter(req, res, next);
})

router.delete('/jobs/:job', function(req, res, next) {
  var id = req.job._id;
  req.job.remove(function (err, job) {
    if (err) { return next(err); }
    res.json({"msg": `Job ${id} successfully deleted.`})
  });
})

router.param('job', function (req, res, next, id) {
  var query = Job.findById(id);

  query.exec(function (err, job) {
    if (err) {
      return next(err);
    }
    if (!job) {
      var err = new Error("Can't find that job");
      err.status = 404;
      return next(err);
    }

    req.job = job;
    return next();
  });
});

module.exports = router;
