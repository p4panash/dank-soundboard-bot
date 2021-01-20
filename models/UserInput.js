let mongoose = require("mongoose");

let UserInputSchema = new mongoose.Schema({
  user_id: String,
  channel_id: String,
  message_count: {type: Number, default: 0}
})

module.exports = mongoose.model('user_input', UserInputSchema)