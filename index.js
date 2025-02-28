const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, VoiceState } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { token, guildId, clientId } = require('./config.json');
const { connectToVoice, getVoiceChannels, getEmptyVoiceChannels, disconnectFromVoice } = require('./utils');

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
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    botCurrentChannel = getVoiceConnection(guildId);

    if (newState.id != clientId && newState.channelId == botCurrentChannel.joinConfig.channelId) {
        const server = client.guilds.cache.get(guildId);

        const channels = await getVoiceChannels(server)

        const randomIndex = Math.floor(Math.random() * channels.length);

        connectToVoice(channels[randomIndex].id, server)
    }
});

client.once(Events.ClientReady, async readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    const server = client.guilds.cache.get(guildId);
    // const voiceChannels = await getVoiceChannels(server);
    // const emptyVoiceChannels = await getEmptyVoiceChannels(voiceChannels);

    connectToVoice("1046912070240714784", server);

});

client.login(token);

process.on('SIGTERM', disconnectFromVoice)
process.on('SIGINT', disconnectFromVoice)