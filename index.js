require('dotenv').config();
const { Telegraf } = require('telegraf');
const nodemailer = require('nodemailer');

// 1. Използваме токена за @broker_free_bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// 2. SMTP Транспортер за Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
    }
});

// 3. Точният промоционален текст на кирилица
const promoEmailText = `
Относно: Изработка на високотехнологичен уебсайт и софтуер за вашия бизнес само за 50€ (7 дни безплатен тест)

Здравейте,

Забелязахме, че вашият бизнес предлага страхотни услуги, но все още нямате собствен професионален уебсайт, с който да привличате още клиенти директно в интернет.

Ние от RED SOFTWARE TEAM изграждаме висок клас уеб приложения, автоматизирани табла (dashboards) и гъвкав софтуер с пълно техническо обслужване.   

🔥 Специална промоция за малък бизнес:
- Получавате готов, напълно работещ и модерен уебсайт само 1 час след поръчка!
- 7 дни напълно безплатен тестов период – разглеждате, тествате и оценявате качеството, преди да заплатите каквото и да било.
- Цена след теста: само 50 евро (еднократно) и сайтът работи вечно!
- Включен вечен безплатен хостинг на Render, за да нямате никакви месечни такси или скрити разходи.   

🛠️ Какво още предлагаме:
- Изработка на поръчков софтуер и уеб приложения
- Рекламен софтуер и дигитална автоматизация
- Cybersecurity хардуер и пълни Full-Stack комплекти с програмирани платки

🔗 Разгледайте нашите актуални реализации и системи тук:
- RED SOFTWARE DASHBOARD: https://red-software-dashbord.onrender.com
- RED SOFTWARE TEAM OFFICIAL: https://redsoftwareteam-oficial.onrender.com   

📞 Свържете се с нас веднага за поръчка и консултация:
- Телефон / Viber / Telegram: 0879 813 928

RED SOFTWARE TEAM – Бързо, сигурно и работещо вечно решение за вашия бизнес!
`;

// 4. ПЪЛНА БАЗА ДАННИ С ТАРГЕТ БИЗНЕСИ (Можеш да добавяш още колкото искаш тук)
let targetBusinessList = [
    { email: "remonti.sofiya.bg@gmail.com", business: "Строителна бригада София" },
    { email: "stroitelstvo.pernik@gmail.com", business: "Майстор ремонти Перник" },
    { email: "carpenter.tutrakan.wood@gmail.com", business: "Дърводелски услуги Тутракан" },
    { email: "autoservice.bg.milan@gmail.com", business: "Автосервиз и диагностика" },
    { email: "el.uslugi.sofia24@gmail.com", business: "Електротехник услуги" },
    { email: "vik.remonti.plovdiv@gmail.com", business: "ВиК услуги и монтаж" },
    { email: "mebeli.po.porachka.varna@gmail.com", business: "Мебели по поръчка" },
    { email: "ohrana.sistemi.burgas@gmail.com", business: "Охранителни системи и видеонаблюдение" },
    { email: "pochistvane.domove.sofia@gmail.com", business: "Фирма за почистване" },
    { email: "reklama.vizualna.bg@gmail.com", business: "Рекламни услуги" }
    // Тук можеш да добавиш стотици други целеви имейли...
];

let dailySentCount = 0;
let adminChatId = null; 

// 5. Telegram интерфейс и команди
bot.start((ctx) => {
    adminChatId = ctx.chat.id;
    ctx.reply('🚀 BROKERFREE_BOT (@broker_free_bot) е активен!\n\nБазата данни с бизнес предприемачи е заредена.\n\nКоманди:\n/status - Проверка на статуса и днешния отчет\n/add <email> - Добавяне на нов клиент в базата\n/startcampaign - Ръчен старт на кампанията');
});

bot.command('status', (ctx) => {
    ctx.reply(`📊 СТАТУС НА КАМПАНИЯТА:\n- Изпратени днес: ${dailySentCount} / 500 имейла\n- Оставащи в опашката: ${targetBusinessList.length}`);
});

// Команда за директно добавяне на имейл през Telegram: /add client@gmail.com
bot.command('add', (ctx) => {
    const textArgs = ctx.message.text.split(' ');
    if (textArgs.length < 2) {
        return ctx.reply('⚠️ Моля въведете имейл след командата, напр: `/add novklient@gmail.com`', { parse_mode: 'Markdown' });
    }
    const newEmail = textArgs[1];
    targetBusinessList.push({ email: newEmail, business: "Добавен ръчно от Telegram" });
    ctx.reply(`✅ Успешно добавен нов бизнес имейл в базата:\n${newEmail}\nОбщо в опашката: ${targetBusinessList.length}`);
});

// Функция за автоматично пращане по 5 имейла на порции (цел 500 на ден)
const runAutoCampaign = async () => {
    if (targetBusinessList.length === 0) {
        if (adminChatId) bot.telegram.sendMessage(adminChatId, '⚠️ Опашката с имейли е празна! Добавете нови бизнеси.');
        return;
    }

    let batchSize = 5; // Праща по 5 наведжнъж
    let currentBatch = targetBusinessList.slice(0, batchSize);
    let sentInBatch = 0;

    for (let client of currentBatch) {
        try {
            await transporter.sendMail({
                from: '"RED SOFTWARE TEAM" <gtupoto7@gmail.com>',
                to: client.email,
                subject: 'Изработка на уебсайт за вашия бизнес (50€ + 7 дни тест)',
                text: promoEmailText
            });
            sentInBatch++;
            dailySentCount++;
        } catch (error) {
            console.error(`Грешка при пращане до ${client.email}:`, error.message);
        }
        await new Promise(r => setTimeout(r, 3000)); // Пауза 3 секунди между имейлите
    }

    // Премахваме изпратените от опашката
    targetBusinessList = targetBusinessList.slice(batchSize);

    // Изпращане на отчет в Telegram
    if (adminChatId) {
        bot.telegram.sendMessage(adminChatId, `📊 [Авто-Отчет]: Изпратена порция от ${sentInBatch} имейла. Общо днес: ${dailySentCount}/500. Остават в базата: ${targetBusinessList.length}`);
    }
};

// Пускане на интервал: праща по 5 имейла на всеки ~14 минути (за да покрие 500 на денонощие)
setInterval(runAutoCampaign, 14 * 60 * 1000);

// Ръчен старт на кампанията през Telegram
bot.command('startcampaign', (ctx) => {
    ctx.reply('🚀 Кампанията за разпространение към бизнес предприемачи стартира фоново!');
    runAutoCampaign();
});

// Денонощен отчет и нулиране на брояча
setInterval(() => {
    if (adminChatId) {
        bot.telegram.sendMessage(adminChatId, `🌙 [ДЕННОШЕН ОТЧЕТ]: За изминалото денонощие бяха успешно изпратени общо **${dailySentCount}** промоционални имейла към бизнес клиенти.`);
    }
    dailySentCount = 0; 
}, 24 * 60 * 60 * 1000);

bot.launch();
console.log('🤖 Telegram ботът @broker_free_bot стартира с пълна база данни!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
