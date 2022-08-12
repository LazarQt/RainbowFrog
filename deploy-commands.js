const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('mana')
        .setDescription('Creates a mana base for your commander deck!')
        .addStringOption(option =>
            option.setName('decklist')
                .setDescription('Your whole deck with cards separated by 1s!')
                .setRequired(true)
        ),
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);