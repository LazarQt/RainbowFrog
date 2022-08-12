const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

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

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);