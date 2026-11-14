require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

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

// Рекламни варианти за ротация (запазват на 100% оригиналното съдържание)
const adCaptions = [
`
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
`,
`
🔥 **Топ Оферта (Бюджет: 3100 Stars в Telegram Ads):**
Разгърни бизнеса си с главния бот @redsoftwarebot!

🌐 **Безсмъртни сайтове за 50 € & AI Системи**
• 7 дни напълно безплатен тест
• Плащаш 50 евро след теста през EasyPay
• Вечен сървър без прекъсване!

🔗 **ПЛАТФОРМА 1:** https://red-software-dashbord.onrender.com
🔗 **ПЛАТФОРМА 2:** https://redsoftwareteam-oficial.onrender.com
📌 **ТВОЯТА ГРУПА:** https://t.me/+HTJNMe-pUEeZnMY0
📞 **VIBER:** 0879 813 928
`,
`
🚀 **Специална Кампания (Бюджет: 3100 Stars в Telegram Ads):**
Посети официалния бот @redsoftwarebot за максимални резултати!

🌐 **Безсмъртни сайтове за 50 € & AI Системи**
• 7 дни напълно безплатен тест
• Плащаш 50 евро след теста през EasyPay
• Вечен сървър без прекъсване!

🔗 **ПЛАТФОРМА 1:** https://red-software-dashbord.onrender.com
🔗 **ПЛАТФОРМА 2:** https://redsoftwareteam-oficial.onrender.com
📌 **ТВОЯТА ГРУПА:** https://t.me/+HTJNMe-pUEeZnMY0
📞 **VIBER:** 0879 813 928
`
];

const adPhotoUrl = 'https://redsoftwareteam-oficial.onrender.com/assets/img/hero-img.png';

// Интерактивни бутони под рекламата за висок CTR
const inlineKeyboard = Markup.inlineKeyboard([
  [Markup.button.url('🌐 Разгледай Платформата', 'https://redsoftwareteam-oficial.onrender.com')],
  [Markup.button.url('📌 Твоята Група', 'https://t.me/+HTJNMe-pUEeZnMY0')],
  [Markup.button.url('💬 Viber Контакт', 'viber://chat?number=+359879813928')]
]);

// Функция за изпращане с опашка, ротация и 5 секунди пауза
async function sendAdsToAll() {
  if (!adsActive) return;
  console.log('🚀 Стартиране на машинната кампания към групите...');

  for (let group of groups) {
    if (!adsActive) break;
    try {
      // Избиране на случаен вариант на текста за anti-spam ротация
      const randomCaption = adCaptions[Math.floor(Math.random() * adCaptions.length)];

      await bot.telegram.sendPhoto(group, adPhotoUrl, {
        caption: randomCaption,
        parse_mode: 'Markdown',
        ...inlineKeyboard
      });
      totalSent++;
      console.log(`[УСПЕХ] Рекламата е пратена в: ${group}`);
    } catch (err) {
      console.log(`[ГРЕШКА в ${group}]: ${err.message}`);
    }
    // Перфектна пауза от 5 секунди между групите за стабилност
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

// Telegram Команди
bot.start((ctx) => {
  ctx.reply('🤖 Ботът машина с 43 групи и интерактивни бутони е на линия! Използвай /startads за пускане, /status за проверка или /listgroups за списъка.');
});

bot.command('startads', (ctx) => {
  if (adsActive) {
    return ctx.reply('⚠️ Кампанията вече работи!');
  }
  adsActive = true;
  ctx.reply(`🔥 МАШИНАТА СТАРТИРА! Рекламата с ротация и бутони ще се върти в ${groups.length} групи точно 3 пъти на ден (на всеки 8 часа).`);
  
  sendAdsToAll();
  
  // Интервал на всеки 8 часа (8 * 60 * 60 * 1000 ms) за максимална ефективност
  adsInterval = setInterval(sendAdsToAll, 8 * 60 * 60 * 1000);
});

bot.command('stopads', (ctx) => {
  adsActive = false;
  if (adsInterval) clearInterval(adsInterval);
  ctx.reply('🛑 Кампанията е спряна.');
});

bot.command('status', (ctx) => {
  ctx.reply(`📊 Статус: ${adsActive ? '🟢 Работи (Машина)' : '🔴 Спряна'}\n📦 Общо групи в базата: ${groups.length}\n📤 Изпратени реклами общо: ${totalSent}`);
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

// Стартиране на бота
bot.launch();
console.log('🤖 Ботът машина с ротация и бутони стартира успешно!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
