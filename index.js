process.on('uncaughtException', (error) => {
    console.error('Eroare critică (uncaughtException):', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Eroare neprinsă (unhandledRejection):', promise, 'motiv:', reason);
});

const { Client, GatewayIntentBits } = require('discord.js');

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

const prefix = '!';

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // 1. Comanda: !ping
    if (command === 'ping') {
        return message.reply('Merge fram.');
    }

    // 2. Comanda: !spune
    else if (command === 'spune') {
        const textToSay = args.join(' ');
        if (!textToSay) return message.reply('Te rog să adaugi un mesaj! (Ex: `!spune Salut`)');
        try { await message.delete(); } catch (e) {}
        message.channel.send(textToSay);
    }

    // 3. Comanda: !ip
    else if (command === 'ip') {
        const ipEmbed = {
            color: 0x00FF00,
            title: '🌐 Server Info',
            description: 'Te așteptăm la joc! Conectează-te folosind datele de mai jos:\n\n**IP:** `RAGE.B-HOOD.RO`',
            footer: { text: 'B-Hood Community' }
        };
        message.channel.send({ embeds: [ipEmbed] });
    }

    // 4. Comanda: !clear <număr>
    else if (command === 'clear') {
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply('❌ Nu ai permisiunea de a șterge mesaje!');
        }
        
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('Te rog să introduci un număr valid între 1 și 100.');
        }

        await message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.reply('A apărut o eroare la ștergerea mesajelor.');
        });
        
        const replyMsg = await message.channel.send(`✅ Am șters **${amount}** mesaje.`);
        setTimeout(() => replyMsg.delete().catch(() => {}), 4000);
    }

    // 5. Comanda: !kick <@user> [motiv]
    else if (command === 'kick') {
        if (!message.member.permissions.has('KickMembers')) {
            return message.reply('❌ Nu ai permisiunea de a da kick!');
        }
        
        const member = message.mentions.members.first();
        if (!member) return message.reply('Te rog să menționezi un utilizator! (Ex: `!kick @user spam`)');
        
        const reason = args.slice(1).join(' ') || 'Niciun motiv specificat.';
        
        member.kick(reason)
            .then(() => message.reply(`👢 **${member.user.tag}** a primit kick. Motiv: ${reason}`))
            .catch(err => message.reply('❌ Nu pot da kick acestui utilizator.'));
    }

    // 6. Comanda: !ban <@user> [motiv]
    else if (command === 'ban') {
        if (!message.member.permissions.has('BanMembers')) {
            return message.reply('❌ Nu ai permisiunea de a da ban!');
        }
        
        const member = message.mentions.members.first();
        if (!member) return message.reply('Te rog să menționezi un utilizator! (Ex: `!ban @user reclame`)');
        
        const reason = args.slice(1).join(' ') || 'Niciun motiv specificat.';
        
        member.ban({ reason: reason })
            .then(() => message.reply(`🔨 **${member.user.tag}** a primit ban. Motiv: ${reason}`))
            .catch(err => message.reply('❌ Nu pot da ban acestui utilizator.'));
    }

    // 7. Comanda: !avatar [@user]
    else if (command === 'avatar') {
        const user = message.mentions.users.first() || message.author;
        const avatarEmbed = {
            color: 0x00FF00,
            title: `Avatar - ${user.username}`,
            image: { url: user.displayAvatarURL({ dynamic: true, size: 1024 }) }
        };
        message.channel.send({ embeds: [avatarEmbed] });
    }

    // 8. Comanda: !serverinfo
    else if (command === 'serverinfo') {
        const guild = message.guild;
        const owner = await guild.fetchOwner();
        
        const infoEmbed = {
            color: 0x00FF00,
            title: `📊 Informații despre ${guild.name}`,
            thumbnail: { url: guild.iconURL({ dynamic: true }) },
            fields: [
                { name: '👑 Owner', value: owner.user.tag, inline: true },
                { name: '👥 Membri', value: `${guild.memberCount}`, inline: true },
                { name: '📅 Creat la', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:d>`, inline: true }
            ],
            footer: { text: `ID Server: ${guild.id}` }
        };
        message.channel.send({ embeds: [infoEmbed] });
    }
});

client.login(process.env.DISCORD_TOKEN);
