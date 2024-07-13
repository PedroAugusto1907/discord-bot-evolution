
const { MoonlinkManager } = require('moonlink.js')
const { Client } = require('discord.js');
const { lavalinkHostDiscloud, lavalinkIdentifierDiscloud, lavalinkPasswordDiscloud } = require('../config.json')

/**
 * @param {Client} client
 */

async function initMoonlinkManager(client) {
    const nodes = [
        {
            host: lavalinkHostDiscloud,
            identifier: lavalinkIdentifierDiscloud,
            password: lavalinkPasswordDiscloud,
            port: 443,
            secure: true,
            retryAmount: 1000
        }
    ]

    client.moon = new MoonlinkManager(
        nodes,
        {
            /* Options */
        },
        (guild, sPayload) => {
            // Sending payload information to the server
            client.guilds.cache.get(guild).shard.send(JSON.parse(sPayload));
        }
    );
}

module.exports = { initMoonlinkManager }