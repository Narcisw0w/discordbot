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

// Setăm prefixul pentru comenzi
const prefix = '!';

// Ascultăm fiecare mesaj trimis pe server
client.on('messageCreate', async (message) => {
    // Ignorăm mesajele trimise de boți pentru a evita un loop infinit
    if (message.author.bot) return;

    // Ignorăm mesajele care nu încep cu prefixul nostru
    if (!message.content.startsWith(prefix)) return;

    // Separăm comanda de restul cuvintelor (argumentele)
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Comanda: !spune
    if (command === 'spune') {
        // Unim argumentele la loc pentru a forma propoziția completă
        const textToSay = args.join(' ');

        // Verificăm dacă utilizatorul a scris un text după comandă
        if (!textToSay) {
            return message.reply('Te rog să adaugi și un mesaj! (Exemplu: `!spune Salutare tuturor!`)');
        }

        // Încercăm să ștergem mesajul original al utilizatorului
        try {
            await message.delete();
        } catch (error) {
            console.error('Nu am putut șterge mesajul. Verifică permisiunile botului (Manage Messages).', error);
        }

        // Trimitem textul în canal
        message.channel.send(textToSay);
    }
});
