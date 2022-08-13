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
    var ignorelands = interaction.options.getString('ignorelands');

    if (commandName === 'mana') {
        if (ignorelands == null) {
            ignorelands = 'La La Land';
        }

        const remoteUrl = 'https://rainbowcalculator.herokuapp.com/api/manabase/' + decklist.join('|') + '/' + ignorelands;
        const manabaseRequest = await request(remoteUrl);
        interaction.editReply('sending request to ' + remoteUrl);
        const res = await getJSONResponse(manabaseRequest.body);

        var message = "";

        if (res.cardsNotFound.length > 0) {
            message += '\nI couldn\'t find these cards: ' + res.cardsNotFound;
        }

        if (res.excludedCards.length > 0) {
            message += '\nIgnored the following cards due to difficult calculation: ' + res.excludedCards;
        }

        var subtract = 0;
        if (res.removedLands.length > 0) {
            message += '\nDid NOT take into account these lands: ' + res.removedLands;
            subtract = res.removedLands.length;
        }

        for (var i = 0; i < res.colorRequirements.length; i++) {
            var r = res.colorRequirements[i];
            if (r.amount == 0) continue;
            message += '\nNeed ' + r.amount + ' sources of {' + r.color + '}';
        }

        var cardcount = decklist.length - subtract;
        var sources = res.lands.length;
        var total = cardcount + sources;
        if (total < 100) message += '\nBy the way, your deck could use some more cards or a higher curve!';
        if (sources > total) message += '\nBy the way, there are too many cards now for the required card count and/or mana curve, try adjusting your deck!';

        message += '\nTotal card count: ' + total;

        message += '\n Lands: \n';

        res.lands.forEach(element => {
            message += '\n' + element;
        });

        interaction.editReply(message);
    }
});

client.login(process.env.TOKEN);

