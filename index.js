require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const promoText = `
🔥 **СПЕЦИАЛНА ОФЕРТА ОТ RED SOFTWARE TEAM** 🔥

Предлагаме изработка на висок клас уебсайт, автоматизирани табла и софтуер само за **50 евро (еднократно)** с **вечен безплатен хостинг на Render**!

✨ **Какво получавате:**
* Готов, напълно работещ и модерен сайт само **1 час след поръчка**!
* **7 дни напълно безплатен тестов период** – разглеждате и тествате преди да платите.
* Нула месечни такси или скрити разходи (вечен хостинг).

🛠️ **Поръчков софтуер, уеб приложения, киберсигурност и хардуерни комплекти с платки!**

🔗 Разгледайте системите ни тук:
* [RED SOFTWARE DASHBOARD](https://red-software-dashbord.onrender.com)
* [RED SOFTWARE TEAM](https://redsoftwareteam-oficial.onrender.com)

📞 **За поръчки и контакти (Телефон / Viber / Telegram):**
**0879 813 928**
`;

bot.start((ctx) => {
    ctx.reply('🚀 RED SOFTWARE TELEGRAM BOT е активен!\n\nКоманди:\n/promo - Изпращане на промо офертата\n/status - Проверка на системата');
});

bot.command('status', (ctx) => {
    ctx.reply('🟢 Ботът работи 24/7 и е готов!');
});

bot.command('promo', (ctx) => {
    ctx.reply(promoText, { parse_mode: 'Markdown' });
});

bot.launch();
console.log('🤖 Telegram botyt @Admiralerror_bot startira uspeshno!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
