// Where the teahouse is. Each city has its own street, its own guests and its own way of doing things: what they like
// to order, how long they will wait, whether they tip, how much a shop costs a day. You keep one set of recipes,
// your money and your reputation, but every city is its own shop that starts small and grows on its own.
const u = (zh, en) => ({ zh, en });
const has = (...cats) => (p) => cats.includes(p.cat);

// mods: foot = how many people walk by, appeal = how likely they come in, price / tip = what they pay,
// patience = how long they wait, toGo = how often they want it to take away, stay = how long they sit,
// strict = a score below this disappoints them, amb = how much the room's ambience pulls people in
export const PLACES = [
  {
    id: 'taipei', flag: '🇹🇼', name: u('台北・老巷口', 'Taipei · the old alley'), street: u('永康街', 'Yongkang St'), rep: 0, cost: 0, rent: 0,
    about: u('一切開始的地方：巷口的老茶館，鄰居都是熟客。', 'Where it all began: an old teahouse at the mouth of the alley, the neighbours are regulars.'),
    rule: u('沒有特別的規矩，好好做就好。', 'No special rules: just make it well.'),
    mods: {}, favs: has('pure', 'milk', 'braise'),
    goal: { n: 12, test: () => true, text: (n) => u(`賣出 ${n} 份`, `Sell ${n} things`) },
    souv: { id: 'tw101', zh: '台北101模型', en: 'Taipei 101 model', cost: 0, amb: 8, spot: 'floor' },
    look: { pave: '#b86c50', paveLine: 'rgba(80,30,20,0.35)', brick: true, kerb: '#c83a2a', road: '#5a5a5e', rides: ['scooter'], view: 'taipei' },
  },
  {
    id: 'bangkok', flag: '🇹🇭', name: u('曼谷・夜市', 'Bangkok · the night market'), street: u('考山路', 'Khao San Rd'), rep: 150, cost: 2000, rent: 80,
    about: u('又熱又熱鬧的夜市，人超多，攤販的叫賣聲不停。', 'A hot, noisy night market: crowds everywhere and street sellers calling out.'),
    rule: u('天氣炎熱：客人很多但比較沒耐心，愛點水果茶、特調和飯，價錢比較便宜。', 'It’s hot: lots of guests, but they’re impatient; they love fruit teas, specials and rice, and pay a little less.'),
    mods: { foot: 1.5, appeal: 1.1, price: 0.85, tip: 0.7, patience: 0.75, toGo: 0.4 }, favs: has('fruit', 'special', 'rice'),
    goal: { n: 12, test: (p) => ['fruit', 'special', 'rice'].includes(p.cat), text: (n) => u(`賣出 ${n} 份水果茶、特調或飯`, `Sell ${n} fruit teas, specials or rice dishes`) },
    souv: { id: 'elephant', zh: '泰國大象', en: 'Thai elephant', cost: 0, amb: 8, spot: 'floor' },
    look: { pave: '#a89478', paveLine: 'rgba(70,50,30,0.3)', kerb: '#e8c040', road: '#4a4a50', rides: ['tuktuk', 'scooter', 'scooter'], view: 'bangkok', night: true },
  },
  {
    id: 'tokyo', flag: '🇯🇵', name: u('東京・下町', 'Tokyo · the old town'), street: u('谷中銀座', 'Yanaka Ginza'), rep: 300, cost: 3500, rent: 250,
    about: u('安靜整齊的老街，客人會耐心排隊，但對品質要求很高。', 'A quiet, tidy old shopping street: guests queue patiently, but expect the very best.'),
    rule: u('客人很挑剔：做不到 80 分會失望（扣口碑）。日本沒有給小費的習慣，但價錢比較高。愛點純茶、鮮奶茶和甜品。', 'Guests are particular: anything under 80 disappoints them (you lose reputation). Nobody tips in Japan, but prices are higher. They love pure tea, fresh milk tea and desserts.'),
    mods: { foot: 1.1, price: 1.45, tip: 0, patience: 1.6, strict: 80, toGo: 0.2 }, favs: has('pure', 'latte', 'dessert'),
    goal: { n: 8, test: (p, score) => score >= 90, text: (n) => u(`做出 ${n} 份 90 分以上`, `Serve ${n} things scoring 90 or more`) },
    souv: { id: 'maneki', zh: '招財貓', en: 'Beckoning cat', cost: 0, amb: 8, spot: 'wall' },
    look: { pave: '#a8a8a4', paveLine: 'rgba(60,60,60,0.3)', kerb: '#f4f0e8', road: '#606064', rides: ['bike', 'bike', 'scooter'], view: 'tokyo' },
  },
  {
    id: 'london', flag: '🇬🇧', name: u('倫敦・街角', 'London · a street corner'), street: u('Baker St', 'Baker St'), rep: 600, cost: 5000, rent: 300,
    about: u('紅色巴士、紅色電話亭，天氣說變就變。英國人超愛奶茶。', 'Red buses, red phone boxes and weather that changes in a minute. The British love a milky tea.'),
    rule: u('常常下雨：下雨天路人少了很多，但進來的人會坐比較久、比較大方。愛點奶茶、鮮奶茶和煎台點心。', 'It rains a lot: on rainy days far fewer people go by, but those who come in stay longer and pay more. They love milk tea, fresh milk tea and griddle snacks.'),
    mods: { foot: 1, price: 1.3, tip: 1, patience: 1.1 }, rain: 0.55, favs: has('milk', 'latte', 'snack'),
    goal: { n: 12, test: (p) => p.cat === 'milk' || p.cat === 'latte', text: (n) => u(`賣出 ${n} 杯奶茶或鮮奶茶`, `Sell ${n} milk teas or fresh milk teas`) },
    souv: { id: 'phonebox', zh: '紅色電話亭', en: 'Red phone box', cost: 0, amb: 8, spot: 'floor' },
    look: { pave: '#9a9a98', paveLine: 'rgba(50,50,50,0.35)', slabs: true, kerb: '#d8d4cc', road: '#4a4a4e', lines: '#e8d040', rides: ['bus', 'cab', 'cab'], view: 'london' },
  },
  {
    id: 'paris', flag: '🇫🇷', name: u('巴黎・左岸', 'Paris · the Left Bank'), street: u('Rue Cler', 'Rue Cler'), rep: 1000, cost: 8000, rent: 350,
    about: u('石板路、咖啡館的露天座。巴黎人喜歡慢慢坐、慢慢吃。', 'Cobbled streets and café terraces. Parisians like to sit, and take their time.'),
    rule: u('氣氛最重要：店裡佈置得越漂亮，客人越多；不夠漂亮的話很少人進來。客人會坐很久（桌子要夠），小費大方。愛點甜品、奶蓋和鮮奶茶。', 'Ambience is everything: the lovelier the room, the more people come in, and a plain room draws very few. Guests sit a long time (you need the tables) and tip well. They love desserts, cheese foam and fresh milk tea.'),
    mods: { foot: 1.1, price: 1.5, tip: 1.4, patience: 1.2, stay: 1.7, amb: 3 }, favs: has('dessert', 'foam', 'latte'),
    goal: { n: 6, test: (p, score) => (p.cat === 'dessert' || p.cat === 'foam') && score >= 75, text: (n) => u(`賣出 ${n} 份 75 分以上的甜品或奶蓋`, `Sell ${n} desserts or cheese foams scoring 75+`) },
    souv: { id: 'eiffel', zh: '艾菲爾鐵塔模型', en: 'Eiffel Tower model', cost: 0, amb: 8, spot: 'floor' },
    look: { pave: '#8a8478', paveLine: 'rgba(40,35,30,0.4)', cobble: true, kerb: '#c8c0b0', road: '#5a5650', rides: ['bike', 'scooter', 'car'], view: 'paris' },
  },
  {
    id: 'nyc', flag: '🇺🇸', name: u('紐約・曼哈頓', 'New York · Manhattan'), street: u('5th Ave', '5th Ave'), rep: 1500, cost: 12000, rent: 500,
    about: u('全世界最忙的街：人潮不斷，每個人都在趕時間。', 'The busiest street in the world: a never-ending crowd, and everyone is in a hurry.'),
    rule: u('人超多但超沒耐心，很多人外帶。租金很貴，但價錢高、小費也給很多。愛點奶蓋、特調和奶茶。', 'Huge crowds with no patience at all, and many want it to go. The rent is steep, but prices are high and people tip big. They love cheese foam, specials and milk tea.'),
    mods: { foot: 2, appeal: 1.05, price: 1.6, tip: 1.6, patience: 0.55, toGo: 0.6 }, favs: has('foam', 'special', 'milk'),
    goal: { n: 20, test: () => true, text: (n) => u(`一天服務 ${n} 位客人`, `Serve ${n} guests in a day`) },
    souv: { id: 'neon', zh: '霓虹招牌', en: 'Neon sign', cost: 0, amb: 8, spot: 'wall' },
    look: { pave: '#b8b4ac', paveLine: 'rgba(70,70,70,0.3)', slabs: true, kerb: '#d8d4cc', road: '#3a3a3e', lines: '#f0d030', rides: ['taxi', 'taxi', 'car'], view: 'nyc' },
  },
];
export const PLACE = Object.fromEntries(PLACES.map((p) => [p.id, p]));
export const placeOf = (id) => PLACE[id] || PLACES[0];
export const SOUVENIRS = PLACES.map((p) => ({ ...p.souv, from: p.id }));
export const STAMPS = 3;   // finish a city's daily challenge this many times and its souvenir is yours, for every shop

// the things that only happen in one city
const C = (zh, en, rep, money, chance, rz, re) => ({ zh, en, rep, money, chance, rz, re });
const LOCAL = {
  bangkok: [
    ['停電的夜市', 'A blackout at the market', '🔦', '整條夜市突然停電，大家都拿出手機照明。', 'The whole market loses power; everyone switches on their phone torches.', [C('點蠟燭繼續營業', 'Light candles and keep going', 4, 60, 0.8, '燭光下的茶館超浪漫，客人拍了好多照片', 'The candlelit teahouse looked lovely; guests took lots of photos'), C('先休息一下', 'Take a short break', 1, 0, 1, '大家一起等電來，聊得很開心', 'Everyone waited together and had a good chat')]],
    ['嘟嘟車司機', 'The tuk-tuk drivers', '🛺', '一群嘟嘟車司機收工了，想喝點冰的。', 'A group of tuk-tuk drivers have finished for the night and want something cold.', [C('請他們喝檸檬茶', 'Treat them to lemon tea', 4, -40, 1, '他們開始幫你介紹客人', 'Now they bring tourists your way'), C('給他們團體折扣', 'Give them a group discount', 2, 60, 1, '他們說會常來', 'They say they’ll be back')]],
    ['熱帶大雨', 'A tropical downpour', '⛈️', '十分鐘內下了超大的雨，攤販都擠到你的屋簷下。', 'A huge downpour in ten minutes: the stall holders crowd under your awning.', [C('讓他們躲雨，送熱茶', 'Let them shelter, and hand out hot tea', 5, -30, 1, '雨停後大家都來捧場', 'When it stopped they all came back to buy'), C('趁機推出雨天特價', 'Run a rainy-day offer', 2, 80, 0.8, '賣得不錯', 'It sold well')]],
  ],
  tokyo: [
    ['完美主義的常客', 'A perfectionist regular', '🎌', '一位老先生每天都來，今天說：「冰塊比昨天少了一顆。」', 'An old gentleman who comes every day says: “One ice cube fewer than yesterday.”', [C('鞠躬道歉，重新做一杯', 'Bow, apologise and remake it', 5, -20, 1, '他點點頭：「這才對。」', 'He nods: “That’s right.”'), C('解釋今天的冰比較大', 'Explain today’s ice is bigger', 2, 0, 0.6, '他想了一下，接受了', 'He thought about it and accepted')]],
    ['美食節目採訪', 'A TV food show', '📺', '一個美食節目想來拍你的店，但要你一個小時內準備好。', 'A TV food show wants to film your shop, but you have an hour to get ready.', [C('全員大掃除，準備招牌品', 'Clean everything and prepare your best', 6, 100, 0.8, '播出後外面排了一條長龍', 'After it aired there was a long queue outside'), C('婉拒，今天太忙了', 'Decline: too busy today', 1, 0, 1, '他們說下次再來', 'They’ll come another time')]],
    ['櫻花季', 'Cherry blossom season', '🌸', '附近的櫻花開了，很多人來賞花。', 'The cherry trees nearby are in bloom and crowds come to see them.', [C('推出櫻花限定杯', 'Launch a blossom-season cup', 5, 120, 0.8, '大家都買來配櫻花拍照', 'Everyone bought one to photograph with the blossom'), C('做賞花便當外帶', 'Make hanami boxes to go', 4, 150, 0.7, '一下就賣完了', 'They sold out at once')]],
  ],
  london: [
    ['下午茶的堅持', 'The afternoon tea purist', '🫖', '一位英國紳士說：「奶要先倒還是後倒？這很重要。」', 'An English gentleman asks: “Milk in first or after? It matters.”', [C('說：茶先，奶後', 'Say: tea first, then milk', 4, 30, 0.8, '他滿意地點頭：「正確。」', 'He nods: “Correct.”'), C('問他喜歡哪一種', 'Ask which he prefers', 3, 20, 1, '你們聊了半小時的茶', 'You talked about tea for half an hour')]],
    ['足球賽散場', 'The football crowd', '⚽', '附近球場散場，一大群球迷唱著歌走過來。', 'The match next door has finished and a crowd of fans comes singing down the street.', [C('播他們的隊歌歡迎', 'Play their team’s song', 4, 120, 0.7, '他們買了好多奶茶慶祝', 'They bought heaps of milk tea to celebrate'), C('先把門口顧好', 'Keep an eye on the door', 2, 40, 1, '平安無事，也賣了一些', 'All calm, and you sold a few')]],
    ['雨傘被拿錯', 'The wrong umbrella', '☂️', '一位客人拿錯了別人的黑雨傘，兩把長得一模一樣。', 'A guest has taken someone else’s black umbrella: the two look exactly alike.', [C('追出去換回來', 'Run after them and swap back', 4, 0, 1, '兩位客人都謝謝你', 'Both guests thanked you'), C('借一把店裡的傘', 'Lend one of the shop’s', 3, -20, 1, '隔天他還傘時又帶了朋友來', 'Next day he brought it back with friends')]],
  ],
  paris: [
    ['巴黎的美食評論家', 'A Paris critic', '🎩', '一位評論家坐下來，看著菜單皺眉頭：「你們的甜點呢？」', 'A critic sits down and frowns at the menu: “And your desserts?”', [C('端上最拿手的甜品', 'Bring out your best dessert', 6, 80, 0.7, '他寫道：「左岸的驚喜。」', 'He wrote: “A Left Bank surprise.”'), C('介紹台灣的茶文化', 'Tell him about Taiwanese tea', 4, 40, 0.9, '他聽得津津有味', 'He listened, fascinated')]],
    ['露天座位許可', 'A terrace permit', '📜', '市政府說你可以申請擺露天座位，但要付一筆費用。', 'The city says you can apply to put tables on the pavement, for a fee.', [C('申請！巴黎就是要露天座', 'Apply: Paris means terraces', 5, -150, 1, '客人很愛坐在外面看街景', 'Guests love sitting out watching the street'), C('先不要', 'Not now', 0, 0, 1, '你省下了錢', 'You saved the money')]],
    ['街頭畫家', 'A street painter', '🎨', '一位街頭畫家想畫你的店，畫完要掛在店裡。', 'A street painter wants to paint your shop, and hang the picture inside.', [C('請他喝茶，讓他畫', 'Give him tea and let him paint', 5, -20, 1, '那幅畫讓好多人駐足', 'The painting stops passers-by in their tracks'), C('付錢買下那幅畫', 'Buy the painting', 4, -100, 1, '掛起來，店裡更有氣氛了', 'Hung up, it makes the room lovelier')]],
  ],
  nyc: [
    ['上班族的大訂單', 'The office rush', '💼', '對面大樓有人要 20 杯外帶，十分鐘後開會。', 'Someone in the tower opposite wants 20 to go: their meeting is in ten minutes.', [C('全員衝刺做完', 'Everyone sprints to make them', 4, 260, 0.7, '準時送到，他們之後每週都訂', 'Delivered on time: now they order every week'), C('老實說要二十分鐘', 'Say honestly it takes twenty minutes', 2, 120, 1, '他們等了，還是很滿意', 'They waited and were happy')]],
    ['網紅來打卡', 'An influencer drops in', '📱', '一位有百萬粉絲的網紅想拍你們的招牌飲料。', 'An influencer with a million followers wants to film your signature drink.', [C('親手做一杯給她拍', 'Make one for her by hand', 6, 100, 0.8, '影片爆紅，店門口排起長隊', 'The video went viral and the queue went round the block'), C('給她免費喝，但不特別招待', 'Give it free, no special fuss', 2, 0, 1, '她說「還不錯」', 'She said it was “pretty good”')]],
    ['半夜還想喝', 'Open late?', '🌃', '這城市不睡覺，有客人問你能不能開到半夜。', 'The city never sleeps: a guest asks if you can stay open till midnight.', [C('今天開晚一點', 'Stay open later today', 3, 180, 0.8, '夜貓子們很捧場', 'The night owls came out in force'), C('準時打烊休息', 'Close on time and rest', 1, 0, 1, '明天精神更好', 'You’re fresher tomorrow')]],
  ],
};
export const LOCAL_EVENTS = Object.entries(LOCAL).flatMap(([place, list]) => list.map(([zh, en, icon, sz, se, opts], i) => ({ id: `local_${place}_${i}`, kind: 'choice', place, icon, who: u(zh, en), line: u(sz, se), opts })));
// little flags, drawn (Windows shows flag emoji as two letters)
const FLAG = {
  taipei: '<rect width="30" height="20" fill="#d8262a"/><rect width="15" height="10" fill="#1a3a8a"/><circle cx="7.5" cy="5" r="2.6" fill="#fff"/>',
  bangkok: '<rect width="30" height="20" fill="#d8262a"/><rect y="3.3" width="30" height="13.4" fill="#fff"/><rect y="6.7" width="30" height="6.6" fill="#24306a"/>',
  tokyo: '<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#c8102e"/>',
  london: '<rect width="30" height="20" fill="#1a2a6a"/><path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0L30 20M30 0L0 20" stroke="#c8102e" stroke-width="1.4"/><path d="M15 0V20M0 10H30" stroke="#fff" stroke-width="6"/><path d="M15 0V20M0 10H30" stroke="#c8102e" stroke-width="3.4"/>',
  paris: '<rect width="10" height="20" fill="#1a3a8a"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#d8262a"/>',
  nyc: '<rect width="30" height="20" fill="#fff"/>' + [0, 2, 4, 6, 8, 10, 12].map((k) => `<rect y="${k * 20 / 13}" width="30" height="${20 / 13}" fill="#c8102e"/>`).join('') + '<rect width="13" height="10.8" fill="#24306a"/>',
};
export const flagSvg = (id) => `<svg class="flag" viewBox="0 0 30 20" width="24" height="16" aria-hidden="true">${FLAG[id] || FLAG.taipei}</svg>`;
