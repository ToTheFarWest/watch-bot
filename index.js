const Discord = require('discord.js')
const fs = require('fs')
const config = require('./config.json')
const client = new Discord.Client()
const Enmap = require('enmap')
const watchlist = new Enmap({name: 'Watchlist'});

function saveConfig() {
  fs.writeFile('config.json', JSON.stringify(config), err => {
    if (err) console.error(err); else (console.log('Config saved!'))
  })
}

client.on('ready', async () => {
  await watchlist.defer
  console.log(`Logged in on ${client.guilds.size} servers, serving ${client.users.size} users`)
})

client.on('message', message => {

  if (!message.guild || message.author.bot) return;
  
  //Adds someone to a user's watcher list
  if (message.content.startsWith('!watch')) {
    console.log('Command recieved!')
    const user = message.mentions.users.first()
    if (watchlist.has(user.id)) {
      watchers = watchlist.get(user.id)
      if (!(watchers.includes(message.author.id)))
      {
        console.log('Successfully added a watcher')
        watchlist.push(user.id, message.author.id)
        message.channel.send('You are now watching ' + user.username)
      }
      else {
        message.channel.send("You are already watching this person!")
        console.log('User is already watching')
      }
    }
    else {
      watchlist.set(user.id, [message.author.id])
      message.channel.send('You are now watching ' + user.username)
      console.log('Added a new user to the db')
    }
  }

  //Removes someone from a user's watcher list
  if(message.content.startsWith('!unwatch')) {
    user = message.mentions.users.first()
    if (watchlist.has(user.id) && watchlist.get(user.id).includes(message.author.id)) {
      watchlist.remove(user.id, message.author.id)
      message.channel.send('You are no longer watching ' + user.username)
    }
    else {
      message.channel.send("You were not watching this user. Are you sure you tagged the correct person?")
    }
  }

  if (watchlist.has(message.author.id) && config.phrases.some(v => { return message.content.indexOf(v) >= 0})) {

    watchers = watchlist.get(message.author.id)
    watchers.forEach(w => {
      message.guild.members.get(w).send(`${message.author} said "${message.content}" in ${message.channel} on ${message.guild.name}`)
    })
    // config.owners.forEach(owner => {
    //   client.users.get(owner).send(`${message.author} said "${message.content}" in ${message.channel} on ${message.guild.name}`)
    // });
  }
})

client.login(config.token)