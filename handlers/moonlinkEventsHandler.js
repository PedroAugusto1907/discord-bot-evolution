const { Client } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')

/** 
@param {Client} client
*/

async function loadMoonlinkEvents(client) {
    const eventsPath = path.join(__dirname, '../events/moonlink');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        client.moon.on(event.name, (...args) => event.execute(client, ...args));
    }
}

module.exports = { loadMoonlinkEvents }