// What the teahouse sells and how each thing is really made; the furniture and decorations; the texts in both languages.
// The recipes follow how a Taiwanese tea shop does it: teas brewed at their own water temperature and time and then
// strained, sugar syrup by the pump, measured pours into the shaker, ice by the scoop, shaken, sealed. A recipe is a
// list of steps in order; steps marked w: 1 go "with" the step before them (in a real shop their order doesn't matter).
//   pick   take the right base (tea leaves, noodles, the braising pot)                 { kind, item }
//   heat   hold to heat the water; let go at the temperature                           { kind, item: 'water', target °C, tol }
//   steep  hold to brew / cook; let go at the time                                     { kind, item, min, tol (minutes) }
//   scoop  add an ingredient a number of times (pumps, scoops, pieces)                 { kind, item, n }
//   pour   hold to pour; stop at the line                                              { kind, item, ml, tol }
//   do     a hand step: strain the leaves, drain the noodles, swirl the cup…           { kind, item }
//   shake  shake it a number of times (0 means: don't!)                                { kind, n }
//   serve  seal / plate it and hand it over                                            { kind }
import { MORE, generate, assignUnlocks, CATS } from './menu.js?v=5';
export { CATS };
const u = (zh, en) => ({ zh, en });
export const ITEMS = {
  // bases
  black: { zh: '紅茶葉（阿薩姆）', en: 'Black tea (Assam)', color: '#7a3a1a', brew: '#9a4a1e', shelf: 'leaf', for: 'drink' },
  green: { zh: '茉莉綠茶葉', en: 'Jasmine green tea', color: '#6a8a3a', brew: '#c8b44a', shelf: 'leaf', for: 'drink' },
  oolong: { zh: '鐵觀音茶葉', en: 'Tieguanyin oolong', color: '#5a4a22', brew: '#a8682a', shelf: 'leaf', for: 'drink' },
  noodle: { zh: '陽春麵條', en: 'Wheat noodles', color: '#e8d08a', shelf: 'leaf', for: 'food', boil: true },
  braise: { zh: '滷汁鍋', en: 'Braising pot', color: '#4a2214', shelf: 'leaf', for: 'food' },
  water: { zh: '水', en: 'Water', color: '#cfe4ee', shelf: 'none' },
  // jars: by the scoop, pump or piece
  pearl: { zh: '珍珠', en: 'Tapioca pearls', color: '#3a2418', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 30 },
  bpearl: { zh: '黑糖珍珠', en: 'Brown sugar pearls', color: '#4a2410', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 35 },
  sugar: { zh: '果糖', en: 'Sugar syrup', color: '#f0d890', shelf: 'jar', for: 'drink', unit: u('壓', 'pump'), vol: 10 },
  ice: { zh: '冰塊', en: 'Ice', color: '#d8eef8', shelf: 'jar', for: 'drink', unit: u('杓', 'scoop'), vol: 60 },
  lemon: { zh: '現擠檸檬', en: 'Fresh lemon', color: '#f0d848', shelf: 'jar', for: 'drink', unit: u('次（半顆）', 'halves'), vol: 15 },
  passion: { zh: '百香果肉', en: 'Passion fruit pulp', color: '#e8a030', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 20 },
  taro: { zh: '芋泥', en: 'Taro paste', color: '#b898c8', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 40 },
  tofu: { zh: '豆干', en: 'Dried tofu', color: '#a8784a', shelf: 'jar', for: 'food', unit: u('塊', 'pieces') },
  kelp: { zh: '海帶', en: 'Kelp knots', color: '#3a4a2a', shelf: 'jar', for: 'food', unit: u('個', 'knots') },
  egg: { zh: '滷蛋', en: 'Braised egg', color: '#b8804a', shelf: 'jar', for: 'food', unit: u('顆', 'egg') },
  sesame: { zh: '芝麻醬', en: 'Sesame paste', color: '#c8945a', shelf: 'jar', for: 'food', unit: u('匙', 'spoons') },
  soy: { zh: '醬油', en: 'Soy sauce', color: '#3a1a0e', shelf: 'jar', for: 'food', unit: u('匙', 'spoon') },
  vinegar: { zh: '烏醋', en: 'Black vinegar', color: '#2a140c', shelf: 'jar', for: 'food', unit: u('匙', 'spoon') },
  garlic: { zh: '蒜泥', en: 'Minced garlic', color: '#f0e8c8', shelf: 'jar', for: 'food', unit: u('匙', 'spoon') },
  cucumber: { zh: '小黃瓜絲', en: 'Cucumber strips', color: '#7ab04a', shelf: 'jar', for: 'food', unit: u('撮', 'handful') },
  scallion: { zh: '蔥花', en: 'Spring onion', color: '#5aa040', shelf: 'jar', for: 'food', unit: u('撮', 'pinch') },
  // pours (ml a second while held)
  tea: { zh: '茶湯', en: 'Brewed tea', color: '#9a4a1e', shelf: 'pour', for: 'drink', rate: 120 },
  milk: { zh: '鮮奶', en: 'Fresh milk', color: '#f8f2e4', shelf: 'pour', for: 'drink', rate: 120 },
  creamer: { zh: '奶精', en: 'Creamer', color: '#f0e2c4', shelf: 'pour', for: 'drink', rate: 40 },
  melon: { zh: '冬瓜露', en: 'Winter melon syrup', color: '#b8803a', shelf: 'pour', for: 'drink', rate: 70 },
  cold: { zh: '冷開水', en: 'Cold water', color: '#d8ecf4', shelf: 'pour', for: 'drink', rate: 130 },
  juice: { zh: '滷汁', en: 'Braising liquid', color: '#5a2a14', shelf: 'pour', for: 'food', rate: 30 },
  // hand steps
  strain: { zh: '濾掉茶葉', en: 'Strain out the leaves', color: '#8a6a40', shelf: 'do', for: 'drink', why: u('茶葉一直泡著會越來越苦澀', 'leaves left in keep steeping and turn it bitter') },
  swirl: { zh: '轉杯掛糖', en: 'Swirl to coat the cup', color: '#6a3a1a', shelf: 'do', for: 'drink', why: u('沒有讓黑糖掛在杯壁，就沒有虎紋', 'without coating the cup there are no tiger stripes') },
  smear: { zh: '芋泥抹杯壁', en: 'Smear taro on the cup', color: '#a888b8', shelf: 'do', for: 'drink', why: u('芋泥沒抹開，會沉成一坨', 'unspread taro sinks into one lump') },
  drain: { zh: '撈起瀝乾', en: 'Lift out and drain', color: '#c8b080', shelf: 'do', for: 'food', why: u('沒瀝乾，麵水會把醬沖淡', 'undrained water thins the sauce') },
  cut: { zh: '切塊', en: 'Cut up', color: '#8a8a90', shelf: 'do', for: 'food', why: u('沒切開，客人很難夾', 'uncut, it is hard to eat with chopsticks') },
  toss: { zh: '拌勻', en: 'Toss it all', color: '#b8904a', shelf: 'do', for: 'food', why: u('沒拌勻，醬都沉在碗底', 'untossed, the sauce sits at the bottom') },
};
const n = (zh, en) => ({ zh, en });
const HAND = [
  { id: 'melon', cat: 'special', hand: 1, zh: '冬瓜茶', en: 'Winter melon tea', short: '冬瓜茶', price: 35, cost: 10, kind: 'drink', unlock: 0, layers: ['#c08840'],
    about: n('冬瓜和二砂糖熬成的冬瓜糖磚，早上先加水煮成冬瓜露。點單時兌冷開水、加冰搖勻。冬瓜露本身就甜，不另外加糖。', 'Winter melon is cooked down with cane sugar into blocks, boiled with water each morning into syrup. To order: syrup, cold water, ice, shake. The syrup is already sweet: no extra sugar.'),
    steps: [{ kind: 'pour', item: 'melon', ml: 100, tol: 18 }, { kind: 'pour', item: 'cold', ml: 300, tol: 35, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 10 }, { kind: 'serve' }] },
  { id: 'boba', cat: 'milk', hand: 1, zh: '珍珠奶茶', en: 'Bubble milk tea', short: '珍奶', price: 60, cost: 18, kind: 'drink', unlock: 0, layers: ['#c8925a'], pearls: true,
    about: n('台灣經典：阿薩姆紅茶用 95°C 的水泡 8 分鐘，濾掉茶葉。雪克杯裡加果糖、紅茶、奶精和冰塊搖勻，倒進放了珍珠的杯子封膜。珍珠是早上先煮好、泡在糖水裡的。', 'The Taiwanese classic: Assam black tea brewed 8 minutes at 95°C, leaves strained out. Syrup, tea, creamer and ice shaken together and poured over the pearls, then sealed. The pearls are cooked each morning and kept in syrup.'),
    steps: [{ kind: 'pick', item: 'black' }, { kind: 'heat', item: 'water', target: 95, tol: 4, w: 1, note: n('紅茶用接近沸騰的水，才泡得出香氣', 'black tea needs near-boiling water for its aroma') }, { kind: 'steep', item: 'black', min: 8, tol: 1.5 }, { kind: 'do', item: 'strain' },
      { kind: 'scoop', item: 'pearl', n: 2 }, { kind: 'scoop', item: 'sugar', n: 4, w: 1 }, { kind: 'pour', item: 'tea', ml: 250, tol: 30, w: 1 }, { kind: 'pour', item: 'creamer', ml: 50, tol: 12, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 10 }, { kind: 'serve' }] },
  { id: 'lemon', cat: 'fruit', hand: 1, zh: '檸檬綠茶', en: 'Lemon green tea', short: '檸檬綠', price: 50, cost: 14, kind: 'drink', unlock: 300, layers: ['#d8c858'], lemon: true,
    about: n('茉莉綠茶要用 80°C 的水泡，太燙會苦澀。加現擠檸檬汁和果糖，加冰搖勻。', 'Jasmine green tea is brewed at 80°C: hotter turns it bitter. Fresh-squeezed lemon and syrup, ice, shake.'),
    steps: [{ kind: 'pick', item: 'green' }, { kind: 'heat', item: 'water', target: 80, tol: 4, w: 1, note: n('綠茶怕燙：80°C 就好', 'green tea scalds easily: 80°C is right') }, { kind: 'steep', item: 'green', min: 8, tol: 1.5 }, { kind: 'do', item: 'strain' },
      { kind: 'scoop', item: 'sugar', n: 4 }, { kind: 'scoop', item: 'lemon', n: 2, w: 1 }, { kind: 'pour', item: 'tea', ml: 300, tol: 35, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 12 }, { kind: 'serve' }] },
  { id: 'braise', cat: 'braise', hand: 1, zh: '滷味拼盤', en: 'Braised platter', short: '滷味', price: 65, cost: 20, kind: 'food', unlock: 500, dish: 'braise',
    about: n('豆干、海帶、滷蛋前一晚就滷好了。點單時放回滷汁鍋裡熱 3 分鐘（回滷），撈起切塊裝盤，淋一點滷汁、撒蔥花。', 'Tofu, kelp and eggs are braised the night before. To order: back into the pot for 3 minutes to heat through, then cut, plate, spoon over a little of the liquid and add spring onion.'),
    steps: [{ kind: 'pick', item: 'braise' }, { kind: 'scoop', item: 'tofu', n: 2 }, { kind: 'scoop', item: 'kelp', n: 2, w: 1 }, { kind: 'scoop', item: 'egg', n: 1, w: 1 }, { kind: 'steep', item: 'braise', min: 3, tol: 0.8 }, { kind: 'do', item: 'cut' },
      { kind: 'pour', item: 'juice', ml: 30, tol: 10 }, { kind: 'scoop', item: 'scallion', n: 1, w: 1 }, { kind: 'serve' }] },
  { id: 'passion', cat: 'fruit', hand: 1, zh: '百香綠茶', en: 'Passion fruit green tea', short: '百香綠', price: 55, cost: 16, kind: 'drink', unlock: 800, layers: ['#e0a838'], seeds: true,
    about: n('80°C 泡的茉莉綠茶，加新鮮百香果肉（連籽）和果糖，加冰搖勻。', 'Jasmine green tea brewed at 80°C with fresh passion fruit pulp, seeds and all, and syrup; ice, shake.'),
    steps: [{ kind: 'pick', item: 'green' }, { kind: 'heat', item: 'water', target: 80, tol: 4, w: 1 }, { kind: 'steep', item: 'green', min: 8, tol: 1.5 }, { kind: 'do', item: 'strain' },
      { kind: 'scoop', item: 'sugar', n: 3 }, { kind: 'scoop', item: 'passion', n: 2, w: 1 }, { kind: 'pour', item: 'tea', ml: 300, tol: 35, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 10 }, { kind: 'serve' }] },
  { id: 'noodle', cat: 'dry', hand: 1, zh: '麻醬麵', en: 'Sesame noodles', short: '麻醬麵', price: 70, cost: 18, kind: 'food', unlock: 1200, dish: 'noodle',
    about: n('水滾了（100°C）才下麵，煮 3 分鐘撈起瀝乾。碗裡放芝麻醬、醬油、烏醋、蒜泥，麵放進去拌勻，最後鋪上小黃瓜絲。', 'Noodles go in only once the water boils (100°C); 3 minutes, then lift out and drain. Sesame paste, soy sauce, black vinegar and garlic in the bowl, toss the noodles through, cucumber strips on top.'),
    steps: [{ kind: 'heat', item: 'water', target: 100, tol: 3, note: n('水沒滾就下麵，麵會糊', 'noodles in before the boil go gluey') }, { kind: 'pick', item: 'noodle', w: 1 }, { kind: 'steep', item: 'noodle', min: 3, tol: 0.8 }, { kind: 'do', item: 'drain' },
      { kind: 'scoop', item: 'sesame', n: 2 }, { kind: 'scoop', item: 'soy', n: 1, w: 1 }, { kind: 'scoop', item: 'vinegar', n: 1, w: 1 }, { kind: 'scoop', item: 'garlic', n: 1, w: 1 }, { kind: 'do', item: 'toss' }, { kind: 'scoop', item: 'cucumber', n: 1 }, { kind: 'serve' }] },
  { id: 'tgy', cat: 'latte', hand: 1, zh: '鐵觀音拿鐵', en: 'Tieguanyin latte', short: '鐵觀音', price: 70, cost: 20, kind: 'drink', unlock: 1800, layers: ['#b88a5a'],
    about: n('鐵觀音是焙火的球狀烏龍，要用滾水（100°C）才泡得開。泡 8 分鐘濾掉茶葉，加鮮奶、果糖、冰塊搖勻。', 'Tieguanyin is a roasted, rolled oolong: only boiling water (100°C) opens the leaves. 8 minutes, strain, then fresh milk, syrup and ice, shaken.'),
    steps: [{ kind: 'pick', item: 'oolong' }, { kind: 'heat', item: 'water', target: 100, tol: 3, w: 1, note: n('球狀烏龍要滾水才泡得開', 'rolled oolong needs boiling water to unfurl') }, { kind: 'steep', item: 'oolong', min: 8, tol: 1.5 }, { kind: 'do', item: 'strain' },
      { kind: 'scoop', item: 'sugar', n: 3 }, { kind: 'pour', item: 'tea', ml: 200, tol: 25, w: 1 }, { kind: 'pour', item: 'milk', ml: 150, tol: 22, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 8 }, { kind: 'serve' }] },
  { id: 'taro', cat: 'special', hand: 1, zh: '芋頭鮮奶', en: 'Taro milk', short: '芋鮮奶', price: 70, cost: 22, kind: 'drink', unlock: 2600, layers: ['#ece2f0'], stripes: '#a888c0',
    about: n('芋頭蒸熟、加糖壓成芋泥（已經有甜味）。芋泥抹在杯壁上，加冰塊、倒鮮奶。不要搖，才看得到紫色的紋路、吃得到芋頭顆粒。', 'Taro is steamed and mashed with sugar (so it is already sweet). Smear it up the cup, add ice and pour in fresh milk. Never shake it: that keeps the purple streaks and the taro bits.'),
    steps: [{ kind: 'scoop', item: 'taro', n: 2 }, { kind: 'do', item: 'smear' }, { kind: 'scoop', item: 'ice', n: 2 }, { kind: 'pour', item: 'milk', ml: 350, tol: 35, w: 1 }, { kind: 'shake', n: 0 }, { kind: 'serve' }] },
  { id: 'brownboba', cat: 'special', hand: 1, zh: '黑糖珍珠鮮奶', en: 'Brown sugar boba milk', short: '黑糖珍', price: 85, cost: 24, kind: 'drink', unlock: 3600, layers: ['#f4ecdc'], pearls: true, stripes: '#6e3c14',
    about: n('珍珠用黑糖慢火炒煮到濃稠。舀進杯子後轉杯，讓黑糖掛在杯壁上做出虎紋，再加冰塊、倒鮮奶。不加茶、不搖。', 'Pearls simmered down in brown sugar until thick. Into the cup, swirl so the syrup coats the sides (the tiger stripes), then ice and fresh milk. No tea, no shaking.'),
    steps: [{ kind: 'scoop', item: 'bpearl', n: 3 }, { kind: 'do', item: 'swirl' }, { kind: 'scoop', item: 'ice', n: 2 }, { kind: 'pour', item: 'milk', ml: 300, tol: 30, w: 1 }, { kind: 'shake', n: 0 }, { kind: 'serve' }] },
];
Object.assign(ITEMS, MORE);
const GEN = generate(ITEMS, new Set([...HAND.map((p) => p.id), 'fruit_lemon_green', 'fruit_passion_green', 'milk_black_pearl', 'latte_oolong', 'latte_barley_grass', 'latte_buckwheat_grass']));
assignUnlocks(GEN);
export const PRODUCTS = [...HAND, ...GEN];

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
  { id: 'cat', zh: '養一隻店貓', en: 'Adopt a shop cat', max: 1, cost: () => 800 },
];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

export const TX = {
  zh: {
    title: '巷口茶館', sub: 'ALLEY TEAHOUSE', tag: '開一間老派茶館：照食譜親手做出及格的飲料才能上架，賺錢擴店、佈置，和朋友互相拜訪', play: '開店', name: '你的名字', shopName: '茶館名字', defShop: (n) => `${n}的茶館`,
    money: '錢', rep: '口碑', day: (d) => `第 ${d} 天`, open: '營業中', closed: '打烊', nextDay: '開門營業', summary: '今日結算', sold: '賣出', earned: '收入', costs: '成本', tips: '小費', guests: '客人', profit: '淨賺',
    menu: '菜單', kitchen: '研發', shop: '擴店', decor: '佈置', street: '茶街', locked: (n) => `口碑 ${n} 解鎖`, learn: '研發', learned: '已上架', best: (s) => `最佳 ${s} 分`, test: '試做', retry: '再做一次',
    recipe: '食譜', steps: '步驟', score: '分數', pass: '及格！上架販賣', fail: '不及格，再試一次', grade: (s) => s >= 90 ? '完美！' : s >= 75 ? '很好喝' : s >= 60 ? '及格' : '不及格',
    tools: { pick: '拿取', heat: '煮水', steep: '沖泡', cook: '烹煮', scoop: '加料', pour: '倒入', do: '手作', shake: '搖', serve: '封膜出杯', serveFood: '裝盤上菜' },
    hold: '按住', reset: '倒掉重來', youDid: '你做了', anyOrder: '同一框裡的步驟，順序不拘',
    d: { pick: (n) => `拿 ${n}`, heat: (t) => `煮水到 ${t}°C`, brew: (m) => `沖泡 ${m} 分鐘`, noodle: (m, n) => `下${n || '麵'}煮 ${m} 分鐘`, cook: (n, m) => `${n}：${m} 分鐘`, braise: (m) => `回滷 ${m} 分鐘`, scoop: (n, c, u) => `加 ${n} ${c} ${u}`, pour: (n, ml) => `倒 ${n} ${ml} ml`, shake: (n) => `搖 ${n} 下`, noShake: '不要搖！' },
    unitMin: '分鐘', needTea: '還沒泡茶，沒有茶湯可以倒', needBase: '先拿材料', needPot: '先拿滷汁鍋', full: '滿了！',
    judge: {
      wrongItem: (a, b) => `拿錯了：要${a}，你拿了${b}`, missing: (a, why) => `少了：${a}${why ? `（${why}）` : ''}`, extra: (a) => `多做了：${a}`, order: '順序不對', perfect: '完美！',
      hot: (v, t) => `水溫 ${v}°C 太燙（要 ${t}°C）：茶會苦澀`, cool: (v, t) => `水溫 ${v}°C 太低（要 ${t}°C）：泡不出味道`, boil: (v) => `水才 ${v}°C 還沒滾，麵會糊`,
      bitter: (v, t) => `泡了 ${v} 分鐘太久（要 ${t}）：會苦澀`, weak: (v, t) => `只泡 ${v} 分鐘（要 ${t}）：茶味太淡`,
      mushy: (v, t) => `麵煮了 ${v} 分鐘太久（要 ${t}）：軟爛了`, raw: (v, t) => `麵只煮 ${v} 分鐘（要 ${t}）：麵心還硬`,
      salty: (v, t) => `回滷 ${v} 分鐘太久（要 ${t}）：太鹹太乾`, cookLong: (v, t, why) => `${v} 分鐘太久（要 ${t}）：${why}`, cookShort: (v, t, why) => `只有 ${v} 分鐘（要 ${t}）：${why}`, coldFood: (v, t) => `只回滷 ${v} 分鐘（要 ${t}）：還沒熱透`,
      pourMore: (n, v, t) => `${n}倒太多（${v} ml，要 ${t} ml）`, pourLess: (n, v, t) => `${n}倒太少（${v} ml，要 ${t} ml）`,
      scoopMore: (n, a, b, u) => `${n}太多（${a} ${u}，要 ${b} ${u}）`, scoopLess: (n, a, b, u) => `${n}太少（${a} ${u}，要 ${b} ${u}）`,
      shakeMore: (a, b) => `搖了 ${a} 下太久（要 ${b}）：冰塊化了，味道變淡`, shakeLess: (a, b) => `只搖 ${a} 下（要 ${b}）：沒搖勻也不夠冰`, shook: '這杯不能搖！一搖紋路就糊掉了',
    },
    buy: '購買', owned: '已擁有', place: '放這裡', slot: '空位', expand: '擴建', size: '店面', tables: '桌子', seats: (n) => `${n} 人座`, walls: '牆面', floors: '地板', items: '擺設', upgrades: '升級', level: (n) => `等級 ${n}`, amb: '氣氛', noMoney: '錢不夠',
    special: (o) => `特別點單：${o}`, makeIt: '我來做', bonus: (n) => `小費 +${n}`, sweet: ['無糖', '微糖', '半糖', '少糖', '全糖'], iceL: ['去冰', '微冰', '少冰', '正常冰'], takeaway: '外帶',
    online: '茶街（線上）', visit: '拜訪', like: '👍 讚', liked: '已按讚', youGotLike: (n) => `${n} 來你的茶館按了讚！口碑 +5、錢 +50`, nobody: '現在茶街上沒有其他人，叫朋友上線吧！', back: '回到我的茶館', visiting: (n) => `參觀：${n}`, rank: '排行榜', you: '你', connecting: '連線中…',
    help: '<b>研發</b>：照著食譜親手做，就像真的茶飲店：拿對茶葉、煮水到對的溫度（綠茶 80°C、紅茶 95°C、烏龍 100°C）、泡對時間、濾掉茶葉、果糖按壓數、倒到線、加冰、搖勻（有些千萬不能搖）。框在一起的步驟順序不拘。60 分以上才能上架。<br><b>營業</b>：路人經過會走進門口，在櫃台排隊點餐，再找位子坐；店員收銀、做飲料、端到桌上、收桌子。也有外帶的客人。有特別點單（半糖少冰…）時點客人可以自己做，拿大筆小費。<br><b>擴店</b>：買桌子、擴大店面、請店員、升級設備、打廣告，還可以養一隻店貓。<br><b>佈置</b>：牆面、地板、燈籠、盆栽、掛軸……氣氛越好，客人越多也越大方。<br><b>茶街</b>：線上看到其他玩家的茶館，去拜訪、按讚。<br><b>事件</b>：每天會冒出幾件事：有人挑戰你、米其林秘密客、奧客、客人問問題、人潮、大訂單……不理也沒關係，做了就能加口碑和錢。',
    learnedOf: (a, b) => `已上架 ${a} / ${b}`, firstHint: '開店前，先親手做出一杯及格的飲料！從冬瓜茶開始吧。', all: '全部', search: '搜尋品項', kf: { open: '可以研發', learned: '已上架', locked: '未解鎖', all: '全部' }, none: '沒有符合的品項',
    stTabs: { shops: '🏮 茶館', chat: '💬 聊天', rank: '🏆 排行', notes: '📮 留言板', friends: '💛 好友' }, gift: '送禮', duel: '料理對決', friendAdd: '加好友',
    chatEmpty: '還沒有人說話，打個招呼吧！', chatSay: '在茶街上說點什麼…', send: '送出', slowDown: '慢一點～',
    rankBy: { rep: '口碑', money: '財富', learned: '研發數', perfect: '滿分品項', sold: '總銷量' }, rankNote: '排行榜是現在在線上的茶館。',
    notesEmpty: '還沒有人留言。朋友來拜訪時可以在你的留言板寫字。', friendsEmpty: '還沒有好友。在「茶館」分頁按 🤍 加好友，他們上線時會通知你。', outbox: (n) => `有 ${n} 則留言或禮物等對方上線就會送到`,
    giftTo: (n) => `送禮給 ${n}`, gifts: { red100: '小紅包', red500: '大紅包', teabox: '茶葉禮盒', basket: '開幕花籃' }, giftWhat: { red100: '對方收到 NT$100', red500: '對方收到 NT$500', teabox: '對方口碑 +5', basket: '擺在對方店門口兩天，口碑 +3' },
    giftLater: '對方現在不在線上：禮物會在他上線時送到。', giftQueued: '對方不在線上，上線時會收到禮物', giftSent: (g) => `${g} 送出了！`,
    noteTo: (n) => `在 ${n} 的留言板寫字`, notePh: '寫點什麼給茶館主人…', noteQueued: '對方不在線上，上線時會收到留言', noteSent: '留言送出了！',
    duelAsk: (n, p) => `向 ${n} 下戰帖：兩個人同時做「${p}」，分數高的贏！`, duelWait: '等對方接受…', duelYours: (s) => `你做了 ${s} 分！`, duelWaitOther: (n) => `等 ${n} 做完…`,
    duelWin: '你贏了！🏆', duelTie: '平手！', duelLose: '差一點！下次再來', duelPrize: '口碑 +10、NT$100', duelFrom: (n, p) => `${n} 向你下戰帖：比賽做「${p}」！`, duelDeclined: '對方婉拒了這次對決。', yes: '接受挑戰', no: '下次吧',
    friendOn: (n) => `💛 好友 ${n} 上線了`, friendIn: (n) => `💛 ${n} 來你的茶館坐坐了！`, friendOrdered: (n, p) => `💛 ${n} 點了 ${p}：點他親手做，或讓店員做`, servedYou: (s, p, sc) => `${s} 做好了你的 ${p}：${sc} 分`,
    gotGift: (n, g) => `🎁 ${n} 送你 ${g}！`, gotNote: (n) => `📮 ${n} 在你的留言板寫了字`, orderOne: '點一杯', orderAt: (n) => `在 ${n} 點餐`, youOrdered: (p) => `你點了 ${p}，等老闆做…`, friendLabel: '朋友點的',
    vipLabel: '貴賓', rushDone: (n, b) => `🎉 人潮過了！這段時間賣出 ${n} 份，口碑 +${b}`,
    ev: { kinds: { make: '挑戰', vip: '貴賓', choice: '狀況', quiz: '問答', rush: '人潮', order: '大訂單' }, go: { make: '接受挑戰', vip: '準備迎接', rush: '準備好了！', order: '接下訂單' }, skip: '略過',
      make: (p, n, sp) => `做一份「${p}」${sp ? `（${sp}）` : ''}，要 ${n} 分以上。`, order: (n, p, s) => `要訂 ${n} 份「${p}」！先做一份樣品，${s} 分以上就成交。`,
      vip: (w) => `${w}要來了！他頭上會有名字，點他，親手做他點的東西，評價會更好。`, secret: (w) => `聽說今天有${w}會來，但他不會說自己是誰…仔細看看哪位客人在偷偷做筆記📓，點他、親手做給他！`,
      rush: (m) => `接下來會有一大群人（約 ${m} 倍）！準備好就按下去，這段時間賣越多口碑越高。`,
      won: (w, s) => `🏆 ${w}：「${s} 分，佩服！」`, short: (s, n) => `差一點！${s} 分（要 ${n}），對方說下次再來挑戰`, orderDone: (w, n, p) => `📦 ${w}的 ${n} 份${p}做好送出了！`,
      vipIn: (w, p) => `🌟 ${w}來了，點了「${p}」`, secretIn: '🕵️ 有位客人看起來不太一樣…', found: (w) => `🕵️ 被你發現了！原來是${w}！`, vipWin: (w, s) => `🌟 ${w}吃完說：「${s} 分！」`, vipMissed: (w, s) => `${w}吃完離開了（${s} 分）。下次親手做會更好！`,
      rushOn: (w) => `🏃 ${w}，客人湧進來了！`, meh: '事情沒有想像中順利，不過客人還是謝謝你。', right: '答對了！', wrong: (a) => `正確答案是「${a}」。`, today: (n) => `今日事件 ${n} 件` },
    newDay: '新的一天開始了！', reputationUp: (n) => `口碑 +${n}`, unlockedNew: (n) => `可以研發新品：${n}`, saved: '已存檔', lang: 'English',
    say: {
      welcome: () => pick(['歡迎光臨～', '歡迎光臨！', '你好，歡迎～']), thanks: () => pick(['謝謝光臨！', '謝謝，再來喔～', '慢走～']),
      order: (name, sp, food, to) => `${food ? '一份' : '一杯'}${name}${sp ? '，' + sp : ''}${to ? '，外帶' : ''}`,
      here: () => pick(['您的飲料～', '久等了！', '請慢用～']), yum: (pid) => pick(pid === 'boba' || pid === 'brownboba' ? ['珍珠好Q！', '好好喝！', '讚！'] : pid === 'noodle' ? ['好香！', '麻醬好濃～'] : pid === 'braise' ? ['好入味！', '好下飯～'] : ['好好喝！', '好清爽～', '謝謝！']),
      chat: () => pick(['這家很有味道', '下次再來', '今天好熱喔', '哈哈哈', '最近好嗎？', '你看那個燈籠', '我請你！', '好放鬆～']), cheers: '乾杯！', photo: '先拍照📸', bye: () => pick(['掰掰～', '謝謝！', '好好喝，再來！']),
      hello: () => pick(['嗨～', '你好！', '這裡好舒服', '老闆好！']), angry: () => pick(['等太久了…', '算了，不等了']), petCat: () => pick(['好可愛～', '貓貓！']), meow: '喵～', staff: () => pick(['加油！', '馬上來！', '收到～']),
    },
  },
  en: {
    title: 'Alley Teahouse', sub: '巷口茶館', tag: 'Run an old-style teahouse: make each drink by hand from its recipe until it passes before you can sell it; grow, decorate, and visit friends online', play: 'Open the shop', name: 'Your name', shopName: 'Teahouse name', defShop: (n) => `${n}'s Teahouse`,
    money: 'Money', rep: 'Reputation', day: (d) => `Day ${d}`, open: 'Open', closed: 'Closed', nextDay: 'Open for the day', summary: 'End of the day', sold: 'Sold', earned: 'Sales', costs: 'Ingredients', tips: 'Tips', guests: 'Guests', profit: 'Profit',
    menu: 'Menu', kitchen: 'Kitchen', shop: 'Expand', decor: 'Decorate', street: 'Tea Street', locked: (n) => `Unlocks at ${n} reputation`, learn: 'Learn it', learned: 'On the menu', best: (s) => `Best ${s}`, test: 'Make it', retry: 'Make it again',
    recipe: 'Recipe', steps: 'Steps', score: 'Score', pass: 'Passed! It’s on the menu', fail: 'Not a pass yet: try again', grade: (s) => s >= 90 ? 'Perfect!' : s >= 75 ? 'Delicious' : s >= 60 ? 'A pass' : 'Not yet',
    tools: { pick: 'Take', heat: 'Heat water', steep: 'Brew', cook: 'Cook', scoop: 'Add', pour: 'Pour', do: 'By hand', shake: 'Shake', serve: 'Seal & serve', serveFood: 'Plate & serve' },
    hold: 'Hold', reset: 'Tip it out', youDid: 'You did', anyOrder: 'Steps in the same box can go in any order',
    d: { pick: (n) => `Take the ${n}`, heat: (t) => `Heat the water to ${t}°C`, brew: (m) => `Brew ${m} minutes`, noodle: (m, n) => `Cook the ${n ? n.toLowerCase() : 'noodles'} ${m} minutes`, cook: (n, m) => `${n}: ${m} minutes`, braise: (m) => `Reheat in the pot ${m} minutes`, scoop: (n, c, u) => `Add ${n}: ${c} ${u}`, pour: (n, ml) => `Pour ${ml} ml ${n}`, shake: (n) => `Shake ${n} times`, noShake: 'Don’t shake it!' },
    unitMin: 'min', needTea: 'No tea brewed yet: nothing to pour', needBase: 'Take something first', needPot: 'Take the braising pot first', full: 'Full!',
    judge: {
      wrongItem: (a, b) => `Wrong one: it needs ${a}, you took ${b}`, missing: (a, why) => `Missing: ${a}${why ? ` (${why})` : ''}`, extra: (a) => `Extra: ${a}`, order: 'Out of order', perfect: 'Perfect!',
      hot: (v, t) => `Water at ${v}°C is too hot (needs ${t}°C): the tea turns bitter`, cool: (v, t) => `Water at ${v}°C is too cool (needs ${t}°C): no flavour comes out`, boil: (v) => `Water only ${v}°C, not boiling: the noodles go gluey`,
      bitter: (v, t) => `Brewed ${v} min, too long (needs ${t}): bitter`, weak: (v, t) => `Brewed only ${v} min (needs ${t}): weak`,
      mushy: (v, t) => `Noodles cooked ${v} min, too long (needs ${t}): mushy`, raw: (v, t) => `Noodles cooked only ${v} min (needs ${t}): still hard inside`,
      salty: (v, t) => `Reheated ${v} min, too long (needs ${t}): salty and dry`, cookLong: (v, t, why) => `${v} min is too long (needs ${t}): ${why}`, cookShort: (v, t, why) => `Only ${v} min (needs ${t}): ${why}`, coldFood: (v, t) => `Reheated only ${v} min (needs ${t}): not hot through`,
      pourMore: (n, v, t) => `Too much ${n} (${v} ml, needs ${t} ml)`, pourLess: (n, v, t) => `Too little ${n} (${v} ml, needs ${t} ml)`,
      scoopMore: (n, a, b, u) => `Too much ${n} (${a} ${u}, needs ${b})`, scoopLess: (n, a, b, u) => `Too little ${n} (${a} ${u}, needs ${b})`,
      shakeMore: (a, b) => `Shaken ${a} times, too long (needs ${b}): the ice melts and thins it`, shakeLess: (a, b) => `Shaken only ${a} times (needs ${b}): not mixed or cold`, shook: 'This one must not be shaken! It smears the streaks',
    },
    buy: 'Buy', owned: 'Owned', place: 'Put it here', slot: 'Empty spot', expand: 'Expand', size: 'Shop', tables: 'Tables', seats: (n) => `${n} seats`, walls: 'Walls', floors: 'Floors', items: 'Decorations', upgrades: 'Upgrades', level: (n) => `Level ${n}`, amb: 'Ambience', noMoney: 'Not enough money',
    special: (o) => `Special order: ${o}`, makeIt: 'I’ll make it', bonus: (n) => `Tip +${n}`, sweet: ['no sugar', 'light sugar', 'half sugar', 'less sugar', 'full sugar'], iceL: ['no ice', 'light ice', 'less ice', 'regular ice'], takeaway: 'to go',
    online: 'Tea Street (online)', visit: 'Visit', like: '👍 Like', liked: 'Liked', youGotLike: (n) => `${n} visited and liked your teahouse! Reputation +5, money +50`, nobody: 'Nobody else is on Tea Street right now: get a friend online!', back: 'Back to my teahouse', visiting: (n) => `Visiting: ${n}`, rank: 'Leaderboard', you: 'you', connecting: 'Connecting…',
    help: '<b>Kitchen</b>: make each item by hand, the way a real tea shop does: the right leaves, the water at the right temperature (green 80°C, black 95°C, oolong 100°C), the right brewing time, strain the leaves, syrup by the pump, pour to the line, ice, shake (and some must never be shaken). Steps in one box can go in any order. 60 or more and it goes on the menu.<br><b>Business</b>: people walking by come in at the door, queue at the counter to order, then find a seat; your staff take the money, make the drinks, carry them over and clear the tables. Some take theirs to go. Tap a guest with a special order (half sugar, less ice…) to make it yourself for a big tip.<br><b>Expand</b>: tables, a bigger shop, staff, equipment, advertising, and a shop cat.<br><b>Decorate</b>: walls, floors, lanterns, plants, scrolls… better ambience brings more, and more generous, guests.<br><b>Tea Street</b>: see other players’ teahouses online, visit them and give a like.<br><b>Events</b>: a few things happen each day: challengers, a secret Michelin inspector, difficult customers, questions, rushes, big orders… ignore them freely, or take them on for reputation and money.',
    learnedOf: (a, b) => `${a} of ${b} on the menu`, firstHint: 'Before you open, make your first drink by hand and pass! Start with winter melon tea.', all: 'All', search: 'Search', kf: { open: 'Can learn', learned: 'On the menu', locked: 'Locked', all: 'Everything' }, none: 'Nothing matches',
    stTabs: { shops: '🏮 Shops', chat: '💬 Chat', rank: '🏆 Rankings', notes: '📮 Guestbook', friends: '💛 Friends' }, gift: 'Send a gift', duel: 'Recipe duel', friendAdd: 'Add friend',
    chatEmpty: 'Nobody has said anything yet: say hello!', chatSay: 'Say something on Tea Street…', send: 'Send', slowDown: 'Slow down a little~',
    rankBy: { rep: 'Reputation', money: 'Wealth', learned: 'Recipes', perfect: 'Perfect 100s', sold: 'Total sold' }, rankNote: 'Rankings are the teahouses online right now.',
    notesEmpty: 'No notes yet. Friends who visit can write in your guestbook.', friendsEmpty: 'No friends yet. Tap 🤍 in Shops to add one; you will hear when they come online.', outbox: (n) => `${n} note(s) or gift(s) waiting to be delivered when they come online`,
    giftTo: (n) => `A gift for ${n}`, gifts: { red100: 'Small red envelope', red500: 'Big red envelope', teabox: 'Tea gift box', basket: 'Opening flower basket' }, giftWhat: { red100: 'they get NT$100', red500: 'they get NT$500', teabox: 'their reputation +5', basket: 'stands at their door for two days, reputation +3' },
    giftLater: 'They are offline: the gift arrives when they come online.', giftQueued: 'They are offline: it arrives when they come online', giftSent: (g) => `${g} sent!`,
    noteTo: (n) => `Write in ${n}’s guestbook`, notePh: 'A few words for the owner…', noteQueued: 'They are offline: it arrives when they come online', noteSent: 'Note sent!',
    duelAsk: (n, p) => `Challenge ${n}: you both make “${p}” at the same time, the higher score wins!`, duelWait: 'Waiting for them to accept…', duelYours: (s) => `You scored ${s}!`, duelWaitOther: (n) => `Waiting for ${n} to finish…`,
    duelWin: 'You win! 🏆', duelTie: 'A tie!', duelLose: 'So close! Next time', duelPrize: 'Reputation +10, NT$100', duelFrom: (n, p) => `${n} challenges you: make “${p}”!`, duelDeclined: 'They passed on this duel.', yes: 'Accept', no: 'Not now',
    friendOn: (n) => `💛 Your friend ${n} is online`, friendIn: (n) => `💛 ${n} has come to your teahouse!`, friendOrdered: (n, p) => `💛 ${n} ordered ${p}: tap them to make it yourself, or let the staff`, servedYou: (s, p, sc) => `${s} made your ${p}: ${sc}`,
    gotGift: (n, g) => `🎁 ${n} sent you a ${g}!`, gotNote: (n) => `📮 ${n} wrote in your guestbook`, orderOne: 'Order', orderAt: (n) => `Order at ${n}`, youOrdered: (p) => `You ordered ${p}: waiting for the owner…`, friendLabel: 'a friend’s order',
    vipLabel: 'VIP', rushDone: (n, b) => `🎉 The rush is over: ${n} sold, reputation +${b}`,
    ev: { kinds: { make: 'Challenge', vip: 'VIP', choice: 'Situation', quiz: 'Question', rush: 'Rush', order: 'Big order' }, go: { make: 'Accept', vip: 'Get ready', rush: 'Ready!', order: 'Take the order' }, skip: 'Skip',
      make: (p, n, sp) => `Make “${p}”${sp ? ` (${sp})` : ''} scoring ${n} or more.`, order: (n, p, s) => `An order for ${n} × “${p}”! Make one sample; ${s} or more and it’s a deal.`,
      vip: (w) => `${w} is coming! Their name will be over their head: tap them and make their order yourself for a better verdict.`, secret: (w) => `Word is ${w} is coming today, incognito… watch for the guest secretly taking notes 📓, tap them and make it yourself!`,
      rush: (m) => `A crowd is on its way (about ${m}×)! Press when you’re ready: the more you sell, the more reputation.`,
      won: (w, s) => `🏆 ${w}: “${s}! Impressive.”`, short: (s, n) => `So close: ${s} (needed ${n}). They’ll challenge you again`, orderDone: (w, n, p) => `📦 ${n} × ${p} for ${w}, done and delivered!`,
      vipIn: (w, p) => `🌟 ${w} is here and ordered “${p}”`, secretIn: '🕵️ One of the guests seems a little different…', found: (w) => `🕵️ Found you! It’s ${w}!`, vipWin: (w, s) => `🌟 ${w}’s verdict: “${s}!”`, vipMissed: (w, s) => `${w} ate and left (${s}). Next time make it yourself!`,
      rushOn: (w) => `🏃 ${w}: here they come!`, meh: 'It didn’t go quite as hoped, but the guest thanked you anyway.', right: 'Correct!', wrong: (a) => `The answer is “${a}”.`, today: (n) => `${n} events today` },
    newDay: 'A new day begins!', reputationUp: (n) => `Reputation +${n}`, unlockedNew: (n) => `New item to learn: ${n}`, saved: 'Saved', lang: '中文',
    say: {
      welcome: () => pick(['Welcome!', 'Hi, come in!', 'Welcome in~']), thanks: () => pick(['Thank you!', 'See you again!', 'Take care~']),
      order: (name, sp, food, to) => `One ${name}${sp ? ', ' + sp : ''}${to ? ', to go' : ''}, please`,
      here: () => pick(['Here you go~', 'Sorry for the wait!', 'Enjoy~']), yum: (pid) => pick(pid === 'boba' || pid === 'brownboba' ? ['So chewy!', 'Yum!', 'Love it!'] : pid === 'noodle' ? ['Smells great!', 'So nutty~'] : pid === 'braise' ? ['So tasty!', 'Perfect~'] : ['Delicious!', 'So fresh~', 'Thanks!']),
      chat: () => pick(['Nice place', 'Let’s come back', 'So hot today', 'Haha!', 'How’ve you been?', 'Look at the lanterns', 'My treat!', 'So relaxing~']), cheers: 'Cheers!', photo: 'Photo first 📸', bye: () => pick(['Bye~', 'Thanks!', 'Great tea!']),
      hello: () => pick(['Hi~', 'Hello!', 'So cosy here', 'Hi, boss!']), angry: () => pick(['Too long…', 'Forget it']), petCat: () => pick(['So cute~', 'Kitty!']), meow: 'Meow~', staff: () => pick(['On it!', 'Coming up!', 'Got it~']),
    },
  },
};
