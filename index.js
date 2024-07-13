const { TOKEN } = require('./config.json');
const { Client, GatewayIntentBits } = require('discord.js');
const { initMoonlinkManager } = require('./moonlink/initMoonlinkManager');
const { loadCommands } = require('./handlers/commandsHandler');
const { loadClientEvents } = require('./handlers/clientEventsHandler');
const { loadMoonlinkEvents } = require('./handlers/moonlinkEventsHandler');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

initMoonlinkManager(client);
loadCommands(client);
loadMoonlinkEvents(client);
loadClientEvents(client);

client.login(TOKEN);

["unhandledRejection", "uncaughtException", "uncaughtExceptionMonitor"].forEach((event) => {
    process.on(event, (error) => {
        console.error(`[INFO] Erro não tratado no evento ${event}:`, error);
    });
});