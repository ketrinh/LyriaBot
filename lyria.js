"use strict";

var Discord = require("discord.js"); //required dependencies
var wikiSearch = require("nodemw");
var bot = new Discord.Client();
var fs = require("fs");
var request = require('request');
var cheerio = require('cheerio');
var PythonShell = require('python-shell');
var schedule = require('node-schedule')
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
let skillsCache = {"one":"first"};
let timerId = setInterval(()=>clearCache(), 21600000); // clear cache every 6 hours
let askCache = ["It is certain","It is decidedly so","Without a doubt","Yes definitely","You may rely on it",
"As I see it, yes","Most likely","Outlook good","Yes","Signs point to yes","I'm not sure if I heard you right","Ask again later",
"Better not tell you now","Cannot predict now","Can you ask again please?","Don't count on it","Nope!","Katalina said no",
"Outlook isn't so good","Very doubtful"];

var rule = new schedule.RecurrenceRule();
rule.hour = 14;
rule.minute = 34;


var scheduleExecute = schedule.scheduleJob(rule, function() {
  const ch = bot.guilds.get(server_id, 'LyriaBot Development');
  if (!ch) return;
  ch.defaultChannel.send("@here Never forgetti, Twitter resetti");
})

bot.on("message", msg => { //event handler for a message
  let prefix = "!"; //prefix for the bot

  if(msg.author.bot) return; //exit if bot sends a message

  const channel = msg.channel;
    //begin main functionality


  var content = msg.content;
  var result, re = /\[\[(.*?)\]\]/g;//regex
    while ((result = re.exec(msg.content)) != null) {
        console.log(result);
        if(result[1].length !== 0) {
          searchWiki(msg, result[1]);
        }
    }
  if (msg.content === "SOIYA") {
    msg.channel.send("SOIYA");
  }
  if(msg.content.charAt(0) == prefix) {
    if(msg.content.startsWith(prefix + "gwhonors")) {
      inputHonors(msg);
    }

    else if(msg.content.startsWith(prefix + "choose")) {
      choose(msg);
    }

    else if(msg.content.startsWith(prefix + "ask")) {
      ask(msg);
    }

    else if(msg.channel.type === 'dm' && msg.content.startsWith(prefix + "honors")) {
      parseHonors(msg);
    }

    else if(msg.channel.id == auth.officer_channel && msg.content.startsWith(prefix + "gwprelims")) {
      console.log(msg.channel.name);
      prelimsNotif(msg);
    }

    else if (msg.content.startsWith(prefix + "gwprelims")) {
      msg.channel.send("Please make the command in the officers channel");
    }

    else if (msg.channel.id == auth.officer_channel && msg.content.startsWith(prefix + "gwfinals")) {
      gwfinalsMessage(msg);
    }

    else if (msg.content.startsWith(prefix + "gwfinals")) {
      msg.channel.send("Please make the command in the officers channel");
    }


    else if(msg.channel.id == auth.officer_channel && msg.content.startsWith(prefix + "gwvictory")) {
      bot.guilds.get(auth.server_id).defaultChannel.sendMessage("@everyone\nWe won!\n");
    }


   else if (msg.content.startsWith(prefix + "help") || msg.content.startsWith(prefix + "h")) {
      helpMessageFormat(msg);
    }
 /*   else if (msg.content.startsWith(prefix + "setwaifu")) {
      setWaifu(msg);
    }

    else if(msg.content.startsWith(prefix + "waifu")) {
      getWaifu(msg);
    }*/
    else if(msg.content.startsWith(prefix + "skills")) {
      getSkills(msg);
   }
    else if(msg.content.startsWith(prefix + "!" || prefix)) {
      return;
    }
    else {
        msg.channel.send("Unrecognized Command. Use !help to see a list of commands!");
    }

  }
});
function searchWiki(msg, search) {
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
      msg.channel.send("<" + url + ">");//output message to channel
    }
    catch(TypeError) { //catch that error and use opensearch protocol
      client.api.call(paramsSearch, function(err2, info2, next2, data2) {
        console.log("Typo?");
        if(!data2[3].length){//404 error url is always at 4th index
          msg.channel.send("Could not find page for " + search);
        }
        else {
          msg.channel.send("<" + data2[3] + ">");//output message
        }
      });
    }
  });
}

function inputHonors(message) {
  let user = message.author;
  user.send("Please send a screenshot of your honors and in the" +
  "comment box add: !honors <honors>");
}

function parseHonors(message) {
  let user = message.author;
  let args = message.content.split(" ").slice(1);

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

// Preliminaries notification message; Simple @everyone in default channel
function prelimsNotif(message) {
  var args = message.content.split(" ").slice(1);
  if (isNaN(args[0]) || args[0] < 0) {
    message.channel.send("Please enter a valid non negative number.");
    return;
  }
  var prelimsMessage = "@everyone\nGuild War Preliminaries have started!\nMinimum Contribution: " + args[0] + "m";
  bot.guilds.get(auth.server_id).defaultChannel.send(prelimsMessage);
  //console.log(message.author);
  //console.log((bot.guilds.get(serverID).defaultChannel.send("This is a nuke @everyone")));
  //console.log(bot.guilds.firstKey());

}

function gwfinalsMessage(message) {
  let args = message.content.split(" ").slice(1);
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

  var finalsMessage = "@everyone\nFinals Day " + args[0] + " has started!\nFighting: " + args[1] + "\nMinimum Contribution: " + args[2] + "m\nGood Luck!\n";
  bot.guilds.get(auth.server_id).defaultChannel.send(finalsMessage);
}


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
    findPage(message, search);
  }
}

function findPage(msg, search) {
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
      parseSkills(msg, url, search);
    }
    catch(TypeError) { //catch that error and use opensearch protocol
      client.api.call(paramsSearch, function(err2, info2, next2, data2) {
        console.log("Typo?");
        if(!data2[3].length){//404 error url is always at 4th index
          msg.channel.send("There is nothing in my journal about " + search);
        }
        else {
          parseSkills(msg, data2[3], search);
        }
      });
    }
  });
}

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

// Returns a Rich Embed for later use
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
    embed.addField(outputTest[index], skillDesc);
    }
  return embed;
}

function clearCache() {
  skillsCache = {};
  console.log("cache cleared");
}

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

function helpMessageFormat(message) {
  var embed= new Discord.RichEmbed()
    .setAuthor("Lyria", "http://i.imgur.com/pbGXrY5.png")
    .setTitle("Help Section")
    .setColor("#c7f1f5")
    .setDescription("Dong-A-Long-A-Long! It\'s Lyria, here to help you with anything! Here are my commands!")
    .setThumbnail("https://i.imgur.com/F1ZxMRW.png")
    .addField("[[search term(s)]]", "I\'ll try to find a wiki page for whatever you search")
    .addField("!skills <character name>", "I\'ll look up the skills for that character")
    .addField("!ask <question>", "Ask me any question!")
    .addField("!choose <item 1>;<item 2>;...", "I\'ll randomly pick one!")
    .addField("!gwprelims <number>", "[OFFICER CHANNEL ONLY]\n I\'ll tell everyone the minimum contribution!")
    .addField("!gwfinals <number> <yes/no> <number>", "[OFFICER CHANNEL ONLY]\nFirst: number 1-5 for Finals Day #\nSecond: yes or no to fighting\nThird: number of minimum honors")
  message.author.send({embed});
}


bot.on('ready', () => {
  console.log('Dong-A-Long-A-Long! It\'s Lyria!');
});
