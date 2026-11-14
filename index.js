require('dotenv').config();
const { Telegraf } = require('telegraf');

const token = process.env.TELEGRAM_BOT_TOKEN || '9089352268:AAHc7zTEUTPxOvYoey01ovhB13s3ZukcDD8';
const bot = new Telegraf(token);

// Пълен масив с всички 43 български групи и канали
let groups = [
  '@Balgarski',
  '@bulgaria_dobrich',
  '@bulgaria_service_group',
  '@speak_bulgarian_channel',
  '@mrbit_bulgaria',
  '@bulgaria_realestate_bg',
  '@bulgariaz',
  '@bulgaria8',
  '@antariahomes',
  '@ukraina_bulgaria',
  '@russians_in_bulgaria',
  '@xo_xo',
  '@bulgariazchat',
  '@bgforukr',
  '@Za_Pravda_Chat',
  '@Bolgaria_uslugi',
  '@vechnabulgaria',
  '@LPIHyundaiKiaBulgaria',
  '@byalachat',
  '@tyrsii',
  '@bulgaria_job',
  '@bgcarmarket',
  '@obqvi',
  '@AutoSale_Bulgaria_Ukraine',
  '@auto_bulgaria_chat',
  '@Autochat_Bulgaria_Ukraine',
  '@auto_Bulgaria',
  '@autotradewelcome',
  '@autochatbg1',
  '@autochat_bulgaria',
  '@Dimitar_Autonomi_Bulgaria',
  '@PLOVDIV_DVIZH',
  '@botevplovdiv1912',
  '@Compass_Plovdiv',
  '@PlovdivBTC',
  '@partyballoonss',
  '@plovdivnews',
  '@plovdivgamesforall',
  '@PlovdivBOT',
  '@PldAmateurs',
  '@plovdiv_bg',
  '@dvizh_plovdiv',
  '@mafiaplovdiv'
];

let adsActive = false;
let adsInterval = null;
let totalSent = 0;

// Рекламно съобщение и снимка
const adCaption = `
⭐ **Рекламна Кампания (Бюджет: 3100 Stars в Telegram Ads):**
Активно промотиране на главния бот @redsoftwarebot!

🌐 **Безсмъртни сайтове за 50 € & AI Системи**
• 7 дни напълно безплатен тест
• Плащаш 50 евро след теста през EasyPay
• Вечен сървър без прекъсване!

🔗 **ПЛАТФОРМА 1:** https://red-software-dashbord.onrender.com
🔗 **ПЛАТФОРМА 2:** https://redsoftwareteam-oficial.onrender.com
📌 **ТВОЯТА ГРУПА:** https://t.me/+HTJNMe-pUEeZnMY0
📞 **VIBER:** 0879 813 928
`;

const adPhotoUrl = 'https://redsoftwareteam-oficial.onrender.com/assets/img/hero-img.png';

// Функция за изпращане с опашка и пауза срещу бан/забиване
async function sendAdsToAll() {
  if (!adsActive) return;
  console.log('🚀 Стартиране на изпращането към всички групи...');

  for (let group of groups) {
    if (!adsActive) break;
    try {
      await bot.telegram.sendPhoto(group, adPhotoUrl, {
        caption: adCaption,
        parse_mode: 'Markdown'
      });
      totalSent++;
      console.log(`[УСПЕХ] Рекламата е пратена в: ${group}`);
    } catch (err) {
      console.log(`[ГРЕШКА в ${group}]: ${err.message}`);
    }
    // Пауза от 3 секунди между всяка група
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

// Telegram Команди
bot.start((ctx) => {
  ctx.reply('🤖 Ботът машина е на линия с всички групи! Използвай /startads за пускане, /status за проверка или /listgroups за списъка.');
});

bot.command('startads', (ctx) => {
  if (adsActive) {
    return ctx.reply('⚠️ Кампанията вече работи!');
  }
  adsActive = true;
  ctx.reply(`🔥 КАМПАНИЯТА СТАРТИРА! Рекламата ще се върти в ${groups.length} групи точно 2 пъти на ден.`);
  
  sendAdsToAll();
  // Интервал на всеки 12 часа
  adsInterval = setInterval(sendAdsToAll, 12 * 60 * 60 * 1000);
});

bot.command('stopads', (ctx) => {
  adsActive = false;
  if (adsInterval) clearInterval(adsInterval);
  ctx.reply('🛑 Кампанията е спряна.');
});

bot.command('status', (ctx) => {
  ctx.reply(`📊 Статус: ${adsActive ? '🟢 Работи' : '🔴 Спряна'}\n📦 Общо групи в базата: ${groups.length}\n📤 Изпратени реклами общо: ${totalSent}`);
});

bot.command('listgroups', (ctx) => {
  const list = groups.join(', ');
  ctx.reply(`📋 Активни групи (${groups.length}):\n${list}`);
});

bot.command('addgroup', (ctx) => {
  const text = ctx.message.text;
  const newGroups = text.split(' ').slice(1);
  if (newGroups.length === 0) {
    return ctx.reply('Моля, дай поне едно име, напр: /addgroup @grupa');
  }
  let added = 0;
  newGroups.forEach(g => {
    if (g.startsWith('@') && !groups.includes(g)) {
      groups.push(g);
      added++;
    }
  });
  ctx.reply(`✅ Добавени ${added} нови групи! Общо групи: ${groups.length}`);
});

// Стартиране
bot.launch();
console.log('🤖 Ботът машина с 43 групи стартира успешно!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
