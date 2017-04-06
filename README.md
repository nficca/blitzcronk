# blitzcronk
A discord bot written in nodejs and using discordjs

### Installation
Ensure you have [node](https://nodejs.org/en/) installed.
[Create a new application](https://discordapp.com/developers/applications/me) that you will use to run blitzcronk on your discord server.
Clone blitzcronk and install each dependency:
```
$ git clone https://github.com/nficca/blitzcronk.git && cd blitzcronk
$ npm install
```
Make sure you have gulp installed globally:
```
$ npm install -g gulp
```
Now create the json config file that will tell blitzcronk to use your newly created application:
```
$ echo "{\"token\":\"<YOUR_TOKEN>\",\"prefix\":\".\"}" > config.json
```
Note that you may also set the command prefix in the config file as well. The above will use `.` by default.

Add the bot to your server using this link: `https://discordapp.com/api/oauth2/authorize?client_id=<YOUR_CLIENT_ID>&scope=bot&permissions=0`.

Now you're ready to run the bot!
```
$ gulp scripts
$ gulp start
```
