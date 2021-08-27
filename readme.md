### Prerequisites
- nvm
- mongodb
### Dependencies
- node v12.14.1
- express
- opus-tools Windows: choco, Linux: apt
- ffmpeg from choco Windows: choco, Linux: apt
- npm module opusscript
- npm module node-opus
- npm module @discordjs/opus
### How to run it
If this is the first time, these should be run first:
- nvm install
- npm install
- create a `.env` file with:
  * `TOKEN` variable; you can get the token's value from the discord dashboard
  * `MONGODB_URI` variable if you have a remote database
- In the `.config` file you can setup the bot's prefix, anti-spam limit and the maximum queue size

### Starting the server locally:
- node .
