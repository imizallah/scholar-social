const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  username: {
    type: String
  },

  email: {
    type: String
  },

  password: {
    type: String
  },
  
}, {timestamps: true});

module.exports = User = mongoose.model('user', usersSchema);
