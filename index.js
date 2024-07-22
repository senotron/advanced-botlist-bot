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
    ButtonBuilder,
    Collection
} = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js");
const settings = require("./settings.json");
const config = require("./config.json");
const axios = require("axios");
const db = require("croxydb");
const sennur = require("sennur");
const client = new Client({
    intents: 3276543,
    allowedMentions: {
        parse: ["users"],
    },
    partials: PARTIALS,
    retryLimit: 3,
});

const dotenv = require("dotenv");
dotenv.config({
    path: "./.env"
});




client.commands = new Collection();


const {
    readdirSync
} = require("fs");

readdirSync("./events").forEach((e) => {
    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args);
    });

});
/** https://github.com/sshukurzade/advanced-botlist-bot
☆ Star atmayı unutmayın :) !! ☆
*/
const token = settings.token || process.env.token
client.login(token).catch((error) => {
    console.log("Could not connect to token");
});



const prefix = settings.prefix;

client.on('messageCreate', (message) => {
    // Senan Shukurzade
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Senan Shukurzade
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Senan Shukurzade
    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('An error occurred while running the command.Please try again later.');
    }
});


const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


/** https://github.com/sshukurzade/advanced-botlist-bot
☆ Star atmayı unutmayın :) !! ☆
*/
client.on("guildMemberAdd", async member => {
    const waitingDB = db.get(`waiting`) || [];
    if (member.guild.id !== config.guildID) return;
    if (!waitingDB.includes(member.id)) return;
    const tempinfo = db.get(`tempinfo_${member.user.id}`);
    const logChannel = client.channels.cache.get(config.botLogChannel);
    const guild = client.guilds.cache.get(config.guildID);
    const botRole = guild.roles.cache.get(config.botRole);
    const devRole = guild.roles.cache.get(config.devRole);
    const message = logChannel.messages.cache.get(tempinfo.msgID);
    const checkOwner = member.guild.members.cache.get(tempinfo.owner);
    const bot = member.user
    // Senan Shukurzade • Check owner
    if (!checkOwner) {
        member.kick("The owner of the bot left the server");

        const indexx = waitingDB.indexOf(bot.id);
        if (indexx > -1) {
            waitingDB.splice(indexx, 1);
        }
        db.set(`waiting`, waitingDB);
        db.delete(`tempinfo_${bot.id}`);
        message.delete();
        return;
    }
    // Senan Shukurzade • Check owner

    const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name: `Bot Approved • ${bot.username}`,
            iconURL: `${bot.avatarURL({dynamic:true})}`
        })
        .setThumbnail(`${bot.avatarURL({dynamic:true})}`)
        .setFooter({
            text: "© shukurzade"
        })
        .addFields({
            name: "• Bot",
            value: `↪ <@${bot.id}>`,
            inline: true
        }, {
            name: "• Bot ID",
            value: `↪ ${bot.id}`,
            inline: true
        }, {
            name: "• Approved by ",
            value: `↪ adding to the server`,
            inline: true
        }, )
        .setColor(0x00ff00)
    checkOwner.roles.add(devRole);
    member.roles.add(botRole)
    member.setNickname(`${bot.username} (${tempinfo.prefix})`)

    message.delete();
    logChannel.send({
        content: `<@${tempinfo.owner}>`,
        embeds: [embed]
    })
    // Senan Shukurzade Database
    const memberDB = db.get(`memberBots_${tempinfo.owner}`) || [];
    const bots = db.get(`bots`) || [];
    db.set(
        `botInfo_${bot.id}`, {
            owner: tempinfo.owner,
            prefix: tempinfo.prefix
        });
    memberDB.push(bot.id);
    bots.push(bot.id);
    db.set('bots', bots);

    const index = waitingDB.indexOf(bot.id);
    if (index > -1) {
        waitingDB.splice(index, 1);
    }
    db.set(`waiting`, waitingDB);

    db.set(`memberBots_${tempinfo.owner}`, memberDB);
    db.delete(`tempinfo_${bot.id}`)
});

// Senan Shukurzade
/** https://github.com/sshukurzade/advanced-botlist-bot
☆ Star atmayı unutmayın :) !! ☆
*/
client.on('interactionCreate', async interaction => {

    if (interaction.isButton()) {

        if (interaction.customId.startsWith("approve")) {

            const botId = interaction.customId.split("_")[1];

            if (!interaction.member.roles.cache.has(config.adminRole)) return interaction.reply({
                content: `You are not allowed to use this button`,
                ephemeral: true
            });

            const waitingDB = db.get(`waiting`) || [];
            if (interaction.guild.id !== config.guildID) return;
            if (!waitingDB.includes(botId)) return;
            const tempinfo = db.get(`tempinfo_${botId}`);
            const logChannel = client.channels.cache.get(config.botLogChannel);
            const guild = client.guilds.cache.get(config.guildID);
            const botRole = guild.roles.cache.get(config.botRole);
            const devRole = guild.roles.cache.get(config.devRole);
            const message = logChannel.messages.cache.get(tempinfo.msgID);
            const checkOwner = interaction.guild.members.cache.get(tempinfo.owner);

            //Senan Shukurzade • Check owner
            if (!checkOwner) {
                db.delete(`tempinfo_${bot.id}`);
            }
            if (!checkOwner) {
                const indexx = waitingDB.indexOf(bot.id);
                if (indexx > -1) {
                    waitingDB.splice(indexx, 1);

                    return;
                }
                db.set(`waiting`, waitingDB);
                message.delete();
            }
            //Senan Shukurzade • Check owner

            const bot = await client.users.fetch(botId)
            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: `Bot Approved • ${bot.username}`,
                    iconURL: `${bot.avatarURL({dynamic:true})}`
                })
                .setThumbnail(`${bot.avatarURL({dynamic:true})}`)
                .setFooter({
                    text: "© shukurzade"
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
                    name: "• Approved by ",
                    value: `↪ ${interaction.user.username}`,
                    inline: true
                }, )
                .setFooter({
                    text: "The bot was approved without being added to the server",
                    iconURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROPaKM6L5_HxUYHe4CQI1aZEQ5tDArhHoZEw&s",
                })
                .setColor(0x00ff00)

            message.delete();
            checkOwner.roles.add(devRole)
            logChannel.send({
                content: `<@${tempinfo.owner}>`,
                embeds: [embed]
            })
            // Senan Shukurzade Database
            const memberDB = db.get(`memberBots_${tempinfo.owner}`) || [];
            const bots = db.get(`bots`) || [];
            db.set(
                `botInfo_${botId}`, {
                    owner: tempinfo.owner,
                    prefix: tempinfo.prefix
                });
            memberDB.push(botId);
            bots.push(botId);
            db.set('bots', bots);
            const index = waitingDB.indexOf(botId);
            if (index > -1) {
                waitingDB.splice(index, 1);
            }
            db.set(`waiting`, waitingDB);

            db.set(`memberBots_${tempinfo.owner}`, memberDB);
            db.delete(`tempinfo_${botId}`)




        }
    }
});
/** https://github.com/sshukurzade/advanced-botlist-bot
☆ Star atmayı unutmayın :) !! ☆
*/


client.on('interactionCreate', async interaction => {

    if (interaction.isButton()) {

        if (interaction.customId.startsWith("reject")) {

            let botId = interaction.customId.split("_")[1];
            if (!interaction.member.roles.cache.has(config.adminRole)) return interaction.reply({
                content: `You are not allowed to use this button`,
                ephemeral: true
            });
            const waitingDB = db.get(`waiting`) || [];
            if (interaction.guild.id !== config.guildID) return;
            if (!waitingDB.includes(botId)) return;
            const tempinfo = db.get(`tempinfo_${botId}`);
            const logChannel = client.channels.cache.get(config.botLogChannel);
            const guild = client.guilds.cache.get(config.guildID);
            const message = logChannel.messages.cache.get(tempinfo.msgID);
            const checkOwner = interaction.guild.members.cache.get(tempinfo.owner);

            //Senan Shukurzade • Check owner
            if (!checkOwner) {
                db.delete(`tempinfo_${bot.id}`);
            }
            if (!checkOwner) {
                const indexx = waitingDB.indexOf(bot.id);
                if (indexx > -1) {
                    waitingDB.splice(indexx, 1);

                    return;
                }
                db.set(`waiting`, waitingDB);
                message.delete();
            }
            //Senan Shukurzade • Check owner

            const bot = await client.users.fetch(botId)
            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: `Bot Rejected • ${bot.username}`,
                    iconURL: `${bot.avatarURL({dynamic:true})}`
                })
                .setThumbnail(`${bot.avatarURL({dynamic:true})}`)
                .setFooter({
                    text: "© shukurzade"
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
                    name: "• Rejected by ",
                    value: `↪ ${interaction.user.username}`,
                    inline: true
                }, )
                .setFooter({
                    text: "[BETA] Reason is coming soon",
                    iconURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROPaKM6L5_HxUYHe4CQI1aZEQ5tDArhHoZEw&s",
                })
                .setColor(0xff0000)
            message.delete();
            logChannel.send({
                content: `<@${tempinfo.owner}>`,
                embeds: [embed]
            })
            // Senan Shukurzade Database


            const index = waitingDB.indexOf(botId);
            if (index > -1) {
                waitingDB.splice(index, 1);
            }
            db.set(`waiting`, waitingDB);


            db.delete(`tempinfo_${botId}`)




        }
    }
});
/** https://github.com/sshukurzade/advanced-botlist-bot
☆ Star atmayı unutmayın :) !! ☆
*/


client.on('guildMemberRemove', async member => {
    if (member.guild.id !== config.guildID) return;
    const botIds = db.get(`memberBots_${member.user.id}`);
    console.log(botIds)
    if (!botIds) return;
    if (botIds.length === 0) return;
    const logChannel = client.channels.cache.get(config.botLogChannel);
    const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name: `Kicked bots of ${member.user.username}`
        })
        .setDescription(`Because **${member.user.username}** left the server, **${botIds.length}** bot(s) of this user were kicked out of the server`)
        .setFooter({
            text: `${member.guild.name} • @shukurzade`,
            iconURL: `${member.guild.iconURL({dynamic:true}) || client.user.avatarURL({dynamic:true})}`
        })
        .setColor(0xff0000)

    logChannel.send({
        embeds: [embed]
    });


    botIds.forEach(async botId => {
        const server = client.guilds.cache.get(config.guildID)
        const user = await server.members.fetch(botId).catch(err => {})

        if (user) {
            user.kick('The member who added the bot left the server').catch(error => {
                console.log(error)
            });
            //Senan Shukurzade DB DELETE 
            const index = botIds.indexOf(botId);
            if (index > -1) {
                botIds.splice(index, 1);
            }
            db.set(`memberBots_${member.user.id}`, botIds)

            const bots = db.get(`bots`);
            const indexx = bots.indexOf(botId);
            if (indexx > -1) {
                bots.splice(indexx, 1);

            }
            db.set(`bots`, bots);
            db.delete(`botInfo_${botId}`)


        }
    });




});
/** https://github.com/sshukurzade/advanced-botlist-bot
☆ Star atmayı unutmayın :) !! ☆
*/

client.on('guildMemberRemove', async member => {
    if (member.guild.id !== config.guildID) return;
    const bots = db.get(`bots`) || [];
    if (!bots) return;
    if (!bots.includes(member.user.id)) return;
    const botInfo = db.get(`botInfo_${member.user.id}`);
    const ownerId = botInfo.owner;

    const indexx = bots.indexOf(member.user.id);
    if (indexx > -1) {
        bots.splice(indexx, 1);
    }
    db.set(`bots`, bots);

    db.delete(`botInfo_${member.user.id}`);

    const botIds = db.get(`memberBots_${ownerId}`)
    const index = botIds.indexOf(member.user.id);
    if (index > -1) {
        botIds.splice(index, 1);
    }
    db.set(`memberBots_${member.user.id}`, botIds)


});

client.on('interactionCreate', async interaction => {

    const modal = new Discord.ModalBuilder()
        .setCustomId('addForm')
        .setTitle(`Add Bot`)

    const bot = new Discord.TextInputBuilder()
        .setCustomId('bot')
        .setLabel(`Bot ID`)
        .setStyle(Discord.TextInputStyle.Short)
        .setMaxLength(25)

        .setMinLength(10)
        .setPlaceholder(`ID of your bot`)
        .setRequired(true);

    const prefixx = new Discord.TextInputBuilder()
        .setCustomId('prefix')
        .setLabel(`Bot Prefix`)
        .setStyle(Discord.TextInputStyle.Short)
        .setMaxLength(4)

        .setMinLength(1)
        .setPlaceholder(`Prefix of your bot`)
        .setRequired(true)
    const row = new Discord.ActionRowBuilder().addComponents(bot);
    const row1 = new Discord.ActionRowBuilder().addComponents(prefixx);
    modal.addComponents(row, row1);

    if (interaction.customId === "addbot") {

        const memberBots = db.get(`memberBots_${interaction.user.id}`) || [];

        if (config.botlistStatus === false) return interaction.reply({
            content: "Botlist system is closed. You cannot add bots",
            ephemeral: true
        });

        if (config.withButton === false) return interaction.reply({
            content: `Bots are not added via button`,
            ephemeral: true
        });

        if (config.botlimit === memberBots.length) return interaction.reply({
            content: `You have reached the bot adding limit.(**Limit: ${config.botlimit}**`,
            ephemeral: true
        });

        if (!interaction.member.roles.cache.has(config.requiredRole)) return interaction.reply({
            content: `You must have the **<@&${config.requiredRole}>** role to add bots.`,
            ephemeral: true
        });


        await interaction.showModal(modal);
    }
});

client.on('interactionCreate', async interaction => {

    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'addForm') {
        const botId = interaction.fields.getTextInputValue("bot");
        const prefix = interaction.fields.getTextInputValue("prefix")

        //Senan Shukurzade • Warnings
        const checkMember = interaction.guild.members.cache.get(botId)
        const checkUser = await client.users.fetch(botId).catch(err => {
            return interaction.reply({
                content: "Please provide a valid bot ID.",
                ephemeral: true
            })
        });

        if (!checkUser) return interaction.reply({
            content: "Please provide a valid bot ID.",
            ephemeral: true
        });

        if (!checkUser.bot) return interaction.reply({
            content: "Please provide a valid bot ID.",
            ephemeral: true
        });

        if (checkMember) return interaction.reply({
            content: "The bot you are trying to add is on the server.",
            ephemeral: true
        });

        const checkBott = db.get(`bots`) || [];
        if (checkBott.includes(botId)) return interaction.reply({
            content: "The bot you are trying to add is on the botlist system.",
            ephemeral: true
        });

        const waitingDB = db.get(`waiting`) || [];
        if (waitingDB && waitingDB.includes(botId)) return interaction.reply({
            content: `Your bot is waiting in line. Please wait patiently. Number of waiting bot(s): **${waitingDB.length}**`,
            ephemeral: true
        });
        // Senan Shukurzade • Warnings

        const bot = await client.users.fetch(botId);
        const logChannel = client.channels.cache.get(config.botLogChannel);
        const botOwner = await client.users.fetch(interaction.user.id);
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
                `https://discord.com/oauth2/authorize?scope=bot&permissions=0&client_id=${bot.id}&guild_id=${interaction.guild.id}`,
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

        interaction.reply({
            content: "Your bot has been added to the queue",
            ephemeral: true
        })
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
                    owner: interaction.user.id,
                    prefix: prefix,
                });
            });


        // Senan Shukurzade



    }
});

/** https://github.com/sshukurzade/advanced-botlist-bot
☆ Star atmayı unutmayın :) !! ☆
*/


function checkBots() {
    const guild = client.guilds.cache.get(config.guildID);
    const bots = guild.members.cache.filter(member => member.user.bot);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    bots.forEach(bot => {
        // Database
        const botInfo = db.get(`botInfo_${bot.id}`);
        const indexx = bots.indexOf(member.user.id);
        if (indexx > -1) {
            bots.splice(indexx, 1);
        }
        db.set(`bots`, bots);

        db.delete(`botInfo_${member.user.id}`);

        const botIds = db.get(`memberBots_${ownerId}`)
        const index = botIds.indexOf(member.user.id);
        if (index > -1) {
            botIds.splice(index, 1);
        }
        db.set(`memberBots_${member.user.id}`, botIds)
        // Database
        const botRoles = bot.roles.cache;
        if (botRoles.has(config.botRole) && bot.joinedAt <= thirtyDaysAgo) {
            bot.kick('Bot was kicked because 30 days were complete.');
            const botname = bot.user.username

            const kickedLog = client.channels.cache.get(kickLogChannel);
            const embed = new Discord.EmbedBuilder()
                .setTitle("Bot kicked")
                .setDescription(`<@!${bot.id}>(${botname}) has been automatically kicked off the server. `)
                .setFooter({
                    text: "SENNUR • All bots are kicked off the server after 30 days"
                })

            const content = `<@${botInfo.owner}>`

            kickedLog.send({
                content: `${content}`,
                embeds: [embed]
            })
        }
    });
}


//Senan Shukurzade 
client.on('ready', () => {
    setInterval(checkBots, 3600000)
});
