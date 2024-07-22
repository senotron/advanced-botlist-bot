const Discord = require("discord.js");
const config = require("../config.json");
const db = require("croxydb");
module.exports = {
    name: "addbot",
    aliases: ["botekle"],
    description: "Advanced botlist bot • Senan Shukurzade",
    async execute(message, args, client) {
        // Senan Shukurzade • Warnings
        if (config.withButton === true) return message.delete();
        if (message.channel.id !== config.addBotChannel) return message.delete();

        if (config.botlistStatus === false) {
            return message
                .reply("Botlist system is closed. You cannot add bots")
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000);

                    message.delete();
                })
                .catch(console.error);
        }

        const memberBots = db.get(`memberBots_${message.author.id}`) || [];
        if (config.botlimit === memberBots.length) {
            return message
                .reply(
                    `You have reached the bot adding limit.(**Limit: ${config.botlimit}**)`,
                )
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000);
                    message.delete();
                });
        }

        if (args.length < 2) {
            return message
                .reply("Please provide a valid bot ID and prefix.")
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000);

                    message.delete();
                })
                .catch(console.error);
        }

        const user = message.guild.members.cache.get(message.author.id);
        const role = message.guild.roles.cache.get(config.requiredRole);
        if (!user.roles.cache.has(config.requiredRole)) {
            return message
                .reply(`You must have the **${role.name}** role to add bots.`)
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000);
                    message.delete();
                });
        }

        const botId = args[0];
        const prefix = args[1];
        if (isNaN(botId)) {
            return message
                .reply("Please provide a valid bot ID.")
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000);
                    message.delete();
                })
                .catch(console.error);
        }
        const checkBot = await client.users.fetch(botId);
        if (!checkBot) {
            return message
                .reply("Please provide a valid bot ID.")
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000);
                    message.delete();
                })
                .catch(console.error);
        }
        const checkServer = message.guild.members.cache.get(botId);
        if (checkServer) {
            return message
                .reply("The bot you are trying to add is on the server.")
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000);
                    message.delete();
                })
                .catch(console.error);
        };

        const checkBott = db.get(`bots`) || [];
        if (checkBott.includes(botId)) {
            return message
                .reply("The bot you are trying to add is on the botlist system.")
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000);
                    message.delete();
                })
                .catch(console.error);
        }
        if (prefix.lenght > 4) {
            return message
                .reply("Prefix must not be more than 4 characters")
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000);
                    message.delete();
                })
                .catch(console.error);
        }

        const waitingDB = db.get(`waiting`) || [];
        if (waitingDB && waitingDB.includes(botId)) {
            return message
                .reply(
                    `Your bot is waiting in line. Please wait patiently. Number of waiting bot(s): **${waitingDB.length}**`,
                )
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000);
                    message.delete();
                })
                .catch(console.error);
        }
        // Senan Shukurzade • Warnings

        const bot = await client.users.fetch(botId);
        const logChannel = client.channels.cache.get(config.botLogChannel);
        const botOwner = await client.users.fetch(message.author.id);
        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `Bot added • ${bot.username}`,
                iconURL: `${bot.avatarURL({ dynamic: true })}`,
            })
            .setThumbnail(`${bot.avatarURL({ dynamic: true })}`)
            .setFooter({
                text: "The moment you add the bot to the server it will be automatically approved.",
                iconURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROPaKM6L5_HxUYHe4CQI1aZEQ5tDArhHoZEw&s",
            })
            .addFields({
                name: "• Bot Name",
                value: `↪ ${bot.username}`,
                inline: true
            }, {
                name: "• Bot ID",
                value: `↪ ${bot.id}`,
                inline: true
            }, {
                name: "• Added by",
                value: `↪ ${botOwner.username}`,
                inline: true
            }, {
                name: "• Prefix ",
                value: `↪ ${prefix}`,
                inline: true
            }, {
                name: "• Guild Count",
                value: `↪ ${client.guilds.cache.size}`,
                inline: true,
            }, );

        const buttonUrl = new Discord.ButtonBuilder()
            .setLabel("Add Bot")
            .setURL(
                `https://discord.com/oauth2/authorize?scope=bot&permissions=0&client_id=${bot.id}&guild_id=${message.guild.id}`,
            )
            .setStyle(Discord.ButtonStyle.Link);

        const buttonApprove = new Discord.ButtonBuilder()
            .setCustomId(`approve_${botId}`)
            .setLabel(`Approve`)
            .setStyle(Discord.ButtonStyle.Success)
            .setEmoji("✔");

        const buttonReject = new Discord.ButtonBuilder()
            .setCustomId(`reject_${botId}`)
            .setLabel(`Reject`)
            .setStyle(Discord.ButtonStyle.Danger)
            .setEmoji("✖");

        const row = new Discord.ActionRowBuilder().addComponents(
            buttonUrl,
            buttonApprove,
            buttonReject,
        );

        logChannel
            .send({
                content: `<@&${config.adminRole}>`,
                embeds: [embed],
                components: [row],
            })
            .then(async (msg) => {
                waitingDB.push(botId);
                db.set(`waiting`, waitingDB);
                db.set(`tempinfo_${botId}`, {
                    msgID: msg.id,
                    owner: message.author.id,
                    prefix: prefix,
                });
            });
        message.delete();
    },
};

// Senan Shukurzade
