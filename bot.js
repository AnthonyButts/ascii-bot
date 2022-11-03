const Discord = require('discord.js')
const dotenv = require('dotenv')

const Sandbox = require('sandbox')

const Client = new Discord.Client(
    {
        intents: [
            'GUILDS',
            'GUILD_MEMBERS',
            'GUILD_MESSAGES'
        ]
    }
)

dotenv.config()

const { botPrefix } = require('./config.json')

Client.on('ready', () => {
    console.log('Bot Ready!')
})

Client.on('messageCreate', (msg) => {

    if (msg.author.bot) return
    if (msg.content.indexOf(botPrefix) !== 0) return;

    const args = msg.content.slice(botPrefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const codeSandbox = new Sandbox()
    
    if (command != 'run') return
    if (args.length < 1) return

    let finishedString = ''

    for (i=0; i < args.length; i++) {
        if (i == (args.length-1)) {
            finishedString += args[i]
            continue
        }

        finishedString += args[i] + ' '
    }

    finishedString = finishedString.replace('```js', '').replace('```', '').replace('\n', ' ')

    codeSandbox.run(finishedString, async (output) => {
        msg.reply('```js\nOutput: ' + await output.result + '\nConsole: ' + output.console +'```')
    })
})

Client.login(process.env.TOKEN)