const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('NPC-01 is alive!'));
app.listen(3000);

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const welcomeMessages = [
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

const farewellMessages = [
  "{user} has disconnected from the hive mind.",
  "{user} has escaped the Allen cycle.",
  "Master has given {user} a sock! {user} is free!",
  "The algorithm notes your abscence, {user}.",
  "Goodbye, {user}, the algorithm shall remember you.",
  "One less subject. Farewell, {user}."
];

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.get("1359746247958728737"); // welcome
  if (!channel) return;

  channel.send( welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
                  .replace('{user}', `<@${member.id}>`));
});

client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.cache.get("1360097532146876437"); // farewell
  if (!channel) return;

  channel.send(farewellMessages[Math.floor(Math.random() * farewellMessages.length)]
                  .replace('{user}', `<@${member.id}>`));
});

client.login(process.env['TOKEN']);
