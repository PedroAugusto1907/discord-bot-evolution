const { Client } = require('discord.js');

module.exports = {
    name: "nodeCreate",
    once: false,

    /** 
    @param {Client} client
    */

    execute(client, node) {
        console.log(`Node "${node.host}" conectado.`);
    },
};