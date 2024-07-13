const { Client } = require('discord.js');
const { MoonlinkPlayer, MoonlinkTrack } = require('moonlink.js');

module.exports = {
    name: "trackEnd",
    once: false,

    /** 
    @param {Client} client
    @param {MoonlinkPlayer} player
    @param {MoonlinkTrack} track
    */

    async execute(client, player, track) {
        await player.msgCollector.stop();
    },
};
