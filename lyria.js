var Discord = require("discord.js");
var wikiSearch = require('nodemw');
var bot = new Discord.Client();
var commands = {
  "!ping": {
    description: "responds pong",
    process: function(bot, msg, suffix) {
      msg.channel.sendMessage("pong!");
    }
  }
}

bot.on("message", msg => {
  let prefix = "!"; //prefix for the bot
  var responses = {
      "!ping": "pong!",
      "!foo": "bar!",
      "!Dong-A-Long-A-Long": "It's Lyria!"
  }
  if(!msg.content.startsWith(prefix)) return; //small optimization
  if(msg.author.bot) return; //exit if bot sends a message

  if(responses[msg.content]) {
    msg.channel.sendMessage(responses[msg.content]);
  }

  if(msg.content.startsWith(prefix + "gbfwiki")) {
    let args = msg.content.split(" ").slice(1);
    let searchterm = args.join("+");
    var client = new wikiSearch({
      protocol: 'https',
      server: 'gbf.wiki',
      path: '/',
      debug: false
    }),
    params = {
      action: 'opensearch',
      search: searchterm,
      limit: 1,
      format: 'json'
    };

    client.api.call(params, function(err, info, next, data) {
      console.log(searchterm + ": " + data);
      msg.channel.sendMessage(data[3]);

    });
  }
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login("MjY5Mzg4MjE5NDI5Mjg5OTg0.C1rfhw.SBEVPLlwJq63oP5QlTXz0qP0LVQ");
