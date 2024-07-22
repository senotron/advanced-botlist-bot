const config = require("../config.json");
const Discord = require("discord.js");

module.exports = {
    name: 'sendembed',
    description: 'Advanced botlist bot • Senan Shukurzade',
    execute(message, args, client) {
        if (!message.member.roles.cache.has(config.adminRole)) return message.reply({
            content: `You are not allowed to use this command.`
        });

        if (config.withButton === true) {
            const addChannel = message.guild.channels.cache.get(config.addBotChannel);
            if (!addChannel) return message.reply("Add bot channel not found");

            const logChannel = message.guild.channels.cache.get(config.botLogChannel);
            if (!logChannel) return message.reply("Bot log channel not found");

            const embedButton = new Discord.EmbedBuilder()
                .setTitle(`${message.guild.name}`)
                .setDescription("Click the button below to add your server!")
                .setFooter({
                    text: `The best botlist bot • @shukurzade`,
                    iconURL: `${message.guild.iconURL({dynamic:true}) || client.user.avatarURL({dynamic:true})}`
                })
                .setThumbnail(`${message.guild.iconURL({dynamic:true}) || client.user.avatarURL({dynamic:true})}`)

            const button = new Discord.ButtonBuilder()
                .setLabel("Add Bot")
                .setStyle(Discord.ButtonStyle.Success)
                .setCustomId("addbot")

            const row = new Discord.ActionRowBuilder()
                .addComponents(button)

            addChannel.send({
                embeds: [embedButton],
                components: [row]
            })

        } else {
            const addChannel = message.guild.channels.cache.get(config.addBotChannel);
            if (!addChannel) return message.reply("Add bot channel not found");

            const logChannel = message.guild.channels.cache.get(config.botLogChannel);
            if (!logChannel) return message.reply("Bot log channel not found");

            const embedPrefix = new Discord.EmbedBuilder()
                .setTitle(`${message.guild.name}`)
                .setDescription("To add your bot;\n`!addbot <botID> <prefix>`")
                .setFooter({
                    text: `The best botlist bot • @shukurzade`,
                    iconURL: `${message.guild.iconURL({dynamic:true}) || client.user.avatarURL({dynamic:true})}`
                })
                .setThumbnail(`${message.guild.iconURL({dynamic:true}) || client.user.avatarURL({dynamic:true})}`)

            addChannel.send({
                embeds: [embedPrefix]
            })

        }



    }
};
