const { guildId } = require('./config.json')
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

/**
 * Gets voice channels of a provided server
 * Converts from Collection to Array
 * @param server | Guild object 
 * @returns {Promise<Array>}
 */
const getVoiceChannels = async (server) => {
    let channels = await server.channels.fetch();
    const voiceChannels = channels.filter((channel) => channel.type === 2);
    return Array.from(voiceChannels.values());
}

/**
 * Gets empty voice channels of a provided server
 * Converts from Collection to Array
 * @param server | Guild object
 * @returns {Promise<Array>}
 */
const getEmptyVoiceChannels = async (server) => {
    let channels = await server.channels.fetch();
    const voiceChannels = channels.filter((channel) => channel.type === 2);
    const emptyVoiceChannels = voiceChannels.filter((channel) => channel.members.size == 0);
    return Array.from(emptyVoiceChannels.values());
}

/**
 * Connects the bot to a provided voice channel of a provided server
 * @param channelId | ID of channel to connect to
 * @param server | Guild object 
 * @returns {void}
 */
const connectToVoice = (channelId, server) => {
    joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: server.voiceAdapterCreator,
        selfMute: false,
        selfDeaf: false
    });
}

/**
 * Disconnected the bot from any voice channel
 * if `connection` is undefined, bot is not connected to a channel
 */
const disconnectFromVoice = () => {
    const connection = getVoiceConnection(guildId);
    connection?.destroy();
}

/**
 * Initializes voice channel movement every 3 minutes
 * Bot is disonnected and a new VoiceConnection is created, mimicking movement 
 * @param server | Guild object 
 */
const initMovement = (server) => {
    setInterval(async () => {
        const channels = await getEmptyVoiceChannels(server);
        const randomIndex = Math.floor(Math.random() * channels.length);
        disconnectFromVoice();
        connectToVoice(channels[randomIndex].id, server)
    }, 180000);
}

module.exports = { getVoiceChannels, getEmptyVoiceChannels, connectToVoice, disconnectFromVoice, initMovement }