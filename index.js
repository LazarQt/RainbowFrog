const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const axios = require('axios');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;
    await interaction.deferReply();

    const decklist = interaction.options.getString('decklist').split('1');
    var ignorelands = interaction.options.getString('ignorelands');

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    if (commandName === 'mana') {
        if (ignorelands != null) {
            ignorelands = ignorelands.split('|').map(element => {
                return element.trim();
            });
        }

        const search = decklist.map(element => {
            return element.trim();
        });

        axios
            .post('https://rainbowcalculator.herokuapp.com/api/manabase', {
                Decklist: search,
                Ignorelands: ignorelands
            }, {
                'Content-Type': 'application/json',
            }
            )
            .then(function (response) {

                var res = response.data.data;
                var message = "";

                if(res.error != null && res.error.length > 0) {
                    interaction.editReply(res.error);
                    return;
                }

                if (res.cardsNotFound.length > 0) {
                    message += '\nCouldn\'t find these cards: ' + res.cardsNotFound;
                }

                if (res.excludedCards.length > 0) {
                    message += '\n\nIgnored the following cards due to difficult calculation: ' + res.excludedCards;
                }


                if(res.colorRequirementsErrors.length > 0) {
                    res.colorRequirementsErrors.forEach(element => {
                        message += '\n\n' + element;
                    });
                }

                var subtract = 0;
                if (res.removedLands.length > 0) {
                    message += '\n\nDid NOT take into account these lands: ' + res.removedLands;
                    subtract = res.removedLands.length;
                }

                for (var i = 0; i < res.colorRequirements.length; i++) {
                    var r = res.colorRequirements[i];
                    var x = r.amount - r.amountFulfilled;
                    if (x == 0) continue;
                    if(x > 0) {
                        message += '\n\nStill need ' + x + ' sources of {' + r.color + '}';
                    }
                    if(x < 0) {
                        message += '\n\nToo many (' + Math.abs(x) + ') sources of {' + r.color + '}';
                    }
                    
                }

                var total = res.totalRelevantCards + res.sourcesCount;
                message += '\n\nTotal deck size: ' + total;;
                if (total < 100) message += '\nBy the way, your deck could use some more cards or a higher curve!';
                if (total > 100) message += '\nBy the way, there are too many cards now for the required card count and/or mana curve, try adjusting your deck!';

                message += '\n\nAverage mana value: ' + res.averageManaValue;

                if(res.lands.length > res.manarockRatio.lands) {
                    message += '\n\nToo many lands are required to meet requirements. Please report to developer, guess there needs to be a land priority for extreme cases like this';
                }

                message += '\n\nTotal card count: ' + cardcount;

                message += '\n\nLands('+res.lands.length+'): \n';

                res.lands.forEach(element => {
                    message += '\n' + element;
                });

                interaction.editReply(message);
            })
            .catch(function (error) {
                console.log(error.response);
            });
    }
});

client.login(process.env.TOKEN);