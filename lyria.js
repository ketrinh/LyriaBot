var Discord = require("discord.js"); //required dependencies
var wikiSearch = require("nodemw");

var bot = new Discord.Client();
/* authorize various apis */

try {
  var auth = require("./auth.json");
} catch(e){
  console.log("An auth.json is needed");
}
if(auth.bot_token) {
  console.log("logging in with bot token");
  bot.login(auth.bot_token);
}

bot.on("message", msg => { //event handler for a message
  let prefix = "!"; //prefix for the bot
  var responses = { //possible responses for the bot to respond
      "!ping": "pong!",
      "!foo": "bar!",
      "!Dong-A-Long-A-Long": "It's Lyria!",
  }
  if(!msg.content.startsWith(prefix)) return; //small optimization
  if(msg.author.bot) return; //exit if bot sends a message

  const channel = msg.channel;
  if(responses[msg.content]) { //sends the appropriate message for the cmd
    msg.channel.sendMessage(responses[msg.content]);
  }

  //begin main functionality
  if(msg.content.startsWith(prefix + "gbfwiki")) {
    searchWiki(msg);
  }
  if(msg.content.startsWith(prefix + "gwhonors")) {
    inputHonors(msg);
  }
  if(msg.channel.type === 'dm' && msg.content.startsWith(prefix + "honors")) {
    parseHonors(msg);
  }
});
function searchWiki(message) {
  let args = msg.content.split(" ").slice(1); //remove the !gbfwiki
  let searchterm = args.join(" "); //join search terms with more than one word

  var client = new wikiSearch({ //create a new nodemw bot for gbf.wiki
    protocol: 'https',
    server: 'gbf.wiki',
    path: '/',
    debug: false
  }),
  paramsQuery = { //paramaters for a direct api call
    action: 'query', //action to take: query
    prop: 'info',//property to get: info
    inprop: 'url',//add extra info about url
    generator: 'search',//enable searching
    gsrsearch: searchterm,//what to search
    gsrlimit: 1,//take only first result
    format: 'json', //output as .json
    indexpageids: 1// get page ids
  },
  paramsSearch = {
    action: 'opensearch',//action: opensearch for typos
    search: searchterm,// what to search
    limit: 1,// only 1 result
    format: 'json'//output as .json
  }
  client.api.call(paramsQuery, function(err, info, next, data) { //call api
    try { //error returned when no such page matches exactly
      console.log("querying: " + searchterm);
      let pageId = info["pageids"][0];
      console.log(info["pages"][pageId].fullurl);
      let url = info["pages"][pageId].fullurl;
      msg.channel.sendMessage("<" + url + ">");//output message to channel
    }
    catch(TypeError) { //catch that error and use opensearch protocol
      client.api.call(paramsSearch, function(err2, info2, next2, data2) {
        console.log("Typo?");
        if(!data2[3].length){//404 error url is always at 4th index
          msg.channel.sendMessage("Could not find page for " + searchterm);
        }
        else {
          msg.channel.sendMessage("<" + data2[3] + ">");//output message
        }
      });
    }
  });
}
function inputHonors(message) {
  let user = message.author;
  user.sendMessage("Please send a screenshot of your honors and in the" +
  "comment box add: !honors <honors>");
}
function parseHonors(message) {
  let args = message.content.split().slice(1);
  console.log(args);
  console.log(message.attachments.first().url);
}
bot.on('ready', () => {
  console.log('Dong-A-Long-A-Long! It\'s Lyria!');
});
