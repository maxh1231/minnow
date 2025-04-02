const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, VoiceState } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { token, guildId, clientId } = require('./config.json');
const { connectToVoice, getEmptyVoiceChannels, initMovement, disconnectFromVoice } = require('./utils');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!' });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!' });
        }
    }
});

// on Voice State Updates I.E. users joining/disconnecting, muting/unmuting, starting stream, closing stream, and more. This applies to the entire server
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    const botCurrentChannel = getVoiceConnection(guildId);

    // if the user that created the VoiceStateUpdate event is NOT the bot, AND the new VoiceStateUpdate is in the bot's current channel
    if (newState.id != clientId && newState.channelId == botCurrentChannel?.joinConfig.channelId) {
        const server = client.guilds.cache.get(guildId);
        const channels = await getEmptyVoiceChannels(server);
        const randomIndex = Math.floor(Math.random() * channels.length);
        disconnectFromVoice();
        connectToVoice(channels[randomIndex].id, server);
    }
});

// on bot startup
client.once(Events.ClientReady, async readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    const server = client.guilds.cache.get(guildId);
    initMovement(server);
});

client.login(token);

// immediately disconnects bot from voice channel upon exiting application (dev convenience)
process.on('SIGTERM', disconnectFromVoice);
process.on('SIGINT', disconnectFromVoice);
