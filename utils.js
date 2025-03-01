// @ts-nocheck
const { guildId } = require('./config.json')
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const getEmptyVoiceChannels = async (server) => {
    let channels = await server.channels.fetch();
    const voiceChannels = channels.filter((channel) => channel.type === 2);
    const emptyVoiceChannels = voiceChannels.filter((channel) => channel.members.size == 0)
    return Array.from(emptyVoiceChannels.values());
}

const connectToVoice = (channelId, server) => {
    const connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: server.voiceAdapterCreator,
        selfMute: false,
        selfDeaf: false
    });
}

const disconnectFromVoice = () => {
    const connection = getVoiceConnection(guildId);
    connection.destroy();
}

module.exports = { getEmptyVoiceChannels, connectToVoice, disconnectFromVoice }