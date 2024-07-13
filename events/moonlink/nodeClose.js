const { Client } = require('discord.js');
const { MoonlinkNode } = require('moonlink.js');

module.exports = {
    name: "nodeClose",
    once: false,

    /** 
    @param {Client} client
    @param {MoonlinkNode} node
    */

    execute(client, node, code, reason) {
        console.log(`[INFO] Conexão com lavalink fechada ${node.host}.`);
        console.log(`Code: ${code} | Reason: ${reason}.`);
    },
};