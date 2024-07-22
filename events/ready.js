const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));
const {
    REST
} = require("@discordjs/rest");
const {
    Routes
} = require("discord-api-types/v10");
const {
    PermissionsBitField,
    EmbedBuilder,
    ButtonStyle,
    Client,
    GatewayIntentBits,
    ChannelType,
    Partials,
    ActionRowBuilder,
    SelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    InteractionType,
    SelectMenuInteraction,
    ButtonBuilder
} = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);

/** https://github.com/sshukurzade/advanced-botlist-bot
☆ Star atmayı unutmayın :) !! ☆
*/
const settings = require("../settings.json")
const config = require("../config.json")
const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});

module.exports = async (client) => {

    const rest = new REST({
        version: "10"
    }).setToken(settings.token || process.env.token);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: client.commands,
        }).catch(async hata => {
            console.log(hata)
        })
    } catch (error) {
        console.error(error);
    }
    console.log(`${client.user.tag} Online!`);

    const statusOptions = [

        `💖 https://bit.ly/sennur`,
        `☆ https://github.com/sshukurzade`,
        `Senan Shukurzade`
        /** https://github.com/sshukurzade/advanced-botlist-bot
        ☆ Star atmayı unutmayın :) !! ☆
        */
    ];
    let i = 0;
    setInterval(() => {
        client.user.setActivity(statusOptions[i], {
            type: 4
        });
        i = (i + 1) % statusOptions.length;
    }, 10000);
    /** https://github.com/sshukurzade/advanced-botlist-bot
☆ Star atmayı unutmayın :) !! ☆
*/

    // Scan Errors • Senan Shukurzade
    const errorText = "A fault has been detected in the bot. Use the !scan command for more";
    const guild = client.guilds.cache.get(config.guildID)
    if (!guild) return console.log(errorText);
    const devRole = guild.roles.cache.get(config.devRole);
    if (!devRole) return console.log(errorText);
    const botRole = guild.roles.cache.get(config.botRole);
    if (!botRole) return console.log(errorText);
    const reqRole = guild.roles.cache.get(config.requiredRole);
    if (!reqRole) return console.log(errorText);
    const adminRole = guild.roles.cache.get(config.adminRole);
    if (!adminRole) return console.log(errorText);
    const addBotChannel = guild.channels.cache.get(config.addBotChannel);
    if (!addBotChannel) return console.log(errorText);
    const botLogChannel = guild.channels.cache.get(config.botLogChannel);
    if (!botLogChannel) return console.log(errorText);
    const kickLogChannel = guild.channels.cache.get(config.kickLogChannel);
    if (!kickLogChannel) return console.log(errorText);

    // Scan Errors • Senan Shukurzade

};
