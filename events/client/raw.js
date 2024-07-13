const { Client, Events } = require('discord.js');

module.exports = {
    name: Events.Raw,

    /** 
    @param {Client} client
    */

    execute(client, data) {
        client.moon.packetUpdate(data);
    },
};