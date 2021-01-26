const UserInput = require('../models/UserInput.js')
const ChannelQueue = require('../models/ChannelQueue.js')
const play = require('./helpers/play.js');

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

        if (user_input == null || user_input.message_count < 2) {
          input = await UserInput.findOneAndUpdate(
            {user_id: user_id, channel_id: channel_id}, {$inc: {message_count: 1}}, {new: true, upsert: true}
          );
          
          if (!client.voice.connections.some(conn => conn.channel.id == voiceChannel.id)) {
            const connection = await voiceChannel.join();
            console.log('connected to voice chat');
            play(connection, sound, channel_id);
          } else {
            console.log(`Enqueuing ${sound}`);
            enqueue = new ChannelQueue({channel_id: channel_id, command: sound, queued_at: Date.now()});
            enqueue.save();
          }
          setTimeout(function () {
            UserInput.findOneAndUpdate(
              { user_id: user_id, channel_id: channel_id }, { $inc: { message_count: -1 } }
            ).exec();
          }, 10000)
        } else {
          message.channel.send(`${message.author.username} y u spammin :upside_down: ?`);
        }
      }
      else {
        message.channel.send('You are not connected to the voice chat !');
      }
    }
  }
}