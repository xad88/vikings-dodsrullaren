# vikings-dodsrullaren
Vikings-dödsrullaren
1. install node.js
2. create new app-folder (see guide on node.js page)... https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
3. install Discord.js with command: npm install discord.js
4. add bot.js to your app-folder
5. open bot.js with text-editor and add your discord api token key under settings->*Token-api*
   this could be find on discord for developers: https://discordapp.com/developers/applications/
6. *optional* add channel-id to friday_callout_channel and deathroll_channel *optional*
   this could be done later on by using .channel_id in discord text-channels to find this id's and copy paste them to this values.
7. Run the application by navigating to the app-folder and type: node bot.js
8. Add the bot to your server by clicking on the specified link on the discord for developers page:
   https://discordapp.com/developers/applications/
9. If you not done it yet start your bot and go to your designated friday-callout channel and typ .channel_id or whatever your prefix is,    paste that id and add it to the friday_callout_channel variable under settings inside bot.js. Do the same for your designated              deathroll_channel id.
   
Important! friday_callout_channel and deathroll_channel id must be set manually!
