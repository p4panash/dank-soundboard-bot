const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	let connection, dispatcher;

	if (message.member.voice.channel) {
		console.log('connected to voice chat');
		connection = await message.member.voice.channel.join();
	}
	if (message.content == `${prefix}ping`) {
		message.channel.send('Pong.');
	}
	else if (message.content == `${prefix}beep`) {
		message.channel.send('Boop.');
	}
	else if (message.content == `${prefix}play`) {
		dispatcher = connection.play('airporn.mp3');

		dispatcher.on('start', () => {
			console.log('audio.mp3 is now playing!');
		});

		dispatcher.on('finish', () => {
			console.log('audio.mp3 has finished playing!');
			dispatcher.destroy();
		});

		// Always remember to handle errors appropriately!
		dispatcher.on('error', console.error);
	}
});

client.login(token);