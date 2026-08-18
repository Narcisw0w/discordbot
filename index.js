process.on('uncaughtException', (error) => {
    console.error('Eroare critică (uncaughtException):', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Eroare neprinsă (unhandledRejection):', promise, 'motiv:', reason);
});


const { Client, GatewayIntentBits } = require('discord.js');

// Inițializăm clientul cu permisiunile (intents) necesare
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Botul a pornit cu succes! Conectat ca ${client.user.tag}`);
});

// Un exemplu simplu de comandă de tip prefix (!)
client.on('messageCreate', message => {
    if (message.author.bot) return;

    if (message.content === '!ping') {
        message.reply('Pong! 📯 Botul tău funcționează perfect pe cloud.');
    }
});

// Autentificarea botului folosind token-ul din variabilele de mediu (recomandat pentru Railway)
client.login(process.env.DISCORD_TOKEN);
