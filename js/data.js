// What the teahouse sells and how each thing is made; the furniture and decorations; the texts in both languages.
// A recipe is a list of steps done at the counter, in order. Step kinds:
//   pick   choose the right base (tea leaves, syrup, noodles…) from the shelf          { kind, item }
//   steep  hold to brew / cook; release inside the target zone (0..1 of the meter)      { kind, item, target, tol }
//   scoop  add an ingredient a number of times                                          { kind, item, n }
//   pour   hold to pour; stop at the line (0..1 of the cup)                             { kind, item, target, tol }
//   shake  shake it a number of times (0 means: don't!)                                 { kind, n }
//   serve  seal / plate it and hand it over                                             { kind }
export const ITEMS = {
  black: { zh: '紅茶葉', en: 'Black tea', color: '#8a4a22', shelf: 'leaf' }, green: { zh: '綠茶葉', en: 'Green tea', color: '#7a9a3a', shelf: 'leaf' }, oolong: { zh: '鐵觀音', en: 'Tieguanyin', color: '#7a5a2a', shelf: 'leaf' },
  melon: { zh: '冬瓜露', en: 'Winter melon syrup', color: '#b8803a', shelf: 'leaf' }, noodle: { zh: '麵條', en: 'Noodles', color: '#e8d08a', shelf: 'leaf' }, braise: { zh: '滷汁', en: 'Braising sauce', color: '#5a2a1a', shelf: 'leaf' },
  pearl: { zh: '珍珠', en: 'Tapioca pearls', color: '#3a2418', shelf: 'jar' }, sugar: { zh: '糖漿', en: 'Syrup', color: '#e8c070', shelf: 'jar' }, brown: { zh: '黑糖', en: 'Brown sugar', color: '#6a3a1a', shelf: 'jar' },
  ice: { zh: '冰塊', en: 'Ice', color: '#d8eef8', shelf: 'jar' }, lemon: { zh: '檸檬', en: 'Lemon', color: '#f0d848', shelf: 'jar' }, passion: { zh: '百香果', en: 'Passion fruit', color: '#e8a030', shelf: 'jar' },
  taro: { zh: '芋泥', en: 'Taro paste', color: '#b898c8', shelf: 'jar' }, tofu: { zh: '豆干', en: 'Tofu', color: '#a8784a', shelf: 'jar' }, egg: { zh: '滷蛋', en: 'Egg', color: '#c8905a', shelf: 'jar' }, scallion: { zh: '蔥花', en: 'Scallions', color: '#6ab04a', shelf: 'jar' },
  milk: { zh: '鮮奶', en: 'Milk', color: '#f8f2e4', shelf: 'pour' }, water: { zh: '熱水', en: 'Hot water', color: '#cfe4ee', shelf: 'pour' }, tea: { zh: '茶湯', en: 'Tea', color: '#b0702a', shelf: 'pour' }, sauce: { zh: '麻醬', en: 'Sesame sauce', color: '#a8784a', shelf: 'pour' },
};
export const PRODUCTS = [
  { id: 'melon', zh: '冬瓜茶', en: 'Winter melon tea', price: 35, cost: 10, kind: 'drink', unlock: 0, layers: ['#c89048'],
    steps: [{ kind: 'pick', item: 'melon' }, { kind: 'scoop', item: 'ice', n: 2 }, { kind: 'pour', item: 'water', target: 0.8, tol: 0.12 }, { kind: 'shake', n: 6 }, { kind: 'serve' }] },
  { id: 'boba', zh: '珍珠奶茶', en: 'Bubble milk tea', price: 60, cost: 18, kind: 'drink', unlock: 0, layers: ['#c8925a'], pearls: true,
    steps: [{ kind: 'pick', item: 'black' }, { kind: 'steep', item: 'black', target: 0.62, tol: 0.12 }, { kind: 'scoop', item: 'pearl', n: 2 }, { kind: 'scoop', item: 'sugar', n: 3 }, { kind: 'pour', item: 'milk', target: 0.75, tol: 0.1 }, { kind: 'scoop', item: 'ice', n: 2 }, { kind: 'shake', n: 10 }, { kind: 'serve' }] },
  { id: 'lemon', zh: '檸檬綠茶', en: 'Lemon green tea', price: 50, cost: 14, kind: 'drink', unlock: 300, layers: ['#c8c060'],
    steps: [{ kind: 'pick', item: 'green' }, { kind: 'steep', item: 'green', target: 0.45, tol: 0.1 }, { kind: 'scoop', item: 'lemon', n: 2 }, { kind: 'scoop', item: 'sugar', n: 2 }, { kind: 'scoop', item: 'ice', n: 3 }, { kind: 'shake', n: 12 }, { kind: 'serve' }] },
  { id: 'braise', zh: '滷味拼盤', en: 'Braised platter', price: 65, cost: 20, kind: 'food', unlock: 500, dish: 'braise',
    steps: [{ kind: 'pick', item: 'braise' }, { kind: 'scoop', item: 'tofu', n: 3 }, { kind: 'scoop', item: 'egg', n: 1 }, { kind: 'steep', item: 'braise', target: 0.7, tol: 0.1 }, { kind: 'scoop', item: 'scallion', n: 1 }, { kind: 'serve' }] },
  { id: 'passion', zh: '百香綠茶', en: 'Passion fruit green tea', price: 55, cost: 16, kind: 'drink', unlock: 800, layers: ['#e0a838'], seeds: true,
    steps: [{ kind: 'pick', item: 'green' }, { kind: 'steep', item: 'green', target: 0.45, tol: 0.1 }, { kind: 'scoop', item: 'passion', n: 2 }, { kind: 'scoop', item: 'sugar', n: 2 }, { kind: 'scoop', item: 'ice', n: 3 }, { kind: 'shake', n: 10 }, { kind: 'serve' }] },
  { id: 'noodle', zh: '功夫麵', en: 'Kung fu noodles', price: 80, cost: 22, kind: 'food', unlock: 1200, dish: 'noodle',
    steps: [{ kind: 'pick', item: 'noodle' }, { kind: 'steep', item: 'noodle', target: 0.55, tol: 0.1 }, { kind: 'pour', item: 'sauce', target: 0.35, tol: 0.1 }, { kind: 'scoop', item: 'egg', n: 1 }, { kind: 'scoop', item: 'scallion', n: 2 }, { kind: 'serve' }] },
  { id: 'tgy', zh: '鐵觀音拿鐵', en: 'Tieguanyin latte', price: 70, cost: 20, kind: 'drink', unlock: 1800, layers: ['#a87a4a', '#efe4cc'],
    steps: [{ kind: 'pick', item: 'oolong' }, { kind: 'steep', item: 'oolong', target: 0.78, tol: 0.08 }, { kind: 'scoop', item: 'sugar', n: 1 }, { kind: 'scoop', item: 'ice', n: 1 }, { kind: 'pour', item: 'milk', target: 0.85, tol: 0.08 }, { kind: 'shake', n: 8 }, { kind: 'serve' }] },
  { id: 'taro', zh: '芋頭鮮奶', en: 'Taro milk', price: 70, cost: 22, kind: 'drink', unlock: 2600, layers: ['#c8b0d8', '#f4eef4'],
    steps: [{ kind: 'scoop', item: 'taro', n: 2 }, { kind: 'scoop', item: 'sugar', n: 1 }, { kind: 'scoop', item: 'ice', n: 2 }, { kind: 'pour', item: 'milk', target: 0.85, tol: 0.08 }, { kind: 'shake', n: 8 }, { kind: 'serve' }] },
  { id: 'brownboba', zh: '黑糖珍珠鮮奶', en: 'Brown sugar boba milk', price: 85, cost: 24, kind: 'drink', unlock: 3600, layers: ['#f4ecdc'], pearls: true, stripes: true,
    steps: [{ kind: 'scoop', item: 'brown', n: 2 }, { kind: 'scoop', item: 'pearl', n: 3 }, { kind: 'scoop', item: 'ice', n: 1 }, { kind: 'pour', item: 'milk', target: 0.8, tol: 0.08 }, { kind: 'shake', n: 0 }, { kind: 'serve' }] },
];
// the room grows: each size has seats for more tables
export const SIZES = [
  { zh: '巷口小店', en: 'Alley stall', tables: 2, cost: 0, w: 1 },
  { zh: '一間店面', en: 'A shopfront', tables: 4, cost: 1500, w: 1 },
  { zh: '打通隔壁', en: 'Next door too', tables: 6, cost: 5000, w: 2 },
  { zh: '加蓋二樓', en: 'An upper floor', tables: 9, cost: 15000, w: 3 },
];
export const TABLES = [
  { id: 'wood2', zh: '木頭方桌', en: 'Wooden table', seats: 2, cost: 200, amb: 1 },
  { id: 'round4', zh: '圓桌', en: 'Round table', seats: 4, cost: 600, amb: 2 },
  { id: 'tatami', zh: '和室矮桌', en: 'Low tea table', seats: 4, cost: 1400, amb: 5 },
];
export const DECOR = [
  { id: 'lantern', zh: '紅燈籠', en: 'Red lanterns', cost: 150, amb: 3, spot: 'ceil' },
  { id: 'plant', zh: '盆栽', en: 'Potted plant', cost: 120, amb: 2, spot: 'floor' },
  { id: 'scroll', zh: '書法掛軸', en: 'Calligraphy scroll', cost: 300, amb: 4, spot: 'wall' },
  { id: 'teaset', zh: '茶具展示櫃', en: 'Tea set cabinet', cost: 500, amb: 6, spot: 'wall' },
  { id: 'umbrella', zh: '油紙傘', en: 'Paper umbrella', cost: 260, amb: 3, spot: 'wall' },
  { id: 'fish', zh: '金魚缸', en: 'Goldfish bowl', cost: 400, amb: 5, spot: 'floor' },
  { id: 'screen', zh: '木屏風', en: 'Wooden screen', cost: 700, amb: 7, spot: 'floor' },
  { id: 'radio', zh: '老收音機', en: 'Old radio', cost: 350, amb: 4, spot: 'wall' },
];
export const WALLS = [{ id: 'cream', zh: '米色牆', en: 'Cream wall', c: '#e8d4ae', cost: 0 }, { id: 'brick', zh: '紅磚牆', en: 'Red brick', c: '#b86a4a', cost: 800 }, { id: 'jade', zh: '青瓷綠', en: 'Celadon', c: '#a8c0a0', cost: 800 }, { id: 'wood', zh: '木板牆', en: 'Wood panels', c: '#a87848', cost: 1200 }];
export const FLOORS = [{ id: 'plank', zh: '木地板', en: 'Wood planks', c: '#c89a62', cost: 0 }, { id: 'tile', zh: '磨石子', en: 'Terrazzo', c: '#c8c0b0', cost: 900 }, { id: 'red', zh: '紅地磚', en: 'Red tiles', c: '#b8644a', cost: 900 }];
export const UPGRADES = [
  { id: 'staff', zh: '請店員', en: 'Hire staff', max: 4, cost: (n) => 600 * (n + 1) },
  { id: 'gear', zh: '升級設備', en: 'Better equipment', max: 4, cost: (n) => 900 * (n + 1) },
  { id: 'sign', zh: '招牌廣告', en: 'Signboard & ads', max: 4, cost: (n) => 500 * (n + 1) },
];

export const TX = {
  zh: {
    title: '巷口茶館', sub: 'ALLEY TEAHOUSE', tag: '開一間老派茶館：照食譜親手做出及格的飲料才能上架，賺錢擴店、佈置，和朋友互相拜訪', play: '開店', name: '你的名字', shopName: '茶館名字', defShop: (n) => `${n}的茶館`,
    money: '錢', rep: '口碑', day: (d) => `第 ${d} 天`, open: '營業中', closed: '打烊', nextDay: '開門營業', summary: '今日結算', sold: '賣出', earned: '收入', costs: '成本', tips: '小費', guests: '客人', profit: '淨賺',
    menu: '菜單', kitchen: '研發', shop: '擴店', decor: '佈置', street: '茶街', locked: (n) => `口碑 ${n} 解鎖`, learn: '研發', learned: '已上架', best: (s) => `最佳 ${s} 分`, test: '試做', retry: '再做一次',
    recipe: '食譜', steps: '步驟', score: '分數', pass: '及格！上架販賣', fail: '不及格，再試一次', grade: (s) => s >= 90 ? '完美！' : s >= 75 ? '很好喝' : s >= 60 ? '及格' : '不及格',
    tools: { pick: '拿取', steep: '沖泡', scoop: '加料', pour: '倒入', shake: '搖', serve: '封口出杯', serveFood: '裝盤上菜' }, steepFood: '烹煮', hold: '按住', release: '放開', shakeIt: '搖一搖！', reset: '倒掉重來', next: '下一步',
    judge: { wrongItem: (a, b) => `拿錯了：要 ${a}，你拿了 ${b}`, missing: (a) => `少了：${a}`, extra: (a) => `多加了：${a}`, order: '順序不對', tooLong: (a) => `${a}太久了`, tooShort: (a) => `${a}不夠久`, tooMuch: (a) => `${a}太多`, tooLittle: (a) => `${a}太少`, shook: '這杯不能搖！', perfect: '完美！' },
    buy: '購買', owned: '已擁有', place: '放這裡', slot: '空位', expand: '擴建', size: '店面', tables: '桌子', seats: (n) => `${n} 人座`, walls: '牆面', floors: '地板', items: '擺設', upgrades: '升級', level: (n) => `等級 ${n}`, amb: '氣氛', noMoney: '錢不夠',
    special: (o) => `特別點單：${o}`, makeIt: '我來做', bonus: (n) => `小費 +${n}`, sweet: ['無糖', '微糖', '半糖', '少糖', '全糖'], iceL: ['去冰', '微冰', '少冰', '正常冰'],
    online: '茶街（線上）', visit: '拜訪', like: '👍 讚', liked: '已按讚', youGotLike: (n) => `${n} 來你的茶館按了讚！口碑 +5、錢 +50`, nobody: '現在茶街上沒有其他人，叫朋友上線吧！', back: '回到我的茶館', visiting: (n) => `參觀：${n}`, rank: '排行榜', you: '你', connecting: '連線中…',
    help: '<b>研發</b>：在「研發」照著食譜親手做，每一步都要做對（拿對材料、沖泡時間落在綠色區、加料次數、倒到線）。60 分以上才能上架。<br><b>營業</b>：客人自己來，店員會照你最好的分數做給客人，分數越高賣越貴、小費越多。有特別點單時可以自己做，拿大筆小費。<br><b>擴店</b>：賺的錢可以買桌子、擴大店面、請店員、升級設備、打廣告。<br><b>佈置</b>：牆面、地板、燈籠、盆栽、掛軸……氣氛越好，客人越多也越大方。<br><b>茶街</b>：線上看到其他玩家的茶館，去拜訪、按讚。',
    newDay: '新的一天開始了！', reputationUp: (n) => `口碑 +${n}`, unlockedNew: (n) => `可以研發新品：${n}`, saved: '已存檔', lang: 'English',
  },
  en: {
    title: 'Alley Teahouse', sub: '巷口茶館', tag: 'Run an old-style teahouse: make each drink by hand from its recipe until it passes before you can sell it; grow, decorate, and visit friends online', play: 'Open the shop', name: 'Your name', shopName: 'Teahouse name', defShop: (n) => `${n}'s Teahouse`,
    money: 'Money', rep: 'Reputation', day: (d) => `Day ${d}`, open: 'Open', closed: 'Closed', nextDay: 'Open for the day', summary: 'End of the day', sold: 'Sold', earned: 'Sales', costs: 'Ingredients', tips: 'Tips', guests: 'Guests', profit: 'Profit',
    menu: 'Menu', kitchen: 'Kitchen', shop: 'Expand', decor: 'Decorate', street: 'Tea Street', locked: (n) => `Unlocks at ${n} reputation`, learn: 'Learn it', learned: 'On the menu', best: (s) => `Best ${s}`, test: 'Make it', retry: 'Make it again',
    recipe: 'Recipe', steps: 'Steps', score: 'Score', pass: 'Passed! It’s on the menu', fail: 'Not a pass yet: try again', grade: (s) => s >= 90 ? 'Perfect!' : s >= 75 ? 'Delicious' : s >= 60 ? 'A pass' : 'Not yet',
    tools: { pick: 'Take', steep: 'Brew', scoop: 'Add', pour: 'Pour', shake: 'Shake', serve: 'Seal & serve', serveFood: 'Plate & serve' }, steepFood: 'Cook', hold: 'Hold', release: 'Let go', shakeIt: 'Shake it!', reset: 'Tip it out', next: 'Next',
    judge: { wrongItem: (a, b) => `Wrong one: it needs ${a}, you took ${b}`, missing: (a) => `Missing: ${a}`, extra: (a) => `Extra: ${a}`, order: 'Out of order', tooLong: (a) => `${a}: too long`, tooShort: (a) => `${a}: not long enough`, tooMuch: (a) => `${a}: too much`, tooLittle: (a) => `${a}: too little`, shook: 'This one must not be shaken!', perfect: 'Perfect!' },
    buy: 'Buy', owned: 'Owned', place: 'Put it here', slot: 'Empty spot', expand: 'Expand', size: 'Shop', tables: 'Tables', seats: (n) => `${n} seats`, walls: 'Walls', floors: 'Floors', items: 'Decorations', upgrades: 'Upgrades', level: (n) => `Level ${n}`, amb: 'Ambience', noMoney: 'Not enough money',
    special: (o) => `Special order: ${o}`, makeIt: 'I’ll make it', bonus: (n) => `Tip +${n}`, sweet: ['no sugar', '¼ sugar', 'half sugar', '¾ sugar', 'full sugar'], iceL: ['no ice', 'a little ice', 'less ice', 'regular ice'],
    online: 'Tea Street (online)', visit: 'Visit', like: '👍 Like', liked: 'Liked', youGotLike: (n) => `${n} visited and liked your teahouse! Reputation +5, money +50`, nobody: 'Nobody else is on Tea Street right now: get a friend online!', back: 'Back to my teahouse', visiting: (n) => `Visiting: ${n}`, rank: 'Leaderboard', you: 'you', connecting: 'Connecting…',
    help: '<b>Kitchen</b>: make each item by hand from its recipe: take the right base, brew so the meter stops in the green, add the right number of scoops, pour to the line. 60 or more and it goes on the menu.<br><b>Business</b>: guests come in by themselves; your staff make what they order at the quality of your best attempt, so better scores sell for more and earn bigger tips. Make special orders yourself for a big tip.<br><b>Expand</b>: spend your earnings on tables, a bigger shop, staff, equipment and advertising.<br><b>Decorate</b>: walls, floors, lanterns, plants, scrolls… better ambience brings more, and more generous, guests.<br><b>Tea Street</b>: see other players’ teahouses online, visit them and give a like.',
    newDay: 'A new day begins!', reputationUp: (n) => `Reputation +${n}`, unlockedNew: (n) => `New item to learn: ${n}`, saved: 'Saved', lang: '中文',
  },
};
