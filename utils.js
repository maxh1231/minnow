const { guildId } = require('./config.json')
const { joinVoiceChannel } = require('@discordjs/voice');

const getVoiceChannels = async (server) => {
    let channels = await server.channels.fetch();
    const voiceChannels = channels.filter((i) => i.type === 2);
    return voiceChannels;
}

const getEmptyVoiceChannels = async (voiceChannels) => {
    const empty = await voiceChannels.filter((i) => i.members.size == 0);
    return empty;
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

module.exports = { getVoiceChannels, getEmptyVoiceChannels, connectToVoice }