const UserInput = require('../models/UserInput.js')
const ChannelQueue = require('../models/ChannelQueue.js')
const play = require('./helpers/play.js');
const config = require('../config.json')
const MAX_QUEUE_SIZE = config.max_queue_size
const MAX_MSG_AMOUNT = config.max_message_amount

const fs = require('fs');
var path = require("path");
const audioFiles = fs.readdirSync(path.join(__dirname, '..', 'audio')).filter(file => file.endsWith('.mp3'));

module.exports = {
  name: 'play',
  description: 'Play the given sound',
  async execute(message, args, client) {
    const voiceChannel = message.member.voice.channel;
    const sound = args.shift().toLowerCase();

    if (audioFiles.includes(`${sound}.mp3`)) {
      if (voiceChannel) {
        let user_id = message.author.id
        let channel_id = message.channel.id
        user_input = await UserInput.findOne({ user_id: user_id, channel_id: channel_id})

        // check for spam
        if (user_input == null || user_input.message_count < MAX_MSG_AMOUNT) {
          input = await UserInput.findOneAndUpdate(
            {user_id: user_id, channel_id: channel_id}, {$inc: {message_count: 1}}, {new: true, upsert: true}
          );
          
          if (!client.voice.connections.some(conn => conn.channel.id == voiceChannel.id)) {
            const connection = await voiceChannel.join();
            console.log('connected to voice chat');
            play(connection, sound, channel_id);
          } else {
            queue_count = await ChannelQueue.find({channel_id: channel_id}).countDocuments()
            if (queue_count < MAX_QUEUE_SIZE) {
              console.log(`Enqueuing ${sound}`);
              enqueue = new ChannelQueue({channel_id: channel_id, command: sound, queued_at: Date.now()});
              enqueue.save();
            } else {
              message.reply("the queue has reached it's maximum capacity. Wait a few seconds then try again.")
            }
          }
          // decreasing the message count
          setTimeout(function () {
            UserInput.findOneAndUpdate(
              { user_id: user_id, channel_id: channel_id }, { $inc: { message_count: -1 } }
            ).exec();
          }, 10000)
        } else {
          message.reply('y u spammin :upside_down: ?');
        }
      }
      else {
        message.reply('you should join the voice channel :speaking_head:');
      }
    } else {
      message.reply("I can't find that sound :smiling_face_with_tear: \nVisit https://p4panash.github.io/dank-soundboard-site/commands for a list of available sounds.")
    }
  }
}