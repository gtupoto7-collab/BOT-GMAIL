require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Promo tekst s ofertata i linkovete
const promoText = `
🔥 СПЕЦИАЛНА ОФЕРТА ОТ RED SOFTWARE TEAM 🔥

Относно: Изработка на високотехнологичен уебсайт и софтуер за вашия бизнес само за 50€ (7 дни безплатен тест)

Здравейте,
Забелязахме, че вашият бизнес предлага страхотни услуги, но все още нямате собствен професионален уебсайт, с който да привличате още клиенти директно в интернет.

Ние от RED SOFTWARE TEAM изграждаме висок клас уеб приложения, автоматизирани табла (dashboards) и гъвкав софтуер с пълно техническо обслужване.   

- Получавате готов, напълно работещ и модерен уебсайт само 1 час след поръчка!
- 7 дни напълно безплатен тестов период.
- Цена след теста: само 50 евро (еднократно) и сайтът работи вечно с включен вечен безплатен хостинг на Render.   

🔗 Системи:
- https://red-software-dashbord.onrender.com
- https://redsoftwareteam-oficial.onrender.com   

📞 Контакти: 0879 813 928 (Телефон / Viber / Telegram)
`;

// Spisyk s ID-tata na targovcite / grupite v Bulgaria, v koito bota e admin ili ima pravo da pishe
let targetGroups = [
    // Primereni ID-ta na grupi (tuka sluzish istinskite chat ID-ta na grupite)
    // -1001234567890,
    // -1009876543210
];

let adminChatId = null;
let totalSentAds = 0;

bot.start((ctx) => {
    adminChatId = ctx.chat.id;
    ctx.reply('🚀 TELEGRAM AD-BOT (@broker_free_bot) e aktiven!\n\nGotov za reklama v grupi.\nKomandi:\n/addgroup - Dobavjane na grupat v bazata (pishe se v samata grupa)\n/startads - Start na avtomatichnite postove\n/status - Statistika');
});

// Komanda za dobavjane na grupat, v koyato pishesh, v bazata danni
bot.command('addgroup', (ctx) => {
    const chatId = ctx.chat.id;
    if (ctx.chat.type === 'private' ) {
        return ctx.reply('⚠️ Taz komanda se izpolzva V T SAJTI/GRUPI, a ne v lichen chat!');
    }
    
    if (!targetGroups.includes(chatId)) {
        targetGroups.push(chatId);
        ctx.reply(`✅ Tazi grupa (-100...) bepeshe dobavena v bazata za reklama! ID: ${chatId}`);
    } else {
        ctx.reply('ℹ️ Tazi grupa veche e v spisaka.');
    }
});

// Funkcia za avtomatincho postvane v grupite
const runAdCampaign = async () => {
    if (targetGroups.length === 0) {
        if (adminChatId) bot.telegram.sendMessage(adminChatId, '⚠️ Nema dobaveni grupi! Izpolzvay `/addgroup` v grupite, deto iskash reklama.');
        return;
    }

    let sentCount = 0;
    for (let groupId of targetGroups) {
        try {
            await bot.telegram.sendMessage(groupId, promoText, { parse_mode: 'Markdown' });
            sentCount++;
            totalSentAds++;
            // Pauza mezhdu grupite za da nqma ban ot Telegram za spam
            await new Promise(r => setTimeout(r, 4000));
        } catch (error) {
            console.error(`Greshka pri postvane v grupa ${groupId}:`, error.message);
        }
    }

    // Otchet v tvoia lichen chat na vseki 10 minuti
    if (adminChatId) {
        bot.telegram.sendMessage(adminChatId, `📊 [OTCHET NA 10 MIN]: Uspešno pusnati reklami v ${sentCount} grupi. Obshto za denia: ${totalSentAds}`);
    }
};

// Puskane na avtomatinia interval na vseki 10 minuti (10 * 60 * 1000)
setInterval(runAdCampaign, 10 * 60 * 1000);

bot.command('startads', (ctx) => {
    ctx.reply('🚀 Reklamnata kampania v Telegram grupite startira!');
    runAdCampaign();
});

bot.command('status', (ctx) => {
    ctx.reply(`📊 STATISTIKA:\n- Obshto grupi v bazata: ${targetGroups.length}\n- Izprateni reklami: ${totalSentAds}`);
});

bot.launch();
console.log('🤖 Telegram Ad Bot startira uspeshno!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
