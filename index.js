require('dotenv').config();
const { Telegraf } = require('telegraf');

// 1. Използваме токена за @broker_free_bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// 2. Промоционален текст на кирилица
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

let targetBusinessList = [
    { email: "remonti.sofiya.bg@gmail.com", business: "Строителна бригада София" },
    { email: "stroitelstvo.pernik@gmail.com", business: "Майстор ремонти Перник" },
    { email: "carpenter.tutrakan.wood@gmail.com", business: "Дърводелски услуги Тутракан" }
];

let adminChatId = null; 

bot.start((ctx) => {
    adminChatId = ctx.chat.id;
    ctx.reply('🚀 BROKERFREE_BOT (@broker_free_bot) е активен!\n\nКоманди:\n/status - Проверка на базата\n/promo - Преглед на промо текста\n/add <email> - Добавяне на нов клиент');
});

bot.command('status', (ctx) => {
    ctx.reply(`📊 СТАТУС:\n- Клиенти в списъка: ${targetBusinessList.length}`);
});

bot.command('promo', (ctx) => {
    ctx.reply(promoText);
});

bot.command('add', (ctx) => {
    const textArgs = ctx.message.text.split(' ');
    if (textArgs.length < 2) {
        return ctx.reply('⚠️ Въведете имейл, напр: `/add klient@gmail.com`', { parse_mode: 'Markdown' });
    }
    const newEmail = textArgs[1];
    targetBusinessList.push({ email: newEmail, business: "Добавен ръчно" });
    ctx.reply(`✅ Успешно добавен: ${newEmail}\nОбщо в списъка: ${targetBusinessList.length}`);
});

bot.launch();
console.log('🤖 Telegram ботът @broker_free_bot стартира успешно без пощенски изисквания!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
