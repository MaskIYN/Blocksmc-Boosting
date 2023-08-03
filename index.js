// made by joavo
// dear skids, kys
// @uhqb1ns 
// NOT THE BEST BUT WORKS GOOD


const mineflayer = require('mineflayer');
const readline = require('readline');
const fs = require('fs');
const moment = require('moment');
const config = require('./config.json');


const names = fs.readFileSync('names.txt', 'utf-8').split('\n').map(name => name.trim()).filter(Boolean);
const usernames = [];
const passwords = [];


for (const name of names) {
  const [username, password] = name.split(':');
  usernames.push(username);
  passwords.push(password);
}


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const bots = [];


function createBot(username, password) {

  const bot = mineflayer.createBot({
    host: 'play.blocksmc.com',
    port: 25565, 
    username: username,
    password: password,
    version: '1.8.9',
  });


  bot.once('spawn', () => {
    console.log(`${username} Connected`);


    bot.chat(`/login ${password}`);
    console.log(`${username} Logged In!`);


    setInterval(() => {
      bot.setControlState('jump', true);
      bot.setControlState('forward', true);
    }, 100);


    setTimeout(() => {
      bot.setControlState('jump', false);
      bot.setControlState('forward', false);
      console.log(`${username} J/M Done`);
    }, 5000);
  });

  bot.on('messagestr', (message, messagePosition, jsonMsg, sender, verified) => {
    let text = message;
    if (text.startsWith('PARTY')) {
      if (text.includes('leave')) {
        bot.chat('/hub');
        console.log(`${bot.username} left from the game`);
      }
    }
    bot.on('messagestr', (message, messagePosition, jsonMsg, sender, verified) => {
      let text = message;
      if (text.startsWith('PARTY')) {
        if (text.includes('jfme')) {
          bot.chat('/jf idhoom'); // you can change name to yours
          console.log(`${bot.username} left from the game`);
        }
      }
      bot.on('messagestr', (message, messagePosition, jsonMsg, sender, verified) => {
        let text = message;
        if (text.startsWith(' TheBridge')) {
          if (text.includes('You are now playing on the RED TEAM')) {
            bot.chat('/hub');
            console.log(`${bot.username} Left The Game : Red Team!`);
          }
        }
        bot.on('messagestr', (message, messagePosition, jsonMsg, sender, verified) => {
          let text = message;
          if (text.startsWith(' TheBridge')) {
            if (text.includes('You are now playing on the BLUE TEAM')) {
              bot.chat('/hub');
              console.log(`${bot.username} Left The Game : Blue Team!`); //this are just undermaintences too lazy to fiz all of this shits
            }
          }
        }); 
      }); 
    });
  });

  bot.on('end', () => {
    console.log(`${username} disconnected, reconnecting...`);
    setTimeout(() => {
      createBot(username, password);
    }, 5000);
  });

  return bot;
}

function getCurrentTime() {
  return moment().format('[HH:mm:ss]');
}


for (let i = 0; i < usernames.length; i++) {
  const username = usernames[i];
  const password = passwords[i];
  const bot = createBot(username, password);
  bots.push(bot);
}


rl.on('line', (input) => {
  const command = input.toLowerCase();

  // Send the command to all bots
  bots.forEach((bot) => {
    bot.chat(command);
  });
});
