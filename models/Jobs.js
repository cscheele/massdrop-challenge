var mongoose = require('mongoose');
var http = require('http');
var https = require('https');
var autoIncrement = require('mongoose-auto-increment');

var JobSchema = new mongoose.Schema({
  status: {type: String, default: 'pending'},
  target_url: {type: String, require: [true, "can't be blank"]},
  target_html: String
}, {timestamps: true});

JobSchema.methods.getHTML = function() {
  var self = this;
  var process = (res) => {
    var html = '';
    res.on('data', data => {
      html += data;
    });
    res.on('error', err => {
      self.status = 'failed';
      console.error(err.message);
    });
    res.on('end', () => {
      self.target_html = html;
      self.status = 'complete';
      self.save();
    });
  };

  var req;
  if (this.target_url.startsWith('http://')) {
    req = http.get(this.target_url, process);
  } else if (this.target_url.startsWith('https://')) {
    req = https.get(this.target_url, process);
  } else {
    this.status = "failed: URL must start with 'http://' or 'https://'";
    this.save();
    return;
  }

  req.on('error', err => {
    this.status = 'failed: Invalid URL';
    this.save();
  })
}

JobSchema.methods.enter = function(req, res, next) {
  this.save().then(() => {
    return res.json(this);
  }).then(() => {
    this.getHTML();
  }).catch(next);
}

JobSchema.plugin(autoIncrement.plugin, 'Job');

mongoose.model('Job', JobSchema);
