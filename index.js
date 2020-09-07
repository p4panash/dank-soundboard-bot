const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const fs = require('fs');
const { play } = require('./commands/helpers/play.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const audioFiles = fs.readdirSync('./audio').filter(file => file.endsWith('.mp3'));


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

	if (command == 'ping') {
		client.commands.get('ping').execute(message, args);
	}
	else if (audioFiles.includes(`${command}.mp3`)) {
		if (message.member.voice.channel) {
			console.log('connected to voice chat');
			const connection = await message.member.voice.channel.join();
			play(connection, command);
		}
		else {
			message.channel.send('You are not connected to the voice chat !');
		}
	}
});

client.login(token);