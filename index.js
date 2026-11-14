require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// 1. Железният ценоразпис на RED SOFTWARE ENGINEERING като промо текст
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

// Списък с целеви групи (пази се в паметта на сървъра)
let targetGroups = [
    // Можеш да добавяш предварително ID-та или линкове тук
];

let adminChatId = null;
let totalSentAds = 0;
let isCampaignRunning = false;
let campaignInterval = null;

// Стартов панел и меню с команди
bot.start((ctx) => {
    adminChatId = ctx.chat.id;
    ctx.reply(`
🔥 RED SOFTWARE AD-BOT Е АКТИВЕН!

Управлявай рекламната машина директно от тук:
/startads - Стартира автоматично пращане на всеки 10 минути
/stopads - Спира кампанията
/addgroup <ID или @username> - Добавя нова група в списъка
/listgroups - Показва всички записани групи
/status - Статистика и брой изпратени съобщения
    `);
});

// 1. Добавяне на група директно в чата (например: /addgroup @bulgaria_chat или с ID -100...)
bot.command('addgroup', (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
        return ctx.reply('⚠️ Моля въведи групата след командата, например:\n`/addgroup @bulgaria_chat` или `/addgroup -100123456789`', { parse_mode: 'Markdown' });
    }
    
    const groupTarget = args[1];
    if (!targetGroups.includes(groupTarget)) {
        targetGroups.push(groupTarget);
        ctx.reply(`✅ Успешно добавена група в базата за спам/реклама:\n📌 ${groupTarget}\n\nОбщо активни групи: ${targetGroups.length}`);
    } else {
        ctx.reply(`ℹ️ Тази група вече е в списъка! Общо групи: ${targetGroups.length}`);
    }
});

// 2. Преглед на всички добавени групи
bot.command('listgroups', (ctx) => {
    if (targetGroups.length === 0) {
        return ctx.reply('⚠️ Все още няма добавени групи в списъка! Използвай `/addgroup <име>` за да добавиш.');
    }
    let listMsg = '📋 СПИСЪК С АКТИВНИ РЕКЛАМНИ ГРУПИ:\n\n';
    targetGroups.forEach((g, index) => {
        listMsg += `${index + 1}. ${g}\n`;
    });
    ctx.reply(listMsg);
});

// 3. Основна функция за пращане на рекламата
const executeAdBroadcast = async () => {
    if (targetGroups.length === 0) {
        if (adminChatId) {
            bot.telegram.sendMessage(adminChatId, '⚠️ [ВНИМАНИЕ]: Кампанията няма активни групи в списъка! Добави групи с `/addgroup`.');
        }
        return;
    }

    let sentInThisCycle = 0;

    for (let target of targetGroups) {
        try {
            await bot.telegram.sendMessage(target, promoText, { parse_mode: 'Markdown' });
            sentInThisCycle++;
            totalSentAds++;
            // Малка пауза между съобщенията за сигурност срещу флъд
            await new Promise(r => setTimeout(r, 4000));
        } catch (error) {
            console.error(`Грешка при изпращане до ${target}:`, error.message);
        }
    }

    // Отчет в личния ти чат на всеки 10 минути
    if (adminChatId) {
        bot.telegram.sendMessage(adminChatId, `📊 [ОТЧЕТ НА 10 МИНУТИ]:\n- Успешно разпространени реклами в ${sentInThisCycle} групи.\n- Общо за деня: ${totalSentAds} пратени съобщения.`);
    }
};

// 4. Стартиране на автоматичната кампания през 10 минути
bot.command('startads', (ctx) => {
    if (isCampaignRunning) {
        return ctx.reply('⚠️ Рекламната кампания вече работи на фон!');
    }
    if (targetGroups.length === 0) {
        return ctx.reply('⚠️ Списъкът с групи е празен! Добави поне една група с `/addgroup` преди да стартираш.');
    }

    isCampaignRunning = true;
    ctx.reply('🚀 АВТОМАТИЧНАТА РЕКЛАМНА КАМПАНИЯ СТАРТИРА!\nБотът ще помпа ценоразписа в групите на всеки 10 минути и ще ти праща отчети тук.');

    // Пускане веднага при старт
    executeAdBroadcast();

    // Настройка на интервала на всеки 10 минути (10 * 60 * 1000 ms)
    campaignInterval = setInterval(executeAdBroadcast, 10 * 60 * 1000);
});

// 5. Спиране на кампанията
bot.command('stopads', (ctx) => {
    if (!isCampaignRunning) {
        return ctx.reply('ℹ️ Кампанията в момента не е активна.');
    }
    clearInterval(campaignInterval);
    isCampaignRunning = false;
    ctx.reply('🛑 Рекламната кампания е спряна успешно.');
});

// 6. Проверка на текущия статус
bot.command('status', (ctx) => {
    ctx.reply(`📊 ТЕКУЩ СТАТУС НА МАШИНАТА:\n- Статус: ${isCampaignRunning ? '🟢 РАБОТИ НА ФОН' : '🔴 СПРЯНА'}\n- Брой активни групи: ${targetGroups.length}\n- Общо изпратени реклами: ${totalSentAds}`);
});

bot.launch();
console.log('🤖 RED SOFTWARE Telegram Ad-Bot стартира успешно!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
