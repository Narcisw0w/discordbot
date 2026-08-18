const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const play = require('play-dl');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log(`Botul a pornit cu succes! Conectat ca ${client.user.tag}`);
});

const prefix = '!';

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Comenzi Administrare
    if (command === 'ping') return message.reply('Merge fram.');

    if (command === 'spune') {
        const textToSay = args.join(' ');
        if (!textToSay) return message.reply('Mesaj invalid!');
        try { await message.delete(); } catch (e) {}
        message.channel.send(textToSay);
    }

    if (command === 'ip') {
        message.channel.send({ embeds: [{ color: 0x00FF00, title: '🌐 Server Info', description: '**IP:** `RAGE.B-HOOD.RO`' }] });
    }

    // Comanda Muzică: !play
    if (command === 'play') {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('❌ Intră într-un canal de voce!');

        const query = args.join(' ');
        let searched = await play.search(query, { limit: 1 });
        if (!searched.length) return message.reply('❌ Nu am găsit melodia.');

        const song = { title: searched[0].title, url: searched[0].url };
        
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const stream = await play.stream(song.url);
        const resource = createAudioResource(stream.stream, { inputType: stream.type });

        connection.subscribe(player);
        player.play(resource);
        
        message.reply(`🎶 Acum cântă: **${song.title}**`);
    }
});

client.login(process.env.DISCORD_TOKEN);