# RainbowFrog Discord Bot 🌈🐸

Discord bot to help you generate solid mana base for your EDH deck (or any other 100 card deck with EDH legal cards).

## Bot testing

If you want to try it out join my discord server by using https://discord.gg/uKrM6g2kj9. 
The bot is not public (yet) and can only be used there. 

Right now all the basic functionalities are implemented, feedback is appreciated.

## Command

To use the bot, simply type /mana to bring up the bot and add the entire deck list separated by 1s.

*1s because all the major deck sites export the deck by putting a 1 in front of the card name*

There is an option to ignore lands, in case someone doesn't want to play EDH with their expensive dual lands or similar. In that case simply add a list of lands in addition to the deck list, separated by |s.

*The character | is used because there are a lot of lands with special characters, but this one should never be used by the game creators.*

**Command**

`/mana [Decklist separated by 1s - required] [ignore lands, separated by |s - optional]` 

**Example**

`/mana [1 Adeliz, the Cinder Wind 1 Brainstorm 1 Lightning Bolt] [Volcanic Island | Mana Confluence]`

# Technical Overview

![Untitled Diagram drawio(2)](https://user-images.githubusercontent.com/5879928/185720951-d76c3490-7405-4358-b9ee-20694a09960c.png)

The development setup uses the power of automatic deployments to automatize the entire process apart from checking in the code to GitHub repository.

Heroku is used as a deployment and hosting platform which hosts both the API that makes the calculations and the Discord Bot that communicates between the calculator API and Discord API. Through Discord API user messages can be read and responded to.