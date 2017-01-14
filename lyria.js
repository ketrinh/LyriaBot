var Discord = require("discord.js"); //required dependencies
var wikiSearch = require('nodemw');
var bot = new Discord.Client();

try {
  var auth = require("./auth.json");
} catch(e){
  console.log("An auth.json is needed");
}

if (auth.bot_token) {
  console.log("logging in with bot token");
  bot.login(auth.bot_token);
}
var commands = {
  "!ping": {
    description: "responds pong",
    process: function(bot, msg, suffix) {
      msg.channel.sendMessage("pong!");
    }
  }
}

bot.on("message", msg => { //event handler for a message
  let prefix = "!"; //prefix for the bot
  var responses = { //possible responses for the bot to respond
      "!ping": "pong!",
      "!foo": "bar!",
      "!Dong-A-Long-A-Long": "It's Lyria!"
  }
  if(!msg.content.startsWith(prefix)) return; //small optimization
  if(msg.author.bot) return; //exit if bot sends a message

  if(responses[msg.content]) { //sends the appropriate message for the cmd
    msg.channel.sendMessage(responses[msg.content]);
  }

  //begin main functionality
  if(msg.content.startsWith(prefix + "gbfwiki")) {
    let args = msg.content.split(" ").slice(1); //remove the !gbfwiki
    let searchterm = args.join(" "); //join search terms with more than one word

    var client = new wikiSearch({ //create a new nodemw bot for gbf.wiki
      protocol: 'https',
      server: 'gbf.wiki',
      path: '/',
      debug: false
    }),
    params = { //paramaters for a direct api call
      action: 'opensearch',
      search: searchterm,
      limit: 1,
      format: 'json'
    };

    console.log("Searching for: " + searchterm);

    client.api.call(params, function(err, info, next, data) { //call the api
      console.log(searchterm + ": " + data);
      //data[3] contains the url for the page
      if(!data[3].length){ //if there's nothing there
        msg.channel.sendMessage("Something went wrong :(");
      }
      else { //post url in chat
        msg.channel.sendMessage("<" + data[3] + ">"); //no embeds

      }
    });
  }
});

bot.on('ready', () => {
  console.log('Dong-A-Long-A-Long! It\'s Lyria!');
});
