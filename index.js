const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const fs = require('fs');
const play = require('./commands/helpers/play.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const audioFiles = fs.readdirSync('./audio').filter(file => file.endsWith('.mp3'));
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/discord_bot', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const UserInput = require('./models/UserInput.js')
const ChannelQueue = require('./models/ChannelQueue.js')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('Connected to the db !')
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// add the new command in the collection
	client.commands.set(command.name, command);
}

client.once('ready', () => {	
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	const voiceChannel = message.member.voice.channel;

	if (command == 'ping') {
		client.commands.get('ping').execute(message, args);
	}
	else if (audioFiles.includes(`${command}.mp3`)) {
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
					play(connection, command, channel_id);
				} else {
					console.log(`Enqueuing ${command}`);
					enqueue = new ChannelQueue({channel_id: channel_id, command: command, queued_at: Date.now()});
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
});

client.login(token);