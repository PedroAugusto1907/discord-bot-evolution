const { Client } = require('discord.js');
const { MoonlinkPlayer } = require('moonlink.js');

module.exports = {
    name: "playerDisconnect",
    once: false,

    /** 
    @param {Client} client
    @param {MoonlinkPlayer} player
    @param {MoonlinkTrack} track
    */

    async execute(client, player) {
        await player.destroy()
    },
};
