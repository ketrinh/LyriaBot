"use strict";
/*---------------------------------------
      Lyria Bot
    By: Kendrick Trinh and Hung Bao
Description:


-----------------------------------------*/


var Discord = require("discord.js"); //required dependencies
var wikiSearch = require("nodemw");
var bot = new Discord.Client();
var fs = require("fs");
var request = require('request');
var cheerio = require('cheerio');
var PythonShell = require('python-shell');
var schedule = require('node-schedule');
const gacha = require('./gacha');
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
// Initialize skills cache and set timer to clear cache after X amount of hours
let skillsCharLimit = 200;
let embedFieldCharLimit = 1000;
let skillsCache = {"one":"first"};
let supportSkillsCache = {"one":"first"};
let timerId = setInterval(()=>clearCache(), 172800000); // clear cache every 6 hours
let timerId2 = setInterval(()=>clearSupportCache(), 172800000); // clear cache every 12 hours

// Predetermined answers for !ask function
let askCache = ["It is certain","It is decidedly so","Without a doubt","Yes definitely","You may rely on it",
"As I see it, yes","Most likely","Outlook good","Yes","Signs point to yes","I'm not sure if I heard you right","Ask again later",
"Better not tell you now","Cannot predict now","I don't know","Don't count on it","Nope!","Katalina said no",
"Outlook not good","Very doubtful"];

let chatCommands = {"!choose":choose, "!ask":ask, "!draw":draw, "!gwprelims":prelimsNotif, "!gwfinals":gwfinalsMessage, "!help":helpMessageFormat,
"!h":helpMessageFormat, "!skills":getSkills, "!skill":getSkills, "!supports":getSupportSkills, "!support":getSupportSkills, "!passive":getSupportSkills, "!passives":getSupportSkills};

var rule = new schedule.RecurrenceRule();
rule.hour = 19;
rule.minute = 55;


var scheduleExecute = schedule.scheduleJob(rule, function() {
  const ch = bot.guilds.get(auth.server_id, 'Endgame GBF');
  if (!ch){
    console.log("channel not found");
    return;
  }
  ch.defaultChannel.send("@here Never forgetti, Twitter resetti");
})

bot.on("message", msg => { //event handler for a message
  let prefix = "!"; //prefix for the bot

  if(msg.author.bot) return; //exit if bot sends a message

  const channel = msg.channel;

  //begin main functionality

  var content = msg.cleanContent;
  var result, re = /\[\[(.*?)\]\]/g;//regex
    while ((result = re.exec(content)) != null) {
        console.log(result);
        if(result[1].length !== 0) {
          searchWiki(msg, result[1]);
        }
    }
  if (content === "SOIYA") {
    msg.channel.send("SOIYA");
  }
  if(content.charAt(0) == prefix) {
    var lc = content.toLowerCase();
    var first_arg = (lc.split(" "))[0];

    if (first_arg in chatCommands) {
      chatCommands[first_arg](msg);
    }
    else {
      console.log("Invalid command");
    }
  }
});

function searchWiki(msg, search, command) {
  var client = new wikiSearch({ //create a new nodemw bot for gbf.wiki
    protocol: 'https',
    server: 'gbf.wiki',
    path: '/',
    debug: false
  }),
  paramsQuery = { //parameters for a direct api call
    action: 'query', //action to take: query
    prop: 'info',//property to get: info
    inprop: 'url',//add extra info about url
    generator: 'search',//enable searching
    gsrsearch: search,//what to search
    gsrlimit: 1,//take only first result
    format: 'json', //output as .json
    indexpageids: 1// get page ids
  },
  paramsSearch = {
    action: 'opensearch',//action: opensearch for typos
    search: search,// what to search
    limit: 1,// only 1 result
    format: 'json'//output as .json
  }
  client.api.call(paramsQuery, function(err, info, next, data) { //call api
    console.log("querying: " + search);

    try { //error returned when no such page matches exactly
      let pageId = info["pageids"][0];
      console.log(info["pages"][pageId].fullurl);
      let url = info["pages"][pageId].fullurl;
      if(command == "skill") {
        console.log("user wants skills");
        parseSkills(msg, data2[3], search);
      }
      else if(command == "support") {
        console.log("user wants support skills");
        parseSupportSkills(msg, data2[3], search);
      }
      else{
        console.log("user wants page")
        msg.channel.send("<" + data2[3] + ">");//output message
      }
    }
    catch(TypeError) { //catch that error and use opensearch protocol
      console.log("no exact match")
      client.api.call(paramsSearch, function(err2, info2, next2, data2) {
        console.log("Typo?");
        if(!data2[3].length){//404 error url is always at 4th index
          msg.channel.send("There is nothing in my journal about " + search);
        }
        else {
          if(command == "skill") {
            console.log("user wants skills");
            parseSkills(msg, data2[3], search);
          }
          else if(command == "support") {
            console.log("user wants support skills");
            parseSupportSkills(msg, data2[3], search);
          }
          else{
            console.log("user wants page")
            msg.channel.send("<" + data2[3]+ ">");//output message
          }
        }
      });
    }
  });
}
function inputHonors(message) {
  var user = message.author;
  user.send("Please send a screenshot of your honors and in the" +
  "comment box add: !honors <honors>");
}

function parseHonors(message) {
  var user = message.author;
  var args = message.content.split(" ").slice(1);

  if (isNaN(args[0])) {    // User input check for integer
    user.send("Please enter a valid number.  For example, to enter 10" +
    " million honors, type 10");
    return;
  }
  if (!(message.attachments.first() == undefined)) {
    console.log(message.attachments.first().url);
  }
  console.log("Username is: " + message.author["username"]);
  console.log("Honors is: " + args[0]);

}

/***************************
 * Preliminaries notification message; Simple @everyone in default channel
 * Requires valid integer argument.
**************************/
function prelimsNotif(message) {
  if (message.channel.id != auth.officer_channel) {
    message.channel.send("Please make the command in the officers channel");
    return;
  }
  var args = message.content.split(" ").slice(1);
  if (isNaN(args[0]) || args[0] < 0) {
    message.channel.send("Please enter a valid non negative number.");
    return;
  }
  var prelimsMessage = "Guild War Preliminaries have started!\nMinimum Contribution: " + args[0] + "m";
  bot.guilds.get(auth.server_id).defaultChannel.send(prelimsMessage);
  //console.log(message.author);
  //console.log((bot.guilds.get(serverID).defaultChannel.send("This is a nuke @everyone")));
  //console.log(bot.guilds.firstKey());

}

/***************************
  GW finals message
  Notifies the default channel a message notification with @everyone of GW Finals requirements
  Requires 3 valid arguments when using the !gwfinals command
  First: Number 1-5
  Second: yes or no
  Third: Any valid number
**************************/
function gwfinalsMessage(message) {
  if (message.channel.id != auth.officer_channel) {
    message.channel.send("Please make the command in the officers channel");
    return;
  }
  var args = message.content.split(" ").slice(1);
  if (args.length != 3) {
    message.channel.send("Make sure to fill all fields in the command.  Use '!help' for to learn more\n");
    return;
  }
  if (isNaN(args[0]) || isNaN(args[2])) {
    message.channel.send("The first and third fields need to be numbers. Use !help to learn more\n");
    return;
  }
  if (args[1].toLowerCase() != "yes" && args[1].toLowerCase() != "no") {
    message.channel.send("Please indicate 'yes' or 'no' in the second field\n");
    return;
  }
  if (args[0] < 1 || args[0] > 5) {
    message.channel.send("First field number needs to be a 1, 2, 3, 4, or 5 to indicate Finals day\n");
    return;
  }

  var finalsMessage = "Finals Day " + args[0] + " has started!\nFighting: " + args[1] + "\nMinimum Contribution: " + args[2] + "m\nGood Luck!\n";
  bot.guilds.get(auth.server_id).defaultChannel.send(finalsMessage);
}


/**************************
 * Beginning of getSkills function
 * Splits message into args and checks if a valid character name
 * is in the cache.
 * Otherwise, call findPage function.
**************************/
function getSkills(message) {
  var args = message.content.split(" ").slice(1);
  if (args.length < 1) {
    message.channel.send("Enter a character name");
    return;
  }
  var search = "";
  if (args.length > 1) {
    var i;
    for (i = 0; i < args.length-1; i++) {
      search += args[i] + " ";
    }
    search += args[args.length-1];
  }
  else {
    search += args[0];
  }
  if (skillsCache.hasOwnProperty(search.toLowerCase())) {
    var embed = skillsCache[search.toLowerCase()];
    message.channel.send({embed});
  }
  else {
    searchWiki(message, search, "skill");
  }
}

/**************************
 * parseSkills is called when a valid gbf.wiki page is found.
 * Calls on PythonShell to run the webscraping script in scraper.py.
 * If there is an error, the page was not the correct one.
 * On success, calls skillsFormatMessage, passing in the webscraped data.
 * The Rich Embed is cached and the message is sent to the channel.
**************************/
function parseSkills(msg, page, search) {
  var url = page;
  var pyshell = new PythonShell('scraper.py', {
    mode: 'text',
    pythonPath: 'python3'
  });
  var output = '';
  pyshell.stdout.on('data', function (data) {
    output += ''+data;
  });
  pyshell.send(url).end(function(err){
    if (err) {
      console.log(err);
      console.log("Invalid skills page");
      msg.channel.send("I found no skills in <" + url + ">");
    } else{
      var embed = skillsFormatMessage(output);
      skillsCache[search.toLowerCase()] = embed;
      msg.channel.send({embed});
      console.log("parseSkills success");
      //console.log(outputTest.length);
    }

  });
}

// Returns a Rich Embed using the webscraped skills data
function skillsFormatMessage(output) {
  var embed = new Discord.RichEmbed()
    .setAuthor("Lyria","http://i.imgur.com/pbGXrY5.png")
    .setColor("#c7f1f5");
  var outputTest = output.split(/\r?\n/);
  embed.setTitle(outputTest[0])
    .setURL(outputTest[1])
    .setThumbnail("https://i.imgur.com/ueSiofI.png");
  var skillNum = (outputTest.length - 3)/4;
  console.log("Skill Num: " + skillNum);
  var i;
  for (i = 0; i < skillNum; i++) {
    var index = (i * 4) + 2;
    var skillDesc = outputTest[index+1] + "\n" + outputTest[index+2] + "\n" + outputTest[index+3];
    if (skillDesc.length > skillsCharLimit) {
      embed.addField(outputTest[index], "Skill Description exceeds character limit. Click on gbf.wiki page link to view it.");
    } else {
      embed.addField(outputTest[index], skillDesc);
    }
  }
  return embed;
}

// Clears the skills cache after X amount of hours.
function clearCache() {
  skillsCache = {};
  console.log("cache cleared");
}

function clearSupportCache() {
  supportSkillsCache = {};
  console.log("support cache cleared");
}

function getSupportSkills(message) {
  var args = message.content.split(" ").slice(1);
  if (args.length < 1) {
    message.channel.send("Enter a character name");
    return;
  }
  var search = "";
  if (args.length > 1) {
    var i;
    for (i = 0; i < args.length-1; i++) {
      search += args[i] + " ";
    }
    search += args[args.length-1];
  }
  else {
    search += args[0];
  }
  if (supportSkillsCache.hasOwnProperty(search.toLowerCase())) {
    var embed = supportSkillsCache[search.toLowerCase()];
    message.channel.send({embed});
  }
  else {
    searchWiki(message, search, "support");
  }
}

function parseSupportSkills(msg, page, search) {
  var url = page;
  var pyshell = new PythonShell('supportscraper.py', {
    mode: 'text',
    pythonPath: 'python3'
  });
  var output = '';
  pyshell.stdout.on('data', function (data) {
    output += ''+data;
  });
  pyshell.send(url).end(function(err){
    if (err) {
      console.log(err);
      console.log("Invalid skills page");
      msg.channel.send("I found no support skills in <" + url + ">");
    } else{
      var embed = skillsSupportFormatMessage(output);
      supportSkillsCache[search.toLowerCase()] = embed;
      msg.channel.send({embed});
      console.log("parseSupportSkills success");
      //console.log(outputTest.length);
    }

  });
}

// Returns a Rich Embed using the webscraped skills data
function skillsSupportFormatMessage(output) {
  //console.log(output);
  var embed = new Discord.RichEmbed()
    .setAuthor("Lyria","http://i.imgur.com/pbGXrY5.png")
    .setColor("#c7f1f5");
  var outputTest = output.split(/\r?\n/);
  //console.log("outputTest length is : " + outputTest.length);
  //console.log(outputTest)
  embed.setTitle(outputTest[0])
    .setURL(outputTest[1])
    .setThumbnail("https://i.imgur.com/ueSiofI.png");
  var skillNum = (outputTest.length - 3)/3;
  //console.log("Skill Num: " + skillNum);
  var i;
  for (i = 0; i < skillNum; i++) {
    var index = (i * 3) + 2;
    var skillDesc = outputTest[index+1] + "\n" + outputTest[index+2] + "\n";
    if (skillDesc.length > skillsCharLimit) {
      embed.addField(outputTest[index], "Skill Description exceeds character limit. Click on gbf.wiki page link to view it.");
    } else {
      embed.addField(outputTest[index], skillDesc);
    }
  }
  return embed;
}

/**************************
 * choose function picks a random argument from a message split with ;
 * Last argument doesn't need a semicolon
**************************/
function choose(message) {
  var args = message.content.slice(8).split(";");
  var validChoices = [];
  for (var i = 0; i < args.length; i++) {
    if (args[i].length > 0) {
      validChoices.push(args[i]);
    }
  }
  if (validChoices.length <= 1) {
    message.channel.send("I only see one option to choose from...");
    return;
  }
  var answer = validChoices[Math.floor(Math.random() * validChoices.length)];
  var embed = new Discord.RichEmbed()
    .setAuthor("Lyria","http://i.imgur.com/pbGXrY5.png")
    .setColor("#c7f1f5")
    .setDescription(answer);
  message.channel.send({embed});
}

// ask function returns a random predetermined answer as a Rich Embed
function ask(message) {
  var args = message.content.slice(5);
  if (args.length > 256) {
    message.channel.send("That question is too long");
    return;
  }
  var embed = new Discord.RichEmbed()
    .setAuthor("Lyria","http://i.imgur.com/pbGXrY5.png")
    .setTitle(":question:**Question**")
    .setColor("#c7f1f5")
    .setDescription(args)
    .addField(":pencil:**Answer**",askCache[Math.floor(Math.random() * askCache.length)]);
  message.channel.send({embed});
}

/**************************
 * Formats a help message in a Rich Embed and sends it to the author as a PM.
 * Help Message can be expanded with .addField method.
**************************/
function helpMessageFormat(message) {
  var embed= new Discord.RichEmbed()
    .setAuthor("Lyria", "http://i.imgur.com/pbGXrY5.png")
    .setTitle("Help Section")
    .setColor("#c7f1f5")
    .setDescription("Dong-A-Long-A-Long! It\'s Lyria, here to help you with anything! Here are my commands!")
    .setThumbnail("https://i.imgur.com/F1ZxMRW.png")
    .addField("[[search term(s)]]", "I\'ll try to find a wiki page for whatever you search")
    .addField("!skills <character name>", "I\'ll look up the skills for that character")
    .addField("!supports <character name>", "I\'ll look up the supports for that character")
    .addField("!ask <question>", "Ask me any question!")
    .addField("!choose <item 1>;<item 2>;...", "I\'ll randomly pick one!")
    .addField("!draw <1 or 10>", "Do a simulated 1/10 gacha pull")
    .addField("!gwprelims <number>", "[OFFICER CHANNEL ONLY]\n I\'ll tell everyone the minimum contribution!")
    .addField("!gwfinals <number> <yes/no> <number>", "[OFFICER CHANNEL ONLY]\nFirst: number 1-5 for Finals Day #\nSecond: yes or no to fighting\nThird: number of minimum honors")
  message.author.send({embed});
}

/**************************
 * gachaPull function
 * Args: 1 or 10
 * Simulates a ten draw or single pull using gacha.js.
**************************/
function draw(message) {
  var args = message.content.split(" ").slice(1);
  if (args.length < 1) {
    message.channel.send("Please enter 1 or 10 after the command.");
    return;
  }
  var drawType = Number(args[0]);
  if (isNaN(drawType)) {
    message.channel.send("You need to enter a 1 or 10 for the type of gacha pulls.");
    return;
  }
  if (drawType == 1 || drawType == 10) {
    var drawResult = gacha.Gacha(drawType);
    var embed = new Discord.RichEmbed()
      .setAuthor("Lyria", "http://i.imgur.com/pbGXrY5.png")
      .setTitle("Gacha Results")
      .setColor("#c7f1f5")
      .setThumbnail("https://i.imgur.com/IQwyQUC.png")
      .setDescription(drawResult);

    //console.log("Draw result for Type: " + drawType + " is\n" + drawResult);
    message.channel.send({embed});
  }
}


bot.on('ready', () => {
  console.log('Dong-A-Long-A-Long! It\'s Lyria!');
});
