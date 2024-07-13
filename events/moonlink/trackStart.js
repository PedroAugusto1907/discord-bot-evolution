const { Client, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { MoonlinkPlayer, MoonlinkTrack } = require('moonlink.js');

module.exports = {
    name: "trackStart",
    once: false,

    /** 
    @param {Client} client
    @param {MoonlinkPlayer} player
    @param {MoonlinkTrack} track
    */

    async execute(client, player, track) {
        if (player.loop === 1) {
            return;
        }

        const embed = createEmbed(client, track)

        const skip = new ButtonBuilder()
            .setEmoji('⏭️')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('bt-skip');

        const pausePlay = new ButtonBuilder()
            .setEmoji('⏯️')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('bt-pausePlay');

        const shuffle = new ButtonBuilder()
            .setEmoji('🔀')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('bt-shuffle');

        const loop = new ButtonBuilder()
            .setEmoji('🔁')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('bt-loop');

        const stop = new ButtonBuilder()
            .setEmoji('⏹️')
            .setStyle(ButtonStyle.Danger)
            .setCustomId('bt-stop');

        const row = new ActionRowBuilder().addComponents(skip, pausePlay, shuffle, loop, stop);

        const msg = await client.channels.cache.get(player.textChannel).send({ embeds: [embed], components: [row] });

        const filter = (i) => {
            if (player.voiceChannel === i.member.voice.channelId) {
                return true;
            }
            else {
                i.reply({ content: 'https://media1.tenor.com/m/gkZiCIqm8TQAAAAd/clown-sad.gif', ephemeral: true });
                return false;
            };
        };

        const collector = msg.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
        });

        player.msgCollector = collector;

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'bt-skip') {
                if (player.queue.size === 0) {
                    await collector.stop();
                    await player.stop();
                    player.disconnect();
                } else {
                    await collector.stop();
                    player.setLoop(0);
                    await player.skip();
                }

                await interaction.deferUpdate();
            }

            if (interaction.customId === 'bt-pausePlay') {
                if (player.playing) {
                    await player.pause();
                    pausePlay.setStyle(ButtonStyle.Success);
                    await msg.edit({ components: [row] });
                }
                else if (player.paused) {
                    await player.resume();
                    pausePlay.setStyle(ButtonStyle.Primary);
                    await msg.edit({ components: [row] });
                }

                await interaction.deferUpdate();
            }

            if (interaction.customId === 'bt-shuffle') {
                if (player.queue.size > 0) {
                    player.shuffle();
                }

                await interaction.deferUpdate();
            }

            if (interaction.customId === 'bt-loop') {
                if (player.loop === 0) {
                    player.setLoop(1);
                    loop.setStyle(ButtonStyle.Success);
                    await msg.edit({ components: [row] });
                }
                else if (player.loop === 1) {
                    player.setLoop(0);
                    loop.setStyle(ButtonStyle.Primary);
                    await msg.edit({ components: [row] });
                }

                await interaction.deferUpdate();
            }

            if (interaction.customId === 'bt-stop') {
                await collector.stop();
                await player.stop();
                player.disconnect();

                await interaction.deferUpdate();
            }
        });

        collector.on('end', async () => {
            await msg.edit({ components: [] })
        });
    },
};

function createEmbed(client, track) {
    const embedMsg = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Tocando agora: ")
        .setDescription(`[${track.title} | ${track.duration > Number.MAX_SAFE_INTEGER ? '∞' : formatMilliseconds(track.duration)}](${track.url})`)
        .setThumbnail(track.artworkUrl)
        .addFields(
            { name: "Pedido por:", value: `${client.users.cache.get(track.requester)}` }
        );

    return embedMsg;
}

function formatMilliseconds(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours > 0 ? `${hours}h` : '';
    const formattedMinutes = minutes > 0 || hours > 0 ? `${minutes}m` : '';
    const formattedSeconds = seconds > 0 || (hours === 0 && minutes === 0) ? `${seconds}s` : '';

    const formattedTime = `${formattedHours} ${formattedMinutes} ${formattedSeconds}`;

    return formattedTime.trim();
}