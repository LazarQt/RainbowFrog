const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const { request } = require('undici');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function getJSONResponse(body) {
    let fullBody = '';

    for await (const data of body) {
        fullBody += data.toString();
    }

    return JSON.parse(fullBody);
}


client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;
    await interaction.deferReply();

    const decklist = interaction.options.getString('decklist').split('1');
    const ignorelands = interaction.options.getString('ignorelands');

    if (commandName === 'mana') {
        const remoteUrl = 'https://rainbowcalculator.herokuapp.com/api/manabase/' + decklist.join('|') + '/' + ignorelands;
        const manabaseRequest = await request(remoteUrl);
        interaction.editReply('sending request to ' + remoteUrl);
        const res = await getJSONResponse(manabaseRequest.body);      
        interaction.editReply('Lands: ' + '\n' + res.lands);
    }
});

client.login(process.env.TOKEN);

