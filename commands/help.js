const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'help command',
	execute(message, args) {
		message.channel.send(`To play a sound type: \n${prefix} play + "sound_name" \n\nVisit https://p4panash.github.io/dank-soundboard-site/commands for the list of available sounds.`);
	},
}