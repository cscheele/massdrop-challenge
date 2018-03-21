var mongoose = require('mongoose');
var http = require('http');

var JobSchema = new mongoose.Schema({
  status: {type: String, default: 'pending'},
  target_url: {type: String, require: [true, "can't be blank"]},
  target_html: String
});

JobSchema.methods.getHTML = function() {
  http.get(this.target_url, res => {
    var body = '';
    res.on('data', data => {
      body += data;
    });
    res.on('end', () => {
      this.target_html = body;
      this.status = 'complete';
      this.save();
    });
    //console.log('*********\n', res)
  });
}

mongoose.model('Job', JobSchema);
