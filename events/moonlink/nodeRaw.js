const { Client } = require('discord.js');
const { MoonlinkNode } = require('moonlink.js');

module.exports = {
    name: "nodeRaw",
    once: false,

    /** 
    @param {Client} client
    @param {MoonlinkNode} node
    */

    execute(client, node, payload) {
        //console.log(`[INFO] ${JSON.stringify(payload)}.`);
    },
};