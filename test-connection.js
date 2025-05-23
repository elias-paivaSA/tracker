const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
