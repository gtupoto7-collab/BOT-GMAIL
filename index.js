require('dotenv').config();
const { Telegraf } = require('telegraf');

// 1. Новият токен от BotFather
const bot = new Telegraf('9089352268:AAHc7zTEUTPxOvYoey01ovhB13s3ZukcDD8');

// 2. Линк към снимка (сложи директен линк към ваше логото или снимка на проект)
const promoPhotoUrl = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop';

// 3. Красив и изчистен промо текст (без чужди символи, които чупят кода)
const promoText = `
💣 ЖЕЛЕЗЕН ЦЕНОРАЗПИС НА RED SOFTWARE ENGINEERING — БЕЗ ФИЛТЪР, БЕЗ ИЗЛИШНИ ПРИКАЗКИ!

⚡ ПАКЕТ "УЕБСАЙТ И СОФТУЕРНИ ПРИЛОЖЕНИЯ" — 50 EUR
• Увеличена мощ: Получаваш перфектен уебсайт и авторски софтуерни приложения на борда!
• Условия: Плащаш 50 евро еднократно — сървърът ти излиза горе и работи завинаги на инфраструктурата на Render, без досадни месечни такси!

Официални линкове на мрежата:
🌐 Официален порт: redsoftwareteam-oficial.onrender.com
🛒 Маркетплейс & Софтуерен център: red-software-dashbord.onrender.com

🚀 АВТОМАТИЧНИ СПАМ АГЕНТИ И МАШИНИ ЗА МАКСИМАЛЕН ОТУП
(Генерират по 5000+ сигурни показвания и трафик за твоя бизнес в Gmail, Telegram и Facebook)
• Malware-Spam Bot / Telegram Спамер: 30 EUR — Пускаш звяра в играта и помпането на съобщения започва веднага!
• Gmail Спамер & Ферма софтуер: Брутално директно влизане в пощите.
• Telegram / Facebook ботове за добавяне и група-спам: Пълен пакет за пълна доминация на пазара.

📞 ДИРЕКТЕН КОНТАКТ С RED SOFTWARE ENGINEERING
📱 Телефон / Viber: +359 879 813928
✉️ Имейл за поръчки: gtupoto7@gmail.com
`;

// Списък с групи по подразбиране
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
🔥 БОТЪТ @bulider_fullstack_bot Е АКТИВЕН И ГОТОВ!

Управлявай рекламната машина директно от тук:
/startads - Стартира автоматично пращане (снимка + ценоразпис) на всеки 10 мин.
/stopads - Спира кампанията
/addgroup <група> - Добавя нова група в списъка
/listgroups - Показва списъка с групи
/status - Статистика и изпратени съобщения
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
        ctx.reply(`✅ Добавена група: ${groupTarget}\nОбщо групи: ${targetGroups.length}`);
    } else {
        ctx.reply(`ℹ️ Тази група вече е в списъка.`);
    }
});

bot.command('listgroups', (ctx) => {
    if (targetGroups.length === 0) return ctx.reply('⚠️ Списъкът с групи е празен.');
    let msg = '📋 АКТИВНИ РЕКЛАМНИ ГРУПИ:\n\n';
    targetGroups.forEach((g, i) => msg += `${i + 1}. ${g}\n`);
    ctx.reply(msg);
});

// Основна функция за разпространение на снимка + текст
const executeAdBroadcast = async () => {
    if (targetGroups.length === 0) return;

    let sentInThisCycle = 0;
    for (let target of targetGroups) {
        try {
            await bot.telegram.sendPhoto(target, promoPhotoUrl, { 
                caption: promoText 
            });
            sentInThisCycle++;
            totalSentAds++;
            await new Promise(r => setTimeout(r, 5000)); // пауза 5 сек между групите
        } catch (error) {
            console.error(`Грешка до ${target}:`, error.message);
        }
    }

    if (adminChatId) {
        bot.telegram.sendMessage(adminChatId, `📊 [ОТЧЕТ НА 10 МИН.]: Изпратена рекламна снимка с ценоразпис в ${sentInThisCycle} групи. Общо за деня: ${totalSentAds}`);
    }
};

bot.command('startads', (ctx) => {
    if (isCampaignRunning) return ctx.reply('⚠️ Кампанията вече работи на фон!');
    isCampaignRunning = true;
    ctx.reply('🚀 КАМПАНИЯТА СТАРТИРА! Рекламата с красива снимка и железния ценоразпис тръгва автоматично.');
    
    executeAdBroadcast(); // Пуска веднага
    campaignInterval = setInterval(executeAdBroadcast, 10 * 60 * 1000); // На всеки 10 минути
});

bot.command('stopads', (ctx) => {
    if (!isCampaignRunning) return ctx.reply('ℹ️ Кампанията не е активна.');
    clearInterval(campaignInterval);
    isCampaignRunning = false;
    ctx.reply('🛑 Кампанията е спряна успешно.');
});

bot.command('status', (ctx) => {
    ctx.reply(`📊 СТАТУС НА МАШИНАТА:\n- Работи: ${isCampaignRunning ? 'ДА' : 'НЕ'}\n- Брой групи: ${targetGroups.length}\n- Изпратени реклами: ${totalSentAds}`);
});

bot.launch();
console.log('🤖 Ботът @bulider_fullstack_bot стартира успешно и без грешки!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
