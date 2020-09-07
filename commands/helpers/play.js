module.exports = {
	play(connection, filename) {
		const dispatcher = connection.play(`./audio/${filename}.mp3`);

		dispatcher.on('start', () => {
			console.log(`${filename} is now playing!`);
		});

		dispatcher.on('finish', () => {
			console.log(`${filename} has finished playing!`);
			dispatcher.destroy();

			// TODO(2): disconnect only if there aren't any sound in queue
			// TODO(1): keep a queue of sounds for each connection
			connection.disconnect();
		});

		// Always remember to handle errors appropriately!
		dispatcher.on('error', console.error);
	},
};
