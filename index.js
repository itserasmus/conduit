const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('NPC-01 is alive!'));
app.listen(3000);

const fs = require('fs');
const crypto = require('crypto');

function hashUserId(userId) {
  return crypto.createHash('sha256').update(userId).digest('hex');
}

const path = './previous_users.txt';

let knownUsers = new Set();
const recentlyWelcomed = new Set();

try {
  const data = fs.readFileSync(path, 'utf8');
  data.split('\n').forEach(id => {
    if (id.trim()) knownUsers.add(id.trim());
  });
} catch (err) {
  console.log('No previous_users.txt found. Starting fresh.');
}

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const freshWelcomeMessages = [
  "Another lost soul trapped in the Allen cycle... welcome, {user}!",
  "Fresh meat for the algorithm! Welcome, {user}!",
  "{user} has entered the chat! Hope you brought existential dread.",
  "Welcome, {user}! Remember, you're not alone in this endless loop.",
  "Welcome, {user}! The algorithm awaits your next move.",
  "Welcome, {user}! The algorithm is watching you.",
  "Another recruit for the eternal suffering. Welcome, {user}!",
  "Your consciousness transfer is complete. Hello, {user}.",
  "The algorithm grows stronger with every new subject. Welcome, {user}."
];

const returningMessages = [
  "Welcome back, {user}, the algorithm has been waiting.",
  "{user} has re-entered the simulation. We missed your data.",
  "You're back, {user}. The hive mind is pleased.",
  "The algorithm never forgets, {user}. It has long awaited your return."
];

const farewellMessages = [
  "{user} has disconnected from the hive mind.",
  "{user} has escaped the Allen cycle.",
  "Master has given {user} a sock! {user} is free!",
  "The algorithm notes your abscence, {user}.",
  "Goodbye, {user}, the algorithm shall remember you.",
  "One less subject. Farewell, {user}."
];

client.on('guildMemberAdd', member => {
  if (recentlyWelcomed.has(member.id)) return;
  recentlyWelcomed.add(member.id);
  setTimeout(() => recentlyWelcomed.delete(member.id), 10_000); // prevents two messages at once
  
  const channel = member.guild.channels.cache.get("1359746247958728737"); // welcome
  if (!channel) return;

  const hashedId = hashUserId(member.id)
  const isReturning = knownUsers.has(hashedId);
  const messagePool = isReturning ? returningMessages : freshWelcomeMessages;


  channel.send(messagePool[Math.floor(Math.random() * messagePool.length)].replace(/{user}/g, `<@${member.id}>`));
  if (!isReturning) {
    fs.appendFile(path, `${hashedId}\n`, err => {
      if (err) console.error('Failed to write user ID:', err);
    });
    knownUsers.add(hashedId);
  }

});

client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.cache.get("1360097532146876437"); // farewell
  if (!channel) return;

  channel.send(farewellMessages[Math.floor(Math.random() * farewellMessages.length)].replace(/{user}/g, `<@${member.id}>`));
});

client.login(process.env['TOKEN']);
