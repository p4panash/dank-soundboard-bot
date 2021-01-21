let mongoose = require("mongoose")

let ChannelQueueSchema = new mongoose.Schema({
  channel_id: String,
  command: String,
  queued_at: Date
})

module.exports = mongoose.model('channel_queue', ChannelQueueSchema)