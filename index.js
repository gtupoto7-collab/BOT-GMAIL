require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Железният ценоразпис на RED SOFTWARE ENGINEERING
const promoText = `
💣 ЖЕЛЕЗЕН ЦЕНОРАЗПИС НА RED SOFTWARE ENGINEERING — БЕЗ ФИЛТЪР, БЕЗ ИЗЛИШНИ ПРИКАЗКИ!

⚡ ПАКЕТ „УЕБСАЙТ И СОФТУЕРНИ ПРИЛОЖЕНИЯ“ — 50 €
- Увеличена мощ: Получаваш перфектен уебсайт и авторски софтуерни приложения на борда!
- Условия: Плащаш 50 евро еднократно — сървърът ти излиза горе и работи завинаги на инфраструктурата на Render, без досадни месечни такси!
- Официални линкове на мрежата:
  - 🌐 Официален порт: redsoftwareteam-oficial.onrender.com
  - 🛒 Маркетплейс & Софтуерен център: red-software-dashbord.onrender.com

🚀 АВТОМАТИЧНИ СПАМ АГЕНТИ И МАШИНИ ЗА МАКСИМАЛЕН ОТУП
(Генерират по 5000+ сигурни показвания и трафик за твоя бизнес в Gmail, Telegram и Facebook)
- 🤖 Malware-Spam Bot / Telegram Спамер: 30 € — Пускаш звяра в играта и помпането на съобщения започва веднага!
- 📧 Gmail Спамер & Ферма софтуер: Брутално директно влизане в пощите.
- 👥 Telegram / Facebook ботове за добавяне и група-спам: Пълен пакет за пълна доминация на пазара.

📞 ДИРЕКТЕН КОНТАКТ С RED SOFTWARE ENGINEERING
- 📱 Телефон / Viber: +359 879 813928
- ✉️ Имейл за поръчки: gtupoto7@gmail.com
`;

let targetGroups = [
    "@bulgaria_chat",
    "@auto_bulgaria_chat",
    "@bulgaria_chats",
    "@bulgaria_chaty",
    "@bulgaria_chat_bg"
];

let adminChatId = null;
let totalSentAds = 0;
let isCampaignRunning = false;
let campaignInterval = null;

bot.start((ctx) => {
    adminChatId = ctx.chat.id;
    ctx.reply(`
🔥 РЕКЛАМНАТА МАШИНА НА RED SOFTWARE Е ГОТОВА!

/startads - Пуска автоматично пращане на всеки 10 минути
/stopads - Спира кампанията
/addgroup <група> - Добавя нова група
/listgroups - Показва списъка
/status - Статистика
    `);
});

bot.command('addgroup', (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
        return ctx.reply('⚠️ Въведи групата, например: `/addgroup @bulgaria_chat`', { parse_mode: 'Markdown' });
    }
    const groupTarget = args[1];
    if (!targetGroups.includes(groupTarget)) {
        targetGroups.push(groupTarget);
        ctx.reply(`✅ Добавена група: ${groupTarget} (Общо: ${targetGroups.length})`);
    } else {
        ctx.reply(`ℹ️ Тази група вече е в списъка.`);
    }
});

bot.command('listgroups', (ctx) => {
    if (targetGroups.length === 0) return ctx.reply('⚠️ Списъкът с групи е празен.');
    let msg = '📋 АКТИВНИ ГРУПИ:\n';
    targetGroups.forEach((g, i) => msg += `${i + 1}. ${g}\n`);
    ctx.reply(msg);
});

const executeAdBroadcast = async () => {
    if (targetGroups.length === 0) return;

    let sentInThisCycle = 0;
    for (let target of targetGroups) {
        try {
            await bot.telegram.sendMessage(target, promoText, { parse_mode: 'Markdown' });
            sentInThisCycle++;
            totalSentAds++;
            await new Promise(r => setTimeout(r, 4000));
        } catch (error) {
            console.error(`Грешка до ${target}:`, error.message);
        }
    }

    if (adminChatId) {
        bot.telegram.sendMessage(adminChatId, `📊 [ОТЧЕТ]: Пуснати реклами в ${sentInThisCycle} групи. Общо за деня: ${totalSentAds}`);
    }
};

bot.command('startads', (ctx) => {
    if (isCampaignRunning) return ctx.reply('⚠️ Кампанията вече работи!');
    isCampaignRunning = true;
    ctx.reply('🚀 КАМПАНИЯТА СТАРТИРА! Рекламата се върти без никакви ограничения.');
    
    executeAdBroadcast();
    campaignInterval = setInterval(executeAdBroadcast, 10 * 60 * 1000);
});

bot.command('stopads', (ctx) => {
    if (!isCampaignRunning) return ctx.reply('ℹ️ Кампанията не е активна.');
    clearInterval(campaignInterval);
    isCampaignRunning = false;
    ctx.reply('🛑 Кампанията е спряна.');
});

bot.command('status', (ctx) => {
    ctx.reply(`📊 СТАТУС:\n- Работи: ${isCampaignRunning ? 'ДА' : 'НЕ'}\n- Групи: ${targetGroups.length}\n- Изпратени: ${totalSentAds}`);
});

bot.launch();
console.log('🤖 Ботът работи перфектно без защити за канали!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
