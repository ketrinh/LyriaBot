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
    paramsQuery = { //paramaters for a direct api call
      action: 'query',
      prop: 'info',
      inprop: 'url',
      generator: 'search',
      gsrsearch: searchterm,
      gsrlimit: 1,
      format: 'json',
      indexpageids: 1
    },
    paramsSearch = {
      action: 'opensearch',
      search: searchterm,
      limit: 1,
      format: 'json'
    }

    console.log("Searching for: " + searchterm);

    client.api.call(paramsQuery, function(err, info, next, data) { //call the api
      try {
        console.log(info);

        console.log(info["pageids"][0]);
        let pageId = info["pageids"][0];
        console.log(info["pages"][pageId].fullurl);
        let url = info["pages"][pageId].fullurl;
        msg.channel.sendMessage("<" + url + ">");
      }
      catch(TypeError) {
        client.api.call(paramsSearch, function(err2, info2, next2, data2) {
          console.log("Typo?");
          if(!data2[3].length){
            msg.channel.sendMessage("Could not find page for " + searchterm);
          }
          else {
            msg.channel.sendMessage("<" + data2[3] + ">");
          }
        });
      }
    });
  }
});

bot.on('ready', () => {
  console.log('Dong-A-Long-A-Long! It\'s Lyria!');
});
