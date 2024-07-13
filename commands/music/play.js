const { SlashCommandBuilder } = require('@discordjs/builders')
const { CommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Tocar música / playlist')
        .addStringOption(option => {
            return option.setName('musica')
                .setDescription('Link / Nome da música')
                .setRequired(true)
        })
    ,
    /** 
    @param {CommandInteraction} interaction
    */

    async execute(interaction, client) {
        const { options, member, guild } = interaction;
        const canalVoz = member.voice.channel;

        if (!canalVoz)
            return interaction.reply({ content: 'Você não está em um canal de voz', ephemeral: true });

        if (guild.members.me.voice.channelId && (canalVoz.id !== guild.members.me.voice.channelId))
            return interaction.reply({ content: 'Já estou sendo usado em outro canal', ephemeral: true });

        try {
            await interaction.reply({ content: 'Pesquisando...', ephemeral: true });

            const query = options.get('musica').value;

            let res = await client.moon.search({
                query,
                source: "youtube",
                requester: interaction.user.id
            });

            if (res.loadType === 'loadfailed') {
                return interaction.editReply({ content: 'Erro durante a busca', ephemeral: true });
            } else if (res.loadType === 'empty') {
                return interaction.editReply({ content: 'Nenhuma música encontrada', ephemeral: true });
            } else if (res.loadType === 'error') {
                return interaction.editReply({ content: 'ERRO: Música não está disponível (deve possuir algum tipo de restrição)', ephemeral: true });
            }

            let player = client.moon.players.create({
                guildId: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
            });

            if (!player.connected) {
                player.connect({
                    setDeaf: true,
                    setMute: false
                });
            }

            if (res.loadType === 'playlist') {
                for (var track of res.tracks) {
                    player.queue.add(track);
                }

                interaction.editReply({ content: `Playlist adicionada com ${res.tracks.length + 1} músicas`, ephemeral: true });
            } else {
                player.queue.add(res.tracks[0]);

                interaction.editReply({ content: `Música ${res.tracks[0].title} adicionada`, ephemeral: true });
            }

            if (!player.playing && !player.paused) {
                player.play();
            }

            setTimeout(function () {
                interaction.deleteReply()
            }, 5000);

        } catch (e) {
            console.log(e)
            const errorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('Erro ao executar comando');

            return interaction.editReply({ content: '', embeds: [errorEmbed], ephemeral: true });
        }
    }
}