const { SlashCommandBuilder, Attachment } = require('discord.js');
const { getVoiceChannels } = require('../../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scatter')
        .setDescription('AHHHHHHHHHHHHHHHH'),
    async execute(interaction) {
        const commandUserChannel = interaction.member.voice.channel;
        if (commandUserChannel) {
            interaction.reply('https://giphy.com/gifs/ocean-swimming-jordentually-w9rKL2nQjQtXyvK34G')
            const server = interaction.guild
            const fishUsers = commandUserChannel.members.filter(member => member.roles.cache.filter(role => role.name != 'fisherman'));
            const voiceChannels = await getVoiceChannels(server);
            fishUsers?.forEach(user => {
                const randomIndex = Math.floor(Math.random() * voiceChannels.length);
                user.voice.setChannel(voiceChannels[randomIndex].id)
            })
        } else {
            interaction.reply('Must join a voice channel');
        }
    },
};