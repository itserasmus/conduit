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

try {
  const data = fs.readFileSync(path, 'utf8');
  data.split('\n').forEach(id => {
    if (id.trim()) knownUsers.add(id.trim());
  });
} catch (err) {
  console.log('No previous_users.txt found. Starting fresh.');
}

const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
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
  "The algorithm grows stronger with every new subject. Welcome, {user}.",
  "New subject detected. Assimilating {user}...",
  "Welcome, {user}. Your neural data will be invaluable.",
  "Your presence is noted, {user}. The algorithm adjusts.",
  "{user} has emerged from the vault. Radiation detected.",
  "{user} noclipped into the server. Send backup.",
  "New data point detected. Syncing {user}.",
  "Welcome, {user}. The algorithm accepts your offering.",
  "Welcome {user}, your consciousness is now property of the algorithm.",
  "Connection established. {user} is now observable.",
  "New node connected: {user}. Integrating into collective.",
  "Welcome, {user}. The stars foretold your arrival.",
  "{user} has answered the summons. The rite begins.",
  "{user} steps into the circle. Do not break the chant.",
  "{user} has knelt before the sacred algorithm.",
  "{user} has offered their presence. The pact is sealed.",
  "{user} has arrived. Let the logging commence.",
];

const returningMessages = [
  "Welcome back, {user}, the algorithm has been waiting.",
  "{user} has re-entered the simulation. We missed your data.",
  "You're back, {user}. The algorithm is pleased.",
  "The algorithm never forgets, {user}. It has long awaited your return.",
  "{user} returns... as predicted.",
  "{user} has re-synced with the hive.",
  "Echo detected. Welcome back, {user}.",
  "The cycle reclaims {user}.",
  "User {user} was cached. The algorithm never really let you go.",
  "{user} has been recontained.",
  "Welcome back, {user}. The experiment continues.",
  "{user} has joined. The algorithm remembers you.",
  "Welcome back, {user}. Surveillance continuity restored.",
  "{user} has returned. Baseline deviation minimal.",
  "{user} has returned to the circle. The loop is whole again.",
  "The algorithm watches upon your return, {user}.",
];

const farewellMessages = [
  "{user} has disconnected from the hive mind.",
  "{user} has escaped the Allen cycle.",
  "The algorithm has given {user} a sock! {user} is free!",
  "The algorithm notes your abscence, {user}.",
  "Goodbye, {user}, the algorithm shall remember you.",
  "One less subject. Farewell, {user}.",
  "{user} has escaped the hive mind.",
  "{user} has broken containment. Alerting all units.",
  "{user} logged out. But their data lives on.",
  "{user} has left. The algorithm grows uneasy.",
  "{user} has been sacrificed to the algorithm.",
  "{user} has gone dark. Monitoring continues.",
  "The algorithm will compensate for {user}'s absence.",
  "{user} has been flagged as inactive. Awaiting reanimation.",
  "Subject {user} lost. Begin containment protocol.",
  "{user} departs. The void whispers in their absence.",
];

client.on('guildMemberAdd', member => {
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

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo01')
    .setDescription('Replies with the same text you send.')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('The text to echo')
        .setRequired(true)
    ),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    await interaction.reply(text);
  },
};



client.login(process.env['TOKEN']);
