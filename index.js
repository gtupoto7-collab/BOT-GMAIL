require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// --- КОНФИГУРАЦИЯ НА КРАСИВАТА РЕКЛАМА ---

// 1. Линк към снимка (препоръчително е да е директен линк към .jpg/.png файл, хостнат публично)
// АЗ СЛАГАМ ПРИМЕРЕН ЛИНК, СМЕНИ ГО С ВАШИЯ!
const promoPhotoUrl = 'https://img.uxcel.com/tags/1699042981-web-development-best-practices.jpg'; 
// Пример за ваша снимка: https://redsoftwareteam-oficial.onrender.com/logo.png (ако имате такава)

// 2. Промо текст, форматиран с Telegram Markdown v2
// ВАЖНО: Всички специални символи (, -, ., !, (, )) трябва да са с ескейп ( \ ) пред тях!
const promoMarkdownText = `
*💣 ЖЕЛЕЗЕН ЦЕНОРАЗПИС НА RED SOFTWARE ENGINEERING* \\- *БЕЗ ФИЛТЪР, БЕЗ ИЗЛИШНИ ПРИКАЗКИ!*

⚡ *ПАКЕТ „УЕБСАЙТ И СОФТУЕРНИ ПРИЛОЖЕНИЯ“* — *50 €*
\\- Увеличена мощ: Получаваш перфектен уебсайт и авторски софтуерни приложения на борда!
\\- Условия: Плащаш 50 евро еднократно — сървърът ти излиза горе и работи завинаги на инфраструктурата на Render, без досадни месечни такси!

*Официални линкове на мрежата:*
  - 🌐 Официален порт: \`redsoftwareteam-oficial.onrender.com\`
  - 🛒 Маркетплейс & Софтуерен център: \`red-software-dashbord.onrender.com\`

🚀 *АВТОМАТИЧНИ СПАМ АГЕНТИ И МАШИНИ ЗА МАКСИМАЛЕН ОТУП*
(Генерират по 5000+ сигурни показвания и трафик за твоя бизнес в Gmail, Telegram и Facebook)
\\- 🤖 Malware-Spam Bot / Telegram Спамер: 30 € — Пускаш звяра в играта и помпането на съобщения започва веднага!
\\- 📧 Gmail Спамер & Ферма софтуер: Брутално директно влизане в пощите.
\\- 👥 Telegram / Facebook ботове за добавяне и група-спам: Пълен пакет за пълна доминация на пазара.

📞 *ДИРЕКТЕН КОНТАКТ С RED SOFTWARE ENGINEERING*
\\- 📱 Телефон / Viber: \`+359 879 813928\`
\\- ✉️ Имейл за поръчки: \`gtupoto7@gmail.com\`
`;

// --- ЛОГИКА НА БОТА ---

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
🔥 КРАСИВАТА РЕКЛАМНА МАШИНА НА RED SOFTWARE Е ГОТОВА!

/startads - Пуска автоматично пращане на снимка + текст на всеки 10 мин.
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

// Основна функция за разпространение: праща СНИМКА + описание
const executeAdBroadcast = async () => {
    if (targetGroups.length === 0) return;

    let sentInThisCycle = 0;
    for (let target of targetGroups) {
        try {
            // Изпращаме снимка с красивото описание като caption
            // Задължително задаваме parse_mode: 'MarkdownV2'
            await bot.telegram.sendPhoto(target, promoPhotoUrl, { 
                caption: promoMarkdownText, 
                parse_mode: 'MarkdownV2' 
            });
            
            sentInThisCycle++;
            totalSentAds++;
            // По-голяма пауза между групите, за да не се сметне за флъд от Telegram
            await new Promise(r => setTimeout(r, 6000)); 
        } catch (error) {
            console.error(`Грешка до ${target}:`, error.message);
        }
    }

    if (adminChatId) {
        bot.telegram.sendMessage(adminChatId, `📊 [ОТЧЕТ]: Разпространена красива реклама в ${sentInThisCycle} групи. Общо за деня: ${totalSentAds}`);
    }
};

bot.command('startads', (ctx) => {
    if (isCampaignRunning) return ctx.reply('⚠️ Кампанията вече работи!');
    isCampaignRunning = true;
    ctx.reply('🚀 КРАСИВАТА РЕКЛАМНА КАМПАНИЯ СТАРТИРА! Снимките с ценоразписа се въртят автоматично.');
    
    executeAdBroadcast(); // Пуска веднага при старт
    campaignInterval = setInterval(executeAdBroadcast, 10 * 60 * 1000); // После на всеки 10 минути
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
console.log('🤖 Ботът стартира с визуален ценоразпис и красиви букви!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
