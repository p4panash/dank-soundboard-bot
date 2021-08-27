// Discord Bot Initializations
require('dotenv').config()
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
// Server Initializations
const express = require('express');
const cors = require('cors');
const app = express();
let audioFiles = [];

const fs = require('fs');
const path = require("path");

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/discord_bot',
 { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('Connected to the db !')
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	// add commands dynamically
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {	
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) {
		message.reply(`${command} not found :poop:. Type ${prefix} help for more details.`)
		return;
	} 

	try {
		client.commands.get(command).execute(message, args, client);
	} catch(error) {
		console.log(error);
		message.reply(':poop: happens. Try again.');
	}
});

client.login(process.env.TOKEN);

app.use(cors({
	origin: "*"
}));

const buildResponse = (start, end) => {
	content = audioFiles.slice(start, end).map(x => 
		({
			"id": audioFiles.indexOf(x) + 1,
			"name": x,
			"description": "sound play " + x,
			"source": "/audio?file=" + x + ".mp3",
			"audio_type": "audio/mpeg"
		})
	)

	return {
		"commands": content,
		"total_count": audioFiles.length
	};
}

app.get('/commands', (req, res) => {
	const per_page = parseInt(req.query.per_page);
	const page = parseInt(req.query.page);
	var start = (page - 1) * per_page;
	var end = start + per_page;
	response = buildResponse(start, end);

  res.json(response);
});

app.get('/audio', (req, res) => {
	const file = `${__dirname}/audio/${req.query.file}`

	res.download(file);
})

app.listen(process.env.PORT || 3000, () => {
	console.log(`app listening at port ${process.env.PORT}`)
	audioFiles = fs.readdirSync(path.join(__dirname, '/', 'audio')).filter(file => file.endsWith('.mp3')).map(x => x.split('.')[0]);
});