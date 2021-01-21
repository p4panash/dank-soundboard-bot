module.exports = function play(connection, filename, channel_id) {
		const dispatcher = connection.play(`./audio/${filename}.mp3`);
		const ChannelQueue = require('../../models/ChannelQueue.js')

		dispatcher.on('start', () => {
			console.log(`${filename} is now playing!`);

		});

		dispatcher.on('finish', async () => {
			console.log(`${filename} has finished playing!`);

			queued = await ChannelQueue.find({channel_id: channel_id}).sort({queued_at: 'asc'})

			if (queued[0] != null) {
				filename = queued[0].command;
				ChannelQueue.findOneAndDelete({_id: queued[0].id}).exec();
				play(connection, filename, queued[0].channel_id)
			} else {
				dispatcher.destroy();
				connection.disconnect();
			}
		});

		// Always remember to handle errors appropriately!
		dispatcher.on('error', console.error);
}
