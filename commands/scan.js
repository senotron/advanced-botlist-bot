const config = require("../config.json");
const Discord = require("discord.js");

module.exports = {
    name: 'scan',
    description: 'Advanced botlist bot • Senan Shukurzade',
    execute(message, args, client) {

        if (!message.member.roles.cache.has(config.adminRole) || !message.member.permissions.has("Administrator")) return message.reply({
            content: `You are not allowed to use this command.`
        });
        if (message.guild.id !== config.guildID) return message.reply({
            content: `You can only use this bot on the server specified in the config.json file.`
        });
        let dev;
        let bot;
        let add;
        let bott;
        let req;
        let kick;
        let admin;
        const guild = client.guilds.cache.get(config.guildID);
        const devRole = message.guild.roles.cache.get(config.devRole);
        const botRole = message.guild.roles.cache.get(config.botRole);
        const addBotChannel = message.guild.channels.cache.get(config.addBotChannel);
        const botLogChannel = message.guild.channels.cache.get(config.botLogChannel);
        const reqRole = message.guild.roles.cache.get(config.requiredRole);
        const adminRole = message.guild.roles.cache.get(config.adminRole);
        const kicklog = message.guild.channels.cache.get(config.kickLogChannel);

        if (!devRole) {
            dev = "Not found"
        } else {
            dev = `<@&${devRole.id}>`
        }
        if (!botRole) {
            bot = "Not found"
        } else {
            bot = `<@&${botRole.id}>`
        }
        if (!addBotChannel) {
            add = "Not found"
        } else {
            add = `<#${addBotChannel.id}>`
        }
        if (!botLogChannel) {
            bott = "Not found"
        } else {
            bott = `<#${botLogChannel.id}>`
        }
        if (!reqRole) {
            req = "Not found"
        } else {
            req = `<@&${reqRole.id}>`
        }
        if (!adminRole) {
            admin = "Not found"
        } else {
            admin = `<@&${adminRole.id}>`
        }
        if (!kicklog) {
            kick = "Not found"
        } else {
            kick = `<#${kicklog.id}>`
        }
        message.reply({
            content: `Scanning...`
        }).then(msg => {
            setTimeout(() => {
                const embed = new Discord.EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('Scan Results')
                    .addFields({
                        name: "Admin Role",
                        value: admin,
                        inline: true
                    }, {
                        name: 'Developer Role',
                        value: dev,
                        inline: true
                    }, {
                        name: 'Bot Role',
                        value: bot,
                        inline: true
                    }, {
                        name: 'Add Bot Channel',
                        value: add,
                        inline: true
                    }, {
                        name: 'Bot Log Channel',
                        value: bott,
                        inline: true
                    }, {
                        name: 'Required Role',
                        value: req,
                        inline: true
                    }, {
                        name: 'Kick Log Channel',
                        value: kick,
                        inline: true
                    }, );
                msg.edit({
                    content: `Scan completed`,
                    embeds: [embed]
                });
            }, 5000);
        });


    }
};
