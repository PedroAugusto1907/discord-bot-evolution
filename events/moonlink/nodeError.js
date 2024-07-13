const { Client } = require('discord.js');
const { MoonlinkNode } = require('moonlink.js');

module.exports = {
    name: "nodeError",
    once: false,

    /** 
    @param {Client} client
    @param {MoonlinkNode} node
    */

    execute(client, node) {
        console.log(`[INFO] Erro ao conectar ao node "${node.host}".`);
    },
};