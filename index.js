require('dotenv').config();
const { Telegraf } = require('telegraf');
const nodemailer = require('nodemailer');

// 1. Inicializaciya na Telegram bota @Admiralerror_bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// 2. SMTP Transporter za Gmail (izpolzva se App Password)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
    }
});

// 3. Promocionalen tekst s dvata Render linka i oфертата
const promoEmailText = `
Zdraveite,

Zabelyazahme, che vashiyat biznes nqma sobstven uebsayt, s koito da prichlivate poveche klienti v internet.

Nie ot RED SOFTWARE TEAM izgrazhdame visoko tehnologichen uebsayt, avtomatizirani tabli (dashboards) i poruchkov softuer.

🔥 SPESIALNA PROMOCIYA:
* Izrabotka na visoko nivo (JS avtomatizacii, dashboard, website) za samo 50 evro (ednokratno)!
* 7 dni napylno bezplaten test period – razglezhdate i teztvate predi da platite.
* Vechen bezplaten hosting na Render (nula mesechni taksi).
* Gotov rabotesht sayt samo 1 chas sled poruchka!

🛠️ Osven tova predlagame: reklamen softuer, veb prilojeniya, cybersecurity hardwer i pulni komplekti s programirani platki.

🔗 Razglezhdate nasite sistemi tuk:
- https://red-software-dashbord.onrender.com
- https://redsoftwareteam-oficial.onrender.com

📞 Svyrzhete se s nas (Telefon / Viber / Telegram): 0879 813 928

RED SOFTWARE TEAM – Vashiyat partner v digitalnoto razvitie!
`;

// Primeren spisok s target biznesi (tuk shte se zarejdat bazite danni)
let targetBusinessList = [
    { email: "client1_example@gmail.com", name: "Biznes 1" },
    { email: "client2_example@gmail.com", name: "Biznes 2" }
    // ... tuk shte se dobavjat 500 imeyla za denonoshtieto
];

let isCampaignRunning = false;
let campaignInterval = null;

// 4. Telegram Komandi za kontrol
bot.start((ctx) => {
    ctx.reply('🚀 RED SOFTWARE AUTOMATION BOT е активен!\n\nКоманди:\n/startcampaign - Стартиране на пращането (500/ден по 10 броя)\n/stopcampaign - Спиране на кампанията\n/status - Проверка на състоянието');
});

bot.command('status', (ctx) => {
    ctx.reply(`🟢 Статус: Системата работи 24/7.\n⚙️ Кампания: ${isCampaignRunning ? 'АКТИВНА' : 'СПРЯНА'}\n📋 База таргети: ${targetBusinessList.length} записа.`);
});

// Komanda za start na reklamnata kampania prez Telegram
bot.command('startcampaign', (ctx) => {
    if (isCampaignRunning) {
        return ctx.reply('⚠️ Кампанията вече е стартирана и работи във фонов режим!');
    }

    isCampaignRunning = true;
    ctx.reply('🚀 Рекламната кампания стартира успешно! Ще се изпращат по 10 имейла на порции (цел: 500 на денонощие).');

    // Funkcia za vyrtene na porciite
    const runBatch = async () => {
        if (!isCampaignRunning) return;

        let batchSize = 10;
        let currentBatch = targetBusinessList.slice(0, batchSize);

        if (currentBatch.length === 0) {
            ctx.reply('🏁 Всички имейли от списъка бяха обходени и изпратени!');
            isCampaignRunning = false;
            clearInterval(campaignInterval);
            return;
        }

        let sentCount = 0;
        for (let client of currentBatch) {
            try {
                await transporter.sendMail({
                    from: '"RED SOFTWARE TEAM" <gtupoto7@gmail.com>',
                    to: client.email,
                    subject: 'Професионален уебсайт и софтуер за вашия бизнес (50€ + 7 дни тест)',
                    text: promoEmailText
                });
                sentCount++;
                // Premestvame izpratenija nadvyn v bazata ili go markirame
            } catch (error) {
                console.error(`Greshka pri izpratene do ${client.email}:`, error.message);
            }
            // Pauza ot 3 sekundi mezhdu imeylite v porciyata
            await new Promise(r => setTimeout(r, 3000));
        }

        // Mahame izpratenite ot opashkata
        targetBusinessList = targetBusinessList.slice(batchSize);
        ctx.reply(`📊 Изпратена е порция от ${sentCount} имейла. Остават в опашката: ${targetBusinessList.length}.`);
    };

    // Puska vednyg i sled tova na vseki 30 minuti (za da pokrie 500 na den)
    runBatch();
    campaignInterval = setInterval(runBatch, 30 * 60 * 1000);
});

bot.command('stopcampaign', (ctx) => {
    if (!isCampaignRunning) {
        return ctx.reply('ℹ️ Няма активна кампания в момента.');
    }
    isCampaignRunning = false;
    if (campaignInterval) clearInterval(campaignInterval);
    ctx.reply('🛑 Кампанията беше спряна успешно.');
});

// 5. Starirane na bota
bot.launch();
console.log('🤖 Telegram bot @Admiralerror_bot e pusnat i raboti 24/7!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
