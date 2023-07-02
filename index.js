const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages} = GatewayIntentBits;
const { User,  Message, GuildMember, ThreadMember} = Partials;

const client = new Client({ 
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User,  Message, GuildMember, ThreadMember]
});

const { loadEvents } = require("./Handlers/eventHandler");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();

loadEvents(client);

// Carga y ejecución del archivo ImportarPartidos.js
const importarPartidosModule = require("./Commands/Utils/importarpartidos.js");
importarPartidosModule.execute();

require('./Handlers/anti-crash')(client);

client.login(client.config.token);
