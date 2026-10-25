// The big menu: 500 drinks and dishes, built the way a real Taiwanese tea shop and noodle shop build theirs: a few
// real bases (each tea with its own water temperature and brewing time; each noodle with its own cooking time) and
// the ways they are actually served (plain, with creamer, with fresh milk, with cheese foam, with fresh fruit; dry
// noodles with a sauce, noodle soups, rice bowls, braised plates, griddle and steamer snacks, desserts), plus the
// toppings people really put in them. Only real pairings: no milk with citrus (it curdles), no cheese foam on barley.
const u = (zh, en) => ({ zh, en });
const over = (zh, en) => u(zh, en);

// ------------------------------------------------------------------ the extra ingredients
export const MORE = {
  // teas (with the water and the time each one wants)
  fourseason: { zh: '四季春茶葉', en: 'Four Seasons oolong', color: '#6a7a2a', brew: '#d0b858', shelf: 'leaf', for: 'drink' },
  beauty: { zh: '東方美人茶葉', en: 'Oriental Beauty', color: '#8a5a2a', brew: '#c88a3a', shelf: 'leaf', for: 'drink' },
  pouchong: { zh: '文山包種茶葉', en: 'Wenshan Pouchong', color: '#5a7a3a', brew: '#c8c068', shelf: 'leaf', for: 'drink' },
  jinxuan: { zh: '金萱茶葉', en: 'Jin Xuan oolong', color: '#6a8040', brew: '#d4bc60', shelf: 'leaf', for: 'drink' },
  puer: { zh: '普洱茶葉', en: 'Pu’er', color: '#3a2014', brew: '#5a2a14', shelf: 'leaf', for: 'drink' },
  buckwheat: { zh: '韃靼蕎麥', en: 'Tartary buckwheat', color: '#a8783a', brew: '#b8843a', shelf: 'leaf', for: 'drink' },
  barley: { zh: '焙炒大麥', en: 'Roasted barley', color: '#7a4a1e', brew: '#8a5a2a', shelf: 'leaf', for: 'drink' },
  earl: { zh: '伯爵紅茶葉', en: 'Earl Grey', color: '#5a3018', brew: '#8a4a24', shelf: 'leaf', for: 'drink' },
  ruby: { zh: '紅玉紅茶葉（台茶18號）', en: 'Ruby black (TTES 18)', color: '#6a2014', brew: '#8a2a1a', shelf: 'leaf', for: 'drink' },
  honeyblack: { zh: '蜜香紅茶葉', en: 'Honey-scent black', color: '#7a3a18', brew: '#a85a28', shelf: 'leaf', for: 'drink' },
  // toppings and fruit
  boba: { zh: '波霸', en: 'Large boba', color: '#2a1810', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 35 },
  coconut: { zh: '椰果', en: 'Coconut jelly', color: '#f0f0e0', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 30 },
  grass: { zh: '仙草凍', en: 'Grass jelly', color: '#2a2420', shelf: 'jar', for: 'both', unit: u('匙', 'scoop'), vol: 40 },
  pudding: { zh: '雞蛋布丁', en: 'Egg pudding', color: '#f0c860', shelf: 'jar', for: 'drink', unit: u('顆', 'pudding'), vol: 50 },
  redbean: { zh: '蜜紅豆', en: 'Sweet red beans', color: '#8a2a2a', shelf: 'jar', for: 'both', unit: u('匙', 'scoop'), vol: 35 },
  taroball: { zh: '芋圓', en: 'Taro balls', color: '#c8a0c8', shelf: 'jar', for: 'both', unit: u('匙', 'scoop'), vol: 35 },
  aiyu: { zh: '愛玉', en: 'Aiyu jelly', color: '#f0e098', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 40 },
  agar: { zh: '寒天晶球', en: 'Agar crystal boba', color: '#e8f0f0', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 30 },
  honey: { zh: '龍眼蜂蜜', en: 'Longan honey', color: '#e0a030', shelf: 'jar', for: 'drink', unit: u('匙', 'spoon'), vol: 10 },
  grapefruit: { zh: '葡萄柚果粒', en: 'Grapefruit pulp', color: '#e87a6a', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 25 },
  kumquat: { zh: '現擠金桔', en: 'Fresh kumquat', color: '#f0a020', shelf: 'jar', for: 'drink', unit: u('顆', 'kumquats'), vol: 6 },
  pineapple: { zh: '鳳梨果肉', en: 'Pineapple', color: '#f0d050', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 25 },
  mango: { zh: '芒果果泥', en: 'Mango purée', color: '#f0b030', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 30 },
  lychee: { zh: '荔枝果肉', en: 'Lychee', color: '#f4ecd8', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 25 },
  peach: { zh: '水蜜桃果醬', en: 'Peach jam', color: '#f0a888', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 25 },
  strawberry: { zh: '草莓果醬', en: 'Strawberry jam', color: '#d83a4a', shelf: 'jar', for: 'drink', unit: u('匙', 'scoop'), vol: 25 },
  matcha: { zh: '抹茶粉', en: 'Matcha powder', color: '#6a9a3a', shelf: 'jar', for: 'drink', unit: u('匙', 'spoons'), vol: 4 },
  cocoa: { zh: '可可粉', en: 'Cocoa powder', color: '#5a3020', shelf: 'jar', for: 'drink', unit: u('匙', 'spoons'), vol: 4 },
  // pours
  orange: { zh: '現榨柳橙汁', en: 'Fresh orange juice', color: '#f0a030', shelf: 'pour', for: 'drink', rate: 100 },
  plum: { zh: '梅子汁', en: 'Plum juice', color: '#8a3a2a', shelf: 'pour', for: 'drink', rate: 40 },
  yakult: { zh: '養樂多', en: 'Yakult', color: '#f4ecd0', shelf: 'pour', for: 'drink', rate: 60 },
  hot: { zh: '熱水', en: 'Hot water', color: '#e0eef4', shelf: 'pour', for: 'drink', rate: 60 },
  foam: { zh: '鹹奶蓋', en: 'Salted cheese foam', color: '#fff8ec', shelf: 'pour', for: 'drink', rate: 40 },
  brownsyrup: { zh: '黑糖漿', en: 'Brown sugar syrup', color: '#4a2410', shelf: 'pour', for: 'both', rate: 30 },
  // hand steps for drinks
  whisk: { zh: '用茶筅刷開', en: 'Whisk it smooth', color: '#8a9a5a', shelf: 'do', for: 'drink', why: u('抹茶沒刷開會結成小顆粒', 'unwhisked matcha stays in lumps') },
  stir: { zh: '輕輕攪拌', en: 'Stir gently', color: '#b8a080', shelf: 'do', for: 'both', why: u('沒攪拌，料都沉在杯底', 'unstirred, it all sits at the bottom') },

  // ---------------- food: what you cook in or on
  yimian: { zh: '意麵', en: 'Yi mein', color: '#e8c070', shelf: 'leaf', for: 'food', boil: true, over: over('煮太久：意麵糊成一團', 'cooked too long: it turns to mush'), under: over('沒煮開：還是硬的', 'not cooked through: still hard') },
  oilnoodle: { zh: '油麵', en: 'Oil noodles', color: '#f0d060', shelf: 'leaf', for: 'food', boil: true, over: over('油麵本來就熟了，燙太久會爛', 'oil noodles are precooked: too long and they go soft'), under: over('還沒燙熱', 'not heated through') },
  kway: { zh: '粄條', en: 'Flat rice noodles', color: '#f4f0e0', shelf: 'leaf', for: 'food', boil: true, over: over('燙太久：粄條斷成碎片', 'too long: it breaks apart'), under: over('沒燙軟', 'not softened') },
  vermi: { zh: '米粉', en: 'Rice vermicelli', color: '#f4f0e8', shelf: 'leaf', for: 'food', boil: true, over: over('煮太久：米粉軟爛', 'too long: mushy'), under: over('沒煮軟：還有硬芯', 'not soft yet: hard in the middle') },
  glass: { zh: '冬粉', en: 'Glass noodles', color: '#e8eef0', shelf: 'leaf', for: 'food', boil: true, over: over('煮太久：冬粉糊掉', 'too long: they dissolve'), under: over('沒煮透：還白白硬硬', 'not through: still white and stiff') },
  wide: { zh: '手工寬麵', en: 'Hand-cut wide noodles', color: '#ecd498', shelf: 'leaf', for: 'food', boil: true, over: over('煮太久：麵糊了', 'too long: mushy'), under: over('沒煮透：麵心還硬', 'not through: hard in the middle') },
  dpot: { zh: '煮水餃的湯鍋', en: 'Dumpling pot', color: '#9a9aa0', shelf: 'leaf', for: 'food', boil: true, over: over('煮太久：皮破了、餡散了', 'too long: the skins split'), under: over('沒煮熟：餡還是生的', 'not cooked: raw inside') },
  fryer: { zh: '油炸鍋（170°C）', en: 'Fryer (170°C)', color: '#c89030', shelf: 'leaf', for: 'food', over: over('炸太久：太乾、焦了', 'fried too long: dry and burnt'), under: over('沒炸熟：裡面還是生的', 'not fried through: raw inside') },
  griddle: { zh: '鐵板煎台', en: 'Griddle', color: '#5a5a60', shelf: 'leaf', for: 'food', over: over('煎太久：焦黑了', 'on too long: burnt'), under: over('煎不夠：還沒熟、不夠金黃', 'not long enough: pale and not cooked') },
  steamer: { zh: '竹蒸籠', en: 'Bamboo steamer', color: '#c8a060', shelf: 'leaf', for: 'food', over: over('蒸太久：皮塌了、湯汁流光', 'steamed too long: they collapse and lose their soup'), under: over('沒蒸熟：皮還黏、餡是生的', 'not steamed through: doughy and raw') },
  // noodle sauces and toppings
  zhajiang: { zh: '炸醬', en: 'Fried bean sauce', color: '#5a3018', shelf: 'jar', for: 'food', unit: u('杓', 'ladles') },
  rouzao: { zh: '肉燥', en: 'Minced pork sauce', color: '#6a3a1a', shelf: 'jar', for: 'food', unit: u('杓', 'ladles') },
  scallionoil: { zh: '蔥油', en: 'Scallion oil', color: '#c8a040', shelf: 'jar', for: 'food', unit: u('匙', 'spoons') },
  shacha: { zh: '沙茶醬', en: 'Shacha sauce', color: '#8a4a1a', shelf: 'jar', for: 'food', unit: u('匙', 'spoons') },
  chilioil: { zh: '紅油', en: 'Chilli oil', color: '#c83a1a', shelf: 'jar', for: 'food', unit: u('匙', 'spoons') },
  sprouts: { zh: '燙豆芽', en: 'Blanched bean sprouts', color: '#f0f0d0', shelf: 'jar', for: 'food', unit: u('撮', 'handful') },
  cilantro: { zh: '香菜', en: 'Coriander', color: '#4a9a3a', shelf: 'jar', for: 'food', unit: u('撮', 'pinch') },
  pickled: { zh: '酸菜', en: 'Pickled mustard greens', color: '#9a9a3a', shelf: 'jar', for: 'food', unit: u('匙', 'spoon') },
  greens: { zh: '燙青菜', en: 'Blanched greens', color: '#3a8a3a', shelf: 'jar', for: 'food', unit: u('撮', 'handful') },
  beef: { zh: '牛肉塊', en: 'Beef chunks', color: '#7a3a20', shelf: 'jar', for: 'food', unit: u('塊', 'pieces') },
  wonton: { zh: '餛飩', en: 'Wontons', color: '#f0e4c8', shelf: 'jar', for: 'food', unit: u('顆', 'wontons') },
  porkchop: { zh: '排骨', en: 'Pork chop', color: '#b8783a', shelf: 'jar', for: 'food', unit: u('片', 'chop') },
  meatball: { zh: '貢丸', en: 'Pork balls', color: '#c8a888', shelf: 'jar', for: 'food', unit: u('顆', 'balls') },
  zhacai: { zh: '榨菜肉絲', en: 'Pork and zha cai', color: '#a8884a', shelf: 'jar', for: 'food', unit: u('匙', 'spoons') },
  tomato: { zh: '燉番茄', en: 'Stewed tomato', color: '#d84a2a', shelf: 'jar', for: 'food', unit: u('匙', 'spoons') },
  sesamechicken: { zh: '麻油雞肉', en: 'Sesame-oil chicken', color: '#a8683a', shelf: 'jar', for: 'food', unit: u('塊', 'pieces') },
  // broths
  beefbroth: { zh: '紅燒牛肉湯', en: 'Braised beef broth', color: '#8a3a1a', shelf: 'pour', for: 'food', rate: 120 },
  clearbroth: { zh: '清燉牛肉湯', en: 'Clear beef broth', color: '#d8b880', shelf: 'pour', for: 'food', rate: 120 },
  tomatobroth: { zh: '番茄牛肉湯', en: 'Tomato beef broth', color: '#d8603a', shelf: 'pour', for: 'food', rate: 120 },
  porkbroth: { zh: '大骨湯', en: 'Pork bone broth', color: '#ece0c8', shelf: 'pour', for: 'food', rate: 120 },
  sesamebroth: { zh: '麻油雞湯', en: 'Sesame-oil chicken broth', color: '#b8803a', shelf: 'pour', for: 'food', rate: 120 },
  // rice bowls
  rice: { zh: '白飯', en: 'Steamed rice', color: '#f8f6ee', shelf: 'jar', for: 'food', unit: u('碗', 'bowl') },
  lurou: { zh: '滷肉', en: 'Braised minced pork', color: '#6a2a10', shelf: 'jar', for: 'food', unit: u('杓', 'ladles') },
  chicken: { zh: '雞肉絲', en: 'Shredded chicken', color: '#f0dcb0', shelf: 'jar', for: 'food', unit: u('撮', 'handfuls') },
  chickenoil: { zh: '雞油', en: 'Chicken fat', color: '#e8c060', shelf: 'pour', for: 'food', rate: 20 },
  shallot: { zh: '紅蔥酥', en: 'Fried shallots', color: '#b8783a', shelf: 'jar', for: 'food', unit: u('撮', 'pinch') },
  radish: { zh: '黃蘿蔔', en: 'Pickled radish', color: '#f0d040', shelf: 'jar', for: 'food', unit: u('片', 'slices') },
  kongrou: { zh: '控肉', en: 'Braised pork belly', color: '#7a3a18', shelf: 'jar', for: 'food', unit: u('塊', 'slab') },
  drumstick: { zh: '醃好的雞腿', en: 'Marinated drumstick', color: '#c88a4a', shelf: 'jar', for: 'food', unit: u('隻', 'drumstick') },
  mackerel: { zh: '鯖魚', en: 'Mackerel fillet', color: '#8a8a90', shelf: 'jar', for: 'food', unit: u('片', 'fillet') },
  curry: { zh: '咖哩雞', en: 'Chicken curry', color: '#d8a030', shelf: 'jar', for: 'food', unit: u('杓', 'ladles') },
  mapo: { zh: '麻婆豆腐', en: 'Mapo tofu', color: '#c84a2a', shelf: 'jar', for: 'food', unit: u('杓', 'ladles') },
  trotter: { zh: '滷豬腳', en: 'Braised trotter', color: '#8a4a20', shelf: 'jar', for: 'food', unit: u('塊', 'pieces') },
  sanbei: { zh: '三杯雞', en: 'Three-cup chicken', color: '#8a3a18', shelf: 'jar', for: 'food', unit: u('杓', 'ladles') },
  basil: { zh: '九層塔', en: 'Thai basil', color: '#2a7a2a', shelf: 'jar', for: 'food', unit: u('撮', 'pinch') },
  friedegg: { zh: '荷包蛋', en: 'Fried egg', color: '#f8f0d0', shelf: 'jar', for: 'food', unit: u('顆', 'egg') },
  // braised plates
  duckblood: { zh: '鴨血', en: 'Duck blood tofu', color: '#5a1a14', shelf: 'jar', for: 'food', unit: u('塊', 'pieces') },
  baiye: { zh: '百頁豆腐', en: 'Bai ye tofu', color: '#e8d8b0', shelf: 'jar', for: 'food', unit: u('塊', 'pieces') },
  riceblood: { zh: '米血', en: 'Rice blood cake', color: '#3a2420', shelf: 'jar', for: 'food', unit: u('塊', 'pieces') },
  ear: { zh: '豬耳朵', en: 'Pig’s ear', color: '#d8a888', shelf: 'jar', for: 'food', unit: u('片', 'pieces') },
  shank: { zh: '滷牛腱', en: 'Braised beef shank', color: '#6a3020', shelf: 'jar', for: 'food', unit: u('塊', 'piece') },
  soypaste: { zh: '醬油膏', en: 'Thick soy paste', color: '#3a1a0e', shelf: 'pour', for: 'food', rate: 25 },
  // griddle, steamer and dumplings
  rawegg: { zh: '雞蛋', en: 'Egg', color: '#f8e8a0', shelf: 'jar', for: 'food', unit: u('顆', 'egg') },
  cheese: { zh: '起司片', en: 'Cheese slice', color: '#f0c040', shelf: 'jar', for: 'food', unit: u('片', 'slice') },
  corn: { zh: '玉米粒', en: 'Sweetcorn', color: '#f0d040', shelf: 'jar', for: 'food', unit: u('匙', 'spoons') },
  tuna: { zh: '鮪魚', en: 'Tuna', color: '#c8a088', shelf: 'jar', for: 'food', unit: u('匙', 'spoons') },
  ham: { zh: '火腿', en: 'Ham', color: '#e8a0a0', shelf: 'jar', for: 'food', unit: u('片', 'slice') },
  bacon: { zh: '培根', en: 'Bacon', color: '#c86a5a', shelf: 'jar', for: 'food', unit: u('片', 'rashers') },
  floss: { zh: '肉鬆', en: 'Pork floss', color: '#c8904a', shelf: 'jar', for: 'food', unit: u('撮', 'pinch') },
  hashbrown: { zh: '薯餅', en: 'Hash brown', color: '#d8a050', shelf: 'jar', for: 'food', unit: u('片', 'piece') },
  radishcake: { zh: '蘿蔔糕', en: 'Turnip cake', color: '#e8e0c8', shelf: 'jar', for: 'food', unit: u('片', 'slices') },
  scallioncake: { zh: '蔥油餅', en: 'Scallion pancake', color: '#e8c878', shelf: 'jar', for: 'food', unit: u('片', 'pancake') },
  jcabbage: { zh: '高麗菜豬肉水餃', en: 'Cabbage-pork dumplings', color: '#f4f0e4', shelf: 'jar', for: 'food', unit: u('顆', 'dumplings') },
  jleek: { zh: '韭菜豬肉水餃', en: 'Chive-pork dumplings', color: '#eef0e0', shelf: 'jar', for: 'food', unit: u('顆', 'dumplings') },
  jcorn: { zh: '玉米豬肉水餃', en: 'Corn-pork dumplings', color: '#f8f0d8', shelf: 'jar', for: 'food', unit: u('顆', 'dumplings') },
  jshrimp: { zh: '鮮蝦水餃', en: 'Shrimp dumplings', color: '#f8e8e0', shelf: 'jar', for: 'food', unit: u('顆', 'dumplings') },
  gpork: { zh: '豬肉鍋貼', en: 'Pork potstickers', color: '#f0e0c0', shelf: 'jar', for: 'food', unit: u('顆', 'potstickers') },
  gleek: { zh: '韭菜鍋貼', en: 'Chive potstickers', color: '#e8e8c8', shelf: 'jar', for: 'food', unit: u('顆', 'potstickers') },
  splash: { zh: '一碗冷水', en: 'A bowl of cold water', color: '#d8ecf4', shelf: 'jar', for: 'food', unit: u('次', 'times') },
  flourwater: { zh: '麵粉水', en: 'Flour water', color: '#f0ece0', shelf: 'pour', for: 'food', rate: 40 },
  xlb: { zh: '小籠包', en: 'Soup dumplings', color: '#f8f4ec', shelf: 'jar', for: 'food', unit: u('顆', 'dumplings') },
  shumai: { zh: '燒賣', en: 'Shumai', color: '#f0d8a0', shelf: 'jar', for: 'food', unit: u('顆', 'shumai') },
  porkbun: { zh: '鮮肉包', en: 'Pork bun', color: '#f8f4ec', shelf: 'jar', for: 'food', unit: u('顆', 'buns') },
  vegbun: { zh: '高麗菜包', en: 'Vegetable bun', color: '#f4f4e8', shelf: 'jar', for: 'food', unit: u('顆', 'buns') },
  charsiu: { zh: '叉燒包', en: 'Char siu bun', color: '#f8efe4', shelf: 'jar', for: 'food', unit: u('顆', 'buns') },
  zongzi: { zh: '肉粽', en: 'Zongzi', color: '#6a8a3a', shelf: 'jar', for: 'food', unit: u('顆', 'zongzi') },
  guabao: { zh: '刈包皮', en: 'Gua bao bun', color: '#f8f4ec', shelf: 'jar', for: 'food', unit: u('個', 'bun') },
  peanut: { zh: '花生粉', en: 'Peanut sugar powder', color: '#d8a868', shelf: 'jar', for: 'food', unit: u('匙', 'spoon') },
  ginger: { zh: '嫩薑絲', en: 'Ginger shreds', color: '#f0e098', shelf: 'jar', for: 'food', unit: u('撮', 'pinch') },
  // desserts
  douhua: { zh: '豆花', en: 'Tofu pudding', color: '#f8f4e4', shelf: 'jar', for: 'food', unit: u('碗', 'bowl') },
  peanutsoft: { zh: '煮花生', en: 'Stewed peanuts', color: '#e8c898', shelf: 'jar', for: 'food', unit: u('匙', 'spoon') },
  fenyuan: { zh: '粉圓', en: 'Small tapioca', color: '#3a2418', shelf: 'jar', for: 'food', unit: u('匙', 'spoon') },
  mungbean: { zh: '綠豆', en: 'Mung beans', color: '#8aa050', shelf: 'jar', for: 'food', unit: u('匙', 'spoon') },
  barleyseed: { zh: '薏仁', en: 'Job’s tears', color: '#f0e8d8', shelf: 'jar', for: 'food', unit: u('匙', 'spoon') },
  sweetpotato: { zh: '地瓜圓', en: 'Sweet potato balls', color: '#e89a3a', shelf: 'jar', for: 'food', unit: u('匙', 'spoon') },
  fenguo: { zh: '黑糖粉粿', en: 'Brown sugar fen guo', color: '#5a3018', shelf: 'jar', for: 'food', unit: u('匙', 'spoon') },
  mangocube: { zh: '愛文芒果丁', en: 'Irwin mango cubes', color: '#f0a020', shelf: 'jar', for: 'food', unit: u('匙', 'spoons') },
  freshberry: { zh: '大湖草莓', en: 'Dahu strawberries', color: '#d83040', shelf: 'jar', for: 'food', unit: u('顆', 'berries') },
  shaved: { zh: '刨冰', en: 'Shaved ice', color: '#f0f8fc', shelf: 'jar', for: 'food', unit: u('杓', 'scoops') },
  syrup: { zh: '二砂糖水', en: 'Cane sugar syrup', color: '#e8c890', shelf: 'pour', for: 'food', rate: 60 },
  gingersyrup: { zh: '熱薑汁糖水', en: 'Hot ginger syrup', color: '#c8903a', shelf: 'pour', for: 'food', rate: 60 },
  condensed: { zh: '煉乳', en: 'Condensed milk', color: '#f8f0d8', shelf: 'pour', for: 'food', rate: 25 },
  mangosauce: { zh: '芒果醬', en: 'Mango sauce', color: '#f0a020', shelf: 'pour', for: 'food', rate: 30 },
  // hand steps for food
  flip: { zh: '翻面', en: 'Flip it', color: '#8a8a90', shelf: 'do', for: 'food', why: u('沒翻面，一面焦一面生', 'unflipped: burnt on one side, raw on the other') },
  skin: { zh: '蓋上餅皮', en: 'Lay the crepe on', color: '#f0e0b0', shelf: 'do', for: 'food', why: u('沒有餅皮就不是蛋餅了', 'without the crepe it isn’t a dan bing') },
  roll: { zh: '捲起來', en: 'Roll it up', color: '#e0c890', shelf: 'do', for: 'food', why: u('沒捲起來，餡會掉出來', 'unrolled, the filling falls out') },
  shave: { zh: '刨一碗冰', en: 'Shave the ice', color: '#d8ecf4', shelf: 'do', for: 'food', why: u('沒有刨冰怎麼叫冰', 'no ice, no shaved ice') },
  cover: { zh: '蓋鍋蓋燜', en: 'Cover with a lid', color: '#9a9aa0', shelf: 'do', for: 'food', why: u('沒蓋鍋蓋，上面不會熟', 'uncovered, the tops never cook') },
};

// ------------------------------------------------------------------ the bases and how they are served
// teas: temperature, minutes, short name for menus, names for each way of serving
const TEAS = [
  { id: 'black', t: 95, m: 8, zh: '紅茶', en: 'black tea', pure: '紅茶', milk: '奶茶', latte: '鮮奶茶', foam: '奶蓋紅茶', fruit: '紅茶' },
  { id: 'green', t: 80, m: 8, zh: '綠茶', en: 'jasmine green tea', pure: '茉莉綠茶', milk: '奶綠', latte: '鮮奶綠', foam: '奶蓋綠茶', fruit: '綠' },
  { id: 'oolong', t: 100, m: 8, zh: '鐵觀音', en: 'Tieguanyin', pure: '鐵觀音', milk: '鐵觀音奶茶', latte: '鐵觀音拿鐵', foam: '奶蓋鐵觀音' },
  { id: 'fourseason', t: 90, m: 7, zh: '四季春', en: 'Four Seasons oolong', pure: '四季春青茶', milk: '四季春奶茶', latte: '四季春鮮奶茶', foam: '奶蓋四季春', fruit: '青' },
  { id: 'beauty', t: 85, m: 7, zh: '東方美人', en: 'Oriental Beauty', pure: '東方美人茶', milk: '東方美人奶茶', latte: '東方美人拿鐵', foam: '奶蓋東方美人' },
  { id: 'pouchong', t: 85, m: 6, zh: '包種', en: 'Pouchong', pure: '文山包種', milk: '包種奶茶', latte: '包種鮮奶茶', foam: '奶蓋包種', fruit: '包種' },
  { id: 'jinxuan', t: 90, m: 7, zh: '金萱', en: 'Jin Xuan', pure: '金萱茶', milk: '金萱奶茶', latte: '金萱拿鐵', foam: '奶蓋金萱', fruit: '金萱' },
  { id: 'puer', t: 100, m: 8, zh: '普洱', en: 'Pu’er', pure: '普洱茶', milk: '普洱奶茶', latte: '普洱拿鐵', foam: '奶蓋普洱' },
  { id: 'buckwheat', t: 100, m: 6, zh: '蕎麥', en: 'buckwheat tea', pure: '韃靼蕎麥茶', milk: '蕎麥奶茶', latte: '蕎麥鮮奶茶' },
  { id: 'barley', t: 100, m: 10, zh: '麥茶', en: 'barley tea', pure: '古早味麥茶', milk: '麥香奶茶', latte: '麥茶拿鐵' },
  { id: 'earl', t: 95, m: 6, zh: '伯爵', en: 'Earl Grey', pure: '伯爵紅茶', milk: '伯爵奶茶', latte: '伯爵鮮奶茶', foam: '奶蓋伯爵' },
  { id: 'ruby', t: 95, m: 6, zh: '紅玉', en: 'Ruby black tea', pure: '紅玉紅茶', milk: '紅玉奶茶', latte: '紅玉鮮奶茶', foam: '奶蓋紅玉' },
  { id: 'honeyblack', t: 90, m: 7, zh: '蜜香紅茶', en: 'honey-scent black tea', pure: '蜜香紅茶', milk: '蜜香奶茶', latte: '蜜香鮮奶茶', foam: '奶蓋蜜香' },
];
const TOPS = {
  pearl: { zh: '珍珠', en: 'Pearl', n: 2 }, boba: { zh: '波霸', en: 'Boba', n: 2 }, coconut: { zh: '椰果', en: 'Coconut jelly', n: 2 }, grass: { zh: '仙草', en: 'Grass jelly', n: 2 },
  pudding: { zh: '布丁', en: 'Pudding', n: 1 }, redbean: { zh: '紅豆', en: 'Red bean', n: 2 }, taroball: { zh: '芋圓', en: 'Taro ball', n: 2 }, aiyu: { zh: '愛玉', en: 'Aiyu', n: 2 }, agar: { zh: '晶球', en: 'Crystal boba', n: 2 },
};
// fruit: how it goes in, how much sugar it still wants, which teas it is really paired with
const FRUITS = [
  { id: 'lemon', zh: '檸檬', en: 'Lemon', add: { kind: 'scoop', item: 'lemon', n: 2 }, sugar: 4, teas: ['black', 'green', 'fourseason', 'jinxuan', 'pouchong'] },
  { id: 'passion', zh: '百香', en: 'Passion fruit', add: { kind: 'scoop', item: 'passion', n: 2 }, sugar: 3, teas: ['black', 'green', 'fourseason', 'jinxuan'] },
  { id: 'orange', zh: '柳橙', en: 'Orange', add: { kind: 'pour', item: 'orange', ml: 100, tol: 18 }, sugar: 3, teas: ['black', 'green', 'fourseason', 'jinxuan'] },
  { id: 'grapefruit', zh: '葡萄柚', en: 'Grapefruit', add: { kind: 'scoop', item: 'grapefruit', n: 3 }, sugar: 4, teas: ['green', 'fourseason', 'jinxuan'] },
  { id: 'kumquat', zh: '金桔', en: 'Kumquat', add: { kind: 'scoop', item: 'kumquat', n: 4 }, sugar: 4, teas: ['black', 'green', 'fourseason'] },
  { id: 'pineapple', zh: '鳳梨', en: 'Pineapple', add: { kind: 'scoop', item: 'pineapple', n: 2 }, sugar: 3, teas: ['green', 'fourseason'] },
  { id: 'mango', zh: '芒果', en: 'Mango', add: { kind: 'scoop', item: 'mango', n: 2 }, sugar: 2, teas: ['green', 'fourseason'] },
  { id: 'lychee', zh: '荔枝', en: 'Lychee', add: { kind: 'scoop', item: 'lychee', n: 2 }, sugar: 2, teas: ['black', 'green'] },
  { id: 'peach', zh: '水蜜桃', en: 'Peach', add: { kind: 'scoop', item: 'peach', n: 2 }, sugar: 2, teas: ['black', 'green', 'fourseason'] },
  { id: 'strawberry', zh: '草莓', en: 'Strawberry', add: { kind: 'scoop', item: 'strawberry', n: 2 }, sugar: 2, teas: ['green'] },
  { id: 'plum', zh: '梅子', en: 'Plum', add: { kind: 'pour', item: 'plum', ml: 40, tol: 10 }, sugar: 3, teas: ['green', 'fourseason', 'pouchong'] },
  { id: 'yakult', zh: '多多', en: 'Yakult', add: { kind: 'pour', item: 'yakult', ml: 100, tol: 15 }, sugar: 2, teas: ['black', 'green', 'fourseason'] },
  { id: 'honey', zh: '蜂蜜', en: 'Honey', honey: 3, teas: ['black', 'green', 'fourseason'] },
  { id: 'honeylemon', zh: '蜂蜜檸檬', en: 'Honey lemon', add: { kind: 'scoop', item: 'lemon', n: 2 }, honey: 3, teas: ['green', 'fourseason'] },
];
const P = (zh, en) => ({ zh, en });
const brewSteps = (T, w = 1) => [{ kind: 'pick', item: T.id }, { kind: 'heat', item: 'water', target: T.t, tol: T.t >= 100 ? 3 : 4, w }, { kind: 'steep', item: T.id, min: T.m, tol: 1.5 }, { kind: 'do', item: 'strain' }];
const topSteps = (top) => (top ? [{ kind: 'scoop', item: top, n: TOPS[top].n }] : []);
const mixc = (a, b, k) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return '#' + x.map((v, i) => Math.round(v * (1 - k) + y[i] * k).toString(16).padStart(2, '0')).join(''); };

export function generate(ITEMS, taken) {
  const out = [], has = (id) => taken.has(id) || out.some((p) => p.id === id);
  const add = (p) => { if (!has(p.id)) out.push(p); };
  // ---------- teas, plain, with creamer, with fresh milk, with cheese foam
  for (const T of TEAS) {
    const brew = ITEMS[T.id].brew, about = (how) => P(`${ITEMS[T.id].zh}用 ${T.t}°C 的水泡 ${T.m} 分鐘、濾掉茶葉。${how.zh}`, `${ITEMS[T.id].en} brewed ${T.m} minutes at ${T.t}°C and strained. ${how.en}`);
    add({ id: `pure_${T.id}`, cat: 'pure', zh: T.pure, en: cap(T.en), short: T.zh, price: 35, cost: 8, kind: 'drink', layers: [brew], cx: 1,
      about: about(P('加果糖和冰塊搖勻，喝得到茶的原味。', 'Syrup and ice, shaken: all about the tea itself.')),
      steps: [...brewSteps(T), { kind: 'scoop', item: 'sugar', n: 3 }, { kind: 'pour', item: 'tea', ml: 400, tol: 40, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 10 }, { kind: 'serve' }] });
    for (const top of [null, 'pearl', 'boba', 'coconut', 'grass', 'pudding', 'redbean', 'taroball']) {
      const name = (top ? TOPS[top].zh : '') + T.milk;
      add({ id: `milk_${T.id}${top ? '_' + top : ''}`, cat: 'milk', zh: name, en: `${top ? TOPS[top].en + ' ' : ''}${T.en} milk tea`.replace(/^./, (c) => c.toUpperCase()), short: (top ? TOPS[top].zh : '') + T.zh + '奶', price: 50 + (top ? 10 : 0), cost: 14, kind: 'drink', layers: [mixc(brew, '#f0e2c4', 0.55)], tops: top ? [top] : [], cx: 2 + (top ? 1 : 0),
        about: about(P(`加奶精、果糖、冰塊搖勻${top ? `，倒進放了${TOPS[top].zh}的杯子` : ''}。`, `Creamer, syrup and ice shaken together${top ? ` and poured over the ${TOPS[top].en.toLowerCase()}` : ''}.`)),
        steps: [...brewSteps(T), ...topSteps(top), { kind: 'scoop', item: 'sugar', n: 3, w: top ? 1 : 0 }, { kind: 'pour', item: 'tea', ml: 300, tol: 35, w: 1 }, { kind: 'pour', item: 'creamer', ml: 50, tol: 12, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 10 }, { kind: 'serve' }] });
    }
    for (const top of [null, 'pearl', 'boba', 'pudding', 'grass']) {
      add({ id: `latte_${T.id}${top ? '_' + top : ''}`, cat: 'latte', zh: (top ? TOPS[top].zh : '') + T.latte, en: `${top ? TOPS[top].en + ' ' : ''}${T.en} with fresh milk`.replace(/^./, (c) => c.toUpperCase()), short: (top ? TOPS[top].zh : '') + T.zh + '鮮', price: 65 + (top ? 10 : 0), cost: 20, kind: 'drink', layers: [mixc(brew, '#f8f2e4', 0.6)], tops: top ? [top] : [], cx: 3 + (top ? 1 : 0),
        about: about(P(`茶和鮮奶一比一，加果糖、冰塊搖勻${top ? `，倒在${TOPS[top].zh}上` : ''}。鮮奶不耐酸，所以不加水果。`, `Tea and fresh milk half and half, syrup and ice, shaken${top ? `, over the ${TOPS[top].en.toLowerCase()}` : ''}. Fresh milk and fruit acid don’t mix, so no fruit.`)),
        steps: [...brewSteps(T), ...topSteps(top), { kind: 'scoop', item: 'sugar', n: 3, w: top ? 1 : 0 }, { kind: 'pour', item: 'tea', ml: 200, tol: 25, w: 1 }, { kind: 'pour', item: 'milk', ml: 200, tol: 25, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 8 }, { kind: 'serve' }] });
    }
    if (T.foam) add({ id: `foam_${T.id}`, cat: 'foam', zh: T.foam, en: `${cap(T.en)} with cheese foam`, short: '奶蓋' + T.zh, price: 65, cost: 18, kind: 'drink', layers: ['#fff8ec', brew, brew], foam: true, cx: 3,
      about: about(P('茶加果糖、冰塊先搖好，最後慢慢鋪上一層鹹奶蓋。奶蓋倒上去之後就不能再搖，要就著杯口喝、不插吸管。', 'Tea, syrup and ice shaken first, then a layer of salted cheese foam poured gently on top. Never shake after the foam goes on; it is drunk from the rim.')),
      steps: [...brewSteps(T), { kind: 'scoop', item: 'sugar', n: 2 }, { kind: 'pour', item: 'tea', ml: 350, tol: 35, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 10 }, { kind: 'pour', item: 'foam', ml: 60, tol: 15, note: P('奶蓋要最後倒，倒了就不再搖', 'the foam goes on last, and nothing is shaken after') }, { kind: 'serve' }] });
  }
  // ---------- fruit teas, with or without a jelly topping
  for (const F of FRUITS) for (const tid of F.teas) {
    const T = TEAS.find((x) => x.id === tid), base = F.zh + (T.fruit || T.zh), brew = ITEMS[T.id].brew;
    for (const top of [null, 'coconut', 'aiyu']) {
      const sweet = F.honey ? { kind: 'scoop', item: 'honey', n: F.honey } : { kind: 'scoop', item: 'sugar', n: F.sugar };
      add({ id: `fruit_${F.id}_${T.id}${top ? '_' + top : ''}`, cat: 'fruit', zh: (top ? TOPS[top].zh : '') + base, en: `${top ? TOPS[top].en + ' ' : ''}${F.en} ${T.en}`.replace(/^./, (c) => c.toUpperCase()), short: (top ? TOPS[top].zh : '') + F.zh, price: 50 + (top ? 10 : 0) + (F.id === 'mango' || F.id === 'strawberry' ? 10 : 0), cost: 15, kind: 'drink', layers: [mixc(brew, ITEMS[F.add ? F.add.item : 'honey'].color, 0.35)], tops: top ? [top] : [], fruit: F.id, cx: 2 + (top ? 1 : 0) + (F.add && F.add.kind === 'pour' ? 1 : 0),
        about: P(`${ITEMS[T.id].zh}用 ${T.t}°C 泡 ${T.m} 分鐘、濾掉茶葉，加${F.add ? ITEMS[F.add.item].zh : ''}${F.honey ? '蜂蜜（用蜂蜜代替果糖）' : '和果糖'}、冰塊，用力搖勻${top ? `，加${TOPS[top].zh}` : ''}。水果茶不加奶：酸會讓奶結塊。`, `${ITEMS[T.id].en} brewed ${T.m} minutes at ${T.t}°C, strained; ${F.add ? ITEMS[F.add.item].en.toLowerCase() + ', ' : ''}${F.honey ? 'honey instead of syrup' : 'syrup'} and ice, shaken hard${top ? `, with ${TOPS[top].en.toLowerCase()}` : ''}. Never milk with fruit: the acid curdles it.`),
        steps: [...brewSteps(T), ...topSteps(top), { ...sweet, w: top ? 1 : 0 }, ...(F.add ? [{ ...F.add, w: 1 }] : []), { kind: 'pour', item: 'tea', ml: 300, tol: 35, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 12 }, { kind: 'serve' }] });
    }
  }
  // ---------- tea-free specials
  const sp = (id, zh, en, short, price, layers, about, steps, extra = {}) => add({ id, cat: 'special', zh, en, short, price, cost: Math.round(price * 0.3), kind: 'drink', layers, about, steps, cx: 3, ...extra });
  sp('melon_lemon', '冬瓜檸檬', 'Winter melon lemonade', '冬瓜檸', 45, ['#d8b048'], P('冬瓜露兌冷開水，加現擠檸檬、冰塊搖勻。冬瓜露已經有甜味，不加糖。', 'Winter melon syrup and cold water with fresh lemon and ice, shaken. The syrup is sweet already.'), [{ kind: 'pour', item: 'melon', ml: 100, tol: 18 }, { kind: 'pour', item: 'cold', ml: 250, tol: 30, w: 1 }, { kind: 'scoop', item: 'lemon', n: 2, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 10 }, { kind: 'serve' }], { lemon: true });
  sp('melon_milk', '冬瓜鮮奶', 'Winter melon milk', '冬瓜奶', 55, ['#ecd8b0'], P('冬瓜露加鮮奶、冰塊搖勻，古早味的冬瓜牛奶。', 'Winter melon syrup with fresh milk and ice, shaken: the old-style favourite.'), [{ kind: 'pour', item: 'melon', ml: 100, tol: 18 }, { kind: 'pour', item: 'milk', ml: 300, tol: 30, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 8 }, { kind: 'serve' }]);
  for (const tid of ['fourseason', 'black', 'green']) { const T = TEAS.find((x) => x.id === tid); sp(`melon_${tid}`, '冬瓜' + (tid === 'fourseason' ? '青茶' : T.zh), `Winter melon ${T.en}`, '冬瓜' + T.zh.slice(0, 1), 40, [mixc('#c08840', ITEMS[tid].brew, 0.5)], P(`${ITEMS[tid].zh}用 ${T.t}°C 泡 ${T.m} 分鐘、濾掉茶葉，兌冬瓜露（不再加糖）、冰塊搖勻。`, `${ITEMS[tid].en} brewed ${T.m} minutes at ${T.t}°C, strained, with winter melon syrup (no more sugar) and ice, shaken.`), [...brewSteps(T), { kind: 'pour', item: 'melon', ml: 80, tol: 15 }, { kind: 'pour', item: 'tea', ml: 300, tol: 35, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 10 }, { kind: 'serve' }]); }
  const milkDrink = (id, zh, en, short, price, layers, top, n, aboutZh, aboutEn, extra) => sp(id, zh, en, short, price, layers, P(aboutZh, aboutEn), [{ kind: 'scoop', item: top, n }, { kind: 'scoop', item: 'ice', n: 2 }, { kind: 'pour', item: 'milk', ml: 350, tol: 35, w: 1 }, { kind: 'do', item: 'stir' }, { kind: 'serve' }], { tops: [top], ...extra });
  milkDrink('milk_redbean', '紅豆鮮奶', 'Red bean milk', '紅豆奶', 65, ['#f4ecdc'], 'redbean', 2, '蜜紅豆（已經煮甜了）放杯底，加冰塊、倒鮮奶，輕輕攪拌。', 'Sweet red beans (already sweetened) in the cup, ice, fresh milk, a gentle stir.');
  milkDrink('milk_pudding', '布丁鮮奶', 'Pudding milk', '布丁奶', 65, ['#f8f0dc'], 'pudding', 1, '一整顆雞蛋布丁放杯底，加冰塊、倒鮮奶，輕輕攪一下。', 'A whole egg pudding in the cup, ice, fresh milk, a gentle stir.');
  milkDrink('milk_grass', '仙草凍鮮奶', 'Grass jelly milk', '仙草奶', 60, ['#f4ecdc'], 'grass', 2, '仙草凍切丁放杯底，加冰塊、倒鮮奶，輕輕攪拌：黑白分明。', 'Diced grass jelly in the cup, ice, fresh milk, a gentle stir: black and white.');
  milkDrink('milk_taroball', '芋圓鮮奶', 'Taro ball milk', '芋圓奶', 65, ['#f4ecdc'], 'taroball', 2, '煮好的芋圓放杯底，加冰塊、倒鮮奶，輕輕攪拌。', 'Cooked taro balls in the cup, ice, fresh milk, a gentle stir.');
  sp('milk_strawberry', '草莓鮮奶', 'Strawberry milk', '草莓奶', 75, ['#f8dce0'], P('草莓果醬放杯底，加冰塊、倒鮮奶，輕輕攪拌。草莓不像柑橘那麼酸，可以配鮮奶。', 'Strawberry jam in the cup, ice, fresh milk, a gentle stir. Strawberry is gentle enough for milk; citrus is not.'), [{ kind: 'scoop', item: 'strawberry', n: 3 }, { kind: 'scoop', item: 'ice', n: 2 }, { kind: 'pour', item: 'milk', ml: 350, tol: 35, w: 1 }, { kind: 'do', item: 'stir' }, { kind: 'serve' }], { stripes: '#d83a4a' });
  sp('milk_mango', '芒果鮮奶', 'Mango milk', '芒果奶', 75, ['#f8e4b0'], P('芒果果泥加鮮奶、冰塊搖勻。', 'Mango purée with fresh milk and ice, shaken.'), [{ kind: 'scoop', item: 'mango', n: 3 }, { kind: 'pour', item: 'milk', ml: 350, tol: 35, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 8 }, { kind: 'serve' }]);
  sp('milk_brown', '黑糖鮮奶', 'Brown sugar milk', '黑糖奶', 60, ['#f4ecdc'], P('黑糖漿沿著杯壁淋，轉杯掛糖，加冰塊、倒鮮奶。不搖，留住黑糖紋。', 'Brown sugar syrup run round the cup and swirled to coat it, ice, fresh milk. No shaking: keep the stripes.'), [{ kind: 'pour', item: 'brownsyrup', ml: 30, tol: 8 }, { kind: 'do', item: 'swirl' }, { kind: 'scoop', item: 'ice', n: 2 }, { kind: 'pour', item: 'milk', ml: 350, tol: 35, w: 1 }, { kind: 'shake', n: 0 }, { kind: 'serve' }], { stripes: '#6e3c14' });
  sp('milk_brownboba2', '黑糖波霸鮮奶', 'Brown sugar big boba milk', '黑糖波', 85, ['#f4ecdc'], P('波霸用黑糖慢火炒煮，舀進杯子轉杯掛糖，加冰塊、倒鮮奶。不搖。', 'Big boba simmered in brown sugar, swirled up the cup, ice and fresh milk. No shaking.'), [{ kind: 'scoop', item: 'boba', n: 3 }, { kind: 'pour', item: 'brownsyrup', ml: 20, tol: 8, w: 1 }, { kind: 'do', item: 'swirl' }, { kind: 'scoop', item: 'ice', n: 2 }, { kind: 'pour', item: 'milk', ml: 300, tol: 30, w: 1 }, { kind: 'shake', n: 0 }, { kind: 'serve' }], { tops: ['boba'], stripes: '#6e3c14' });
  sp('cocoa_milk', '可可鮮奶', 'Cocoa milk', '可可奶', 65, ['#9a6a4a'], P('可可粉先用一點熱水攪開（不然會結塊），加果糖、鮮奶、冰塊搖勻。', 'Cocoa first stirred smooth in a little hot water (or it lumps), then syrup, fresh milk and ice, shaken.'), [{ kind: 'scoop', item: 'cocoa', n: 2 }, { kind: 'pour', item: 'hot', ml: 50, tol: 12, w: 1 }, { kind: 'do', item: 'stir' }, { kind: 'scoop', item: 'sugar', n: 2 }, { kind: 'pour', item: 'milk', ml: 300, tol: 30, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 8 }, { kind: 'serve' }]);
  for (const top of [null, 'pearl', 'redbean', 'pudding']) sp(`matcha${top ? '_' + top : ''}`, (top ? TOPS[top].zh : '') + '抹茶拿鐵', `${top ? TOPS[top].en + ' ' : ''}matcha latte`.replace(/^./, (c) => c.toUpperCase()), (top ? TOPS[top].zh : '') + '抹茶', 75 + (top ? 10 : 0), ['#a8c080'], P('抹茶粉用 80°C 熱水，拿茶筅刷到沒有顆粒，再加果糖、鮮奶、冰塊搖勻。水太燙抹茶會苦。', 'Matcha whisked smooth with 80°C water (hotter turns it bitter), then syrup, fresh milk and ice, shaken.'), [{ kind: 'heat', item: 'water', target: 80, tol: 4 }, { kind: 'scoop', item: 'matcha', n: 2, w: 1 }, { kind: 'pour', item: 'hot', ml: 50, tol: 12 }, { kind: 'do', item: 'whisk' }, ...topSteps(top), { kind: 'scoop', item: 'sugar', n: 3, w: top ? 1 : 0 }, { kind: 'pour', item: 'milk', ml: 300, tol: 30, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 8 }, { kind: 'serve' }], { tops: top ? [top] : [] });
  sp('aiyu_lemon', '愛玉檸檬', 'Aiyu lemonade', '愛玉檸', 50, ['#f0e8a0'], P('手洗愛玉切丁，加現擠檸檬、果糖、冷開水、冰塊，輕輕攪拌（愛玉會被搖碎）。', 'Hand-washed aiyu jelly, fresh lemon, syrup, cold water and ice, stirred gently: shaking breaks the jelly.'), [{ kind: 'scoop', item: 'aiyu', n: 3 }, { kind: 'scoop', item: 'lemon', n: 2, w: 1 }, { kind: 'scoop', item: 'sugar', n: 4, w: 1 }, { kind: 'pour', item: 'cold', ml: 300, tol: 35, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'do', item: 'stir' }, { kind: 'serve' }], { tops: ['aiyu'], lemon: true });
  sp('kumquat_lemon', '金桔檸檬', 'Kumquat lemonade', '金桔檸', 50, ['#f0c040'], P('現擠金桔和檸檬，加果糖、冷開水、冰塊搖勻。', 'Fresh-squeezed kumquat and lemon with syrup, cold water and ice, shaken.'), [{ kind: 'scoop', item: 'kumquat', n: 4 }, { kind: 'scoop', item: 'lemon', n: 1, w: 1 }, { kind: 'scoop', item: 'sugar', n: 4, w: 1 }, { kind: 'pour', item: 'cold', ml: 350, tol: 35, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 12 }, { kind: 'serve' }], { lemon: true });
  sp('honey_lemon', '蜂蜜檸檬', 'Honey lemonade', '蜂蜜檸', 55, ['#f0d070'], P('龍眼蜂蜜先用一點熱水化開，加現擠檸檬、冷開水、冰塊搖勻。', 'Longan honey loosened in a little hot water, then fresh lemon, cold water and ice, shaken.'), [{ kind: 'scoop', item: 'honey', n: 3 }, { kind: 'pour', item: 'hot', ml: 30, tol: 10, w: 1 }, { kind: 'scoop', item: 'lemon', n: 2 }, { kind: 'pour', item: 'cold', ml: 350, tol: 35, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 12 }, { kind: 'serve' }], { lemon: true });
  sp('lemon_yakult', '檸檬多多', 'Lemon Yakult', '檸多多', 55, ['#f4ecb0'], P('一瓶養樂多（100 ml）加現擠檸檬、果糖、冷開水、冰塊搖勻。', 'A bottle of Yakult (100 ml) with fresh lemon, syrup, cold water and ice, shaken.'), [{ kind: 'pour', item: 'yakult', ml: 100, tol: 15 }, { kind: 'scoop', item: 'lemon', n: 2, w: 1 }, { kind: 'scoop', item: 'sugar', n: 2, w: 1 }, { kind: 'pour', item: 'cold', ml: 250, tol: 30, w: 1 }, { kind: 'scoop', item: 'ice', n: 3, w: 1 }, { kind: 'shake', n: 12 }, { kind: 'serve' }], { lemon: true });

  // ---------- food
  const food = (p) => add({ kind: 'food', cost: Math.round(p.price * 0.32), ...p });
  const boil = (noodle, min) => [{ kind: 'heat', item: 'water', target: 100, tol: 3 }, { kind: 'pick', item: noodle, w: 1 }, { kind: 'steep', item: noodle, min, tol: Math.max(0.5, min * 0.25) }, { kind: 'do', item: 'drain' }];
  const NOODLES = [{ id: 'noodle', zh: '麵', en: 'noodles', min: 3 }, { id: 'yimian', zh: '意麵', en: 'yi mein', min: 1.5 }, { id: 'oilnoodle', zh: '油麵', en: 'oil noodles', min: 1 }, { id: 'kway', zh: '粄條', en: 'flat rice noodles', min: 1 }, { id: 'vermi', zh: '米粉', en: 'rice vermicelli', min: 2 }];
  const SAUCES = [
    { id: 'sesame', zh: '麻醬', en: 'Sesame', dc: '#c8945a', steps: [['sesame', 2], ['soy', 1], ['vinegar', 1], ['garlic', 1]], top: [['cucumber', 1]] },
    { id: 'zhajiang', zh: '炸醬', en: 'Zhajiang', dc: '#6a3a1a', steps: [['zhajiang', 2]], top: [['cucumber', 1]] },
    { id: 'rouzao', zh: '肉燥', en: 'Minced pork', dc: '#7a4a2a', steps: [['rouzao', 2]], top: [['sprouts', 1], ['scallion', 1]] },
    { id: 'scallionoil', zh: '蔥油', en: 'Scallion oil', dc: '#d8b060', steps: [['scallionoil', 2], ['soy', 1]], top: [['scallion', 1]] },
    { id: 'shacha', zh: '沙茶', en: 'Shacha', dc: '#9a5a2a', steps: [['shacha', 2], ['soy', 1]], top: [['greens', 1]] },
    { id: 'chilioil', zh: '紅油', en: 'Chilli oil', dc: '#c84a2a', steps: [['chilioil', 2], ['soy', 1], ['vinegar', 1], ['garlic', 1]], top: [['scallion', 1]] },
  ];
  for (const S of SAUCES) for (const N of NOODLES) {
    if (S.id === 'sesame' && N.id === 'noodle') continue;   // that one is hand-made (麻醬麵)
    const sauceSteps = S.steps.map(([it, n], i) => ({ kind: 'scoop', item: it, n, w: i ? 1 : 0 }));
    food({ id: `dry_${S.id}_${N.id}`, cat: 'dry', zh: S.zh + (N.id === 'noodle' ? '乾麵' : '乾' + N.zh), en: `${S.en} dry ${N.en}`, short: S.zh + N.zh.slice(0, 1), price: 55 + (N.id === 'kway' ? 5 : 0), dish: 'noodle', dc: S.dc, cx: 2,
      about: P(`水滾了（100°C）才下${N.zh}，煮 ${N.min} 分鐘撈起瀝乾，碗裡先放好${S.steps.map(([it]) => ITEMS[it].zh).join('、')}，放麵拌勻，再加${S.top.map(([it]) => ITEMS[it].zh).join('、')}。`, `${cap(N.en)} go in only at a full boil (100°C), ${N.min} minutes, lifted out and drained; ${S.steps.map(([it]) => ITEMS[it].en.toLowerCase()).join(', ')} in the bowl, noodles tossed through, then ${S.top.map(([it]) => ITEMS[it].en.toLowerCase()).join(' and ')}.`),
      steps: [...boil(N.id, N.min), ...sauceSteps, { kind: 'do', item: 'toss' }, ...S.top.map(([it, n], i) => ({ kind: 'scoop', item: it, n, w: i ? 1 : 0 })), { kind: 'serve' }] });
  }
  const SOUPN = [{ id: 'noodle', zh: '麵', en: 'noodles', min: 3 }, { id: 'wide', zh: '寬麵', en: 'wide noodles', min: 4 }, { id: 'vermi', zh: '米粉', en: 'rice vermicelli', min: 2 }, { id: 'glass', zh: '冬粉', en: 'glass noodles', min: 2 }, { id: 'kway', zh: '粄條', en: 'flat rice noodles', min: 1 }];
  const SOUPS = [
    { id: 'beef', zh: '紅燒牛肉', en: 'Braised beef', broth: 'beefbroth', price: 150, top: [['beef', 4], ['pickled', 1], ['scallion', 1]] },
    { id: 'clearbeef', zh: '清燉牛肉', en: 'Clear beef', broth: 'clearbroth', price: 150, top: [['beef', 4], ['scallion', 1]] },
    { id: 'tomatobeef', zh: '番茄牛肉', en: 'Tomato beef', broth: 'tomatobroth', price: 160, top: [['beef', 3], ['tomato', 2], ['scallion', 1]] },
    { id: 'wonton', zh: '餛飩', en: 'Wonton', broth: 'porkbroth', price: 75, top: [['wonton', 6], ['greens', 1], ['scallion', 1]] },
    { id: 'porkchop', zh: '排骨', en: 'Pork chop', broth: 'porkbroth', price: 100, top: [['porkchop', 1], ['pickled', 1], ['scallion', 1]] },
    { id: 'meatball', zh: '貢丸', en: 'Pork ball', broth: 'porkbroth', price: 65, top: [['meatball', 4], ['cilantro', 1]] },
    { id: 'zhacai', zh: '榨菜肉絲', en: 'Pork & zha cai', broth: 'porkbroth', price: 70, top: [['zhacai', 2], ['scallion', 1]] },
    { id: 'sesamechicken', zh: '麻油雞', en: 'Sesame-oil chicken', broth: 'sesamebroth', price: 120, top: [['sesamechicken', 4], ['ginger', 1]] },
  ];
  for (const S of SOUPS) for (const N of SOUPN) {
    food({ id: `soup_${S.id}_${N.id}`, cat: 'soup', zh: S.zh + (N.id === 'noodle' ? '麵' : N.zh), en: `${S.en} ${N.en} soup`, short: S.zh.slice(0, 2) + N.zh.slice(0, 1), price: S.price + (N.id === 'wide' ? 10 : 0), dish: 'soup', dc: ITEMS[S.broth].color, dt: ITEMS[S.top[0][0]].color, cx: 3,
      about: P(`水滾了才下${N.zh}，煮 ${N.min} 分鐘撈起瀝乾放進碗裡，舀進熱的${ITEMS[S.broth].zh}，鋪上${S.top.map(([it]) => ITEMS[it].zh).join('、')}。`, `${cap(N.en)} into boiling water for ${N.min} minutes, lifted out and drained into the bowl, hot ${ITEMS[S.broth].en.toLowerCase()} ladled over, topped with ${S.top.map(([it]) => ITEMS[it].en.toLowerCase()).join(', ')}.`),
      steps: [...boil(N.id, N.min), { kind: 'pour', item: S.broth, ml: 350, tol: 40 }, ...S.top.map(([it, n], i) => ({ kind: 'scoop', item: it, n, w: 1 })), { kind: 'serve' }] });
  }
  for (const [it, n, zh, en, price, top] of [['wonton', 8, '餛飩湯', 'Wonton soup', 60, 'scallion'], ['meatball', 5, '貢丸湯', 'Pork ball soup', 35, 'cilantro']])
    food({ id: `soup_${it}_only`, cat: 'soup', zh, en, short: zh.slice(0, 3), price, dish: 'soup', dc: '#ece0c8', dt: ITEMS[it].color, cx: 2,
      about: P(`水滾了才下${ITEMS[it].zh}，煮 3 分鐘${it === 'wonton' ? '浮起來就熟了' : '熱透'}，撈起放進碗裡，舀進大骨湯，撒${ITEMS[top].zh}。`, `${ITEMS[it].en} into boiling water for 3 minutes${it === 'wonton' ? ' (done when they float)' : ''}, lifted into the bowl, pork bone broth over, ${ITEMS[top].en.toLowerCase()} on top.`),
      steps: [{ kind: 'heat', item: 'water', target: 100, tol: 3 }, { kind: 'pick', item: 'dpot', w: 1 }, { kind: 'scoop', item: it, n }, { kind: 'steep', item: 'dpot', min: 3, tol: 0.8 }, { kind: 'do', item: 'drain' }, { kind: 'pour', item: 'porkbroth', ml: 300, tol: 40 }, { kind: 'scoop', item: top, n: 1, w: 1 }, { kind: 'serve' }] });
  // rice bowls: rice from the rice cooker, the topping kept warm in its pot, the classic sides; with an egg or not
  const RICE = [
    { id: 'lurou', zh: '滷肉飯', en: 'Braised pork rice', price: 35, dc: '#6a2a10', steps: [['lurou', 2]], pour: ['juice', 20], side: [['radish', 2]] },
    { id: 'chicken', zh: '雞肉飯', en: 'Chiayi chicken rice', price: 40, dc: '#f0dcb0', steps: [['chicken', 2]], pour: ['chickenoil', 15], side: [['shallot', 1], ['radish', 1]] },
    { id: 'kongrou', zh: '控肉飯', en: 'Braised pork belly rice', price: 80, dc: '#7a3a18', steps: [['kongrou', 1]], pour: ['juice', 20], side: [['pickled', 1], ['radish', 2]] },
    { id: 'trotter', zh: '豬腳飯', en: 'Braised trotter rice', price: 100, dc: '#8a4a20', steps: [['trotter', 3]], pour: ['juice', 20], side: [['pickled', 1], ['greens', 1]] },
    { id: 'curry', zh: '咖哩雞飯', en: 'Chicken curry rice', price: 90, dc: '#d8a030', steps: [['curry', 2]], side: [['radish', 1]] },
    { id: 'mapo', zh: '麻婆豆腐飯', en: 'Mapo tofu rice', price: 80, dc: '#c84a2a', steps: [['mapo', 2]], side: [['scallion', 1]] },
    { id: 'sanbei', zh: '三杯雞飯', en: 'Three-cup chicken rice', price: 110, dc: '#8a3a18', steps: [['sanbei', 2]], side: [['basil', 1], ['greens', 1]] },
    { id: 'porkchop', zh: '排骨飯', en: 'Pork chop rice', price: 100, dc: '#b8783a', fry: ['porkchop', 1, 3], pour: ['juice', 15], side: [['pickled', 1], ['greens', 1]] },
    { id: 'drumstick', zh: '雞腿飯', en: 'Fried drumstick rice', price: 120, dc: '#c88a4a', fry: ['drumstick', 1, 8], pour: ['juice', 15], side: [['pickled', 1], ['greens', 1]] },
    { id: 'mackerel', zh: '鯖魚飯', en: 'Mackerel rice', price: 110, dc: '#8a8a90', grill: ['mackerel', 1, 6], side: [['greens', 1], ['radish', 1]] },
  ];
  for (const R of RICE) for (const egg of [null, 'egg', 'friedegg']) {
    const cook = R.fry ? [{ kind: 'pick', item: 'fryer' }, { kind: 'scoop', item: R.fry[0], n: R.fry[1] }, { kind: 'steep', item: 'fryer', min: R.fry[2], tol: Math.max(0.6, R.fry[2] * 0.2) }, { kind: 'do', item: 'cut' }]
      : R.grill ? [{ kind: 'pick', item: 'griddle' }, { kind: 'scoop', item: R.grill[0], n: R.grill[1] }, { kind: 'do', item: 'flip' }, { kind: 'steep', item: 'griddle', min: R.grill[2], tol: 1.2, w: 1 }] : [];
    const top = R.steps ? R.steps.map(([it, n]) => ({ kind: 'scoop', item: it, n, w: 1 })) : [];
    food({ id: `rice_${R.id}${egg ? '_' + egg : ''}`, cat: 'rice', zh: R.zh + (egg === 'egg' ? '加滷蛋' : egg === 'friedegg' ? '加荷包蛋' : ''), en: R.en + (egg === 'egg' ? ' with braised egg' : egg === 'friedegg' ? ' with fried egg' : ''), short: R.zh.slice(0, 2) + (egg ? '蛋' : '飯'), price: R.price + (egg ? 15 : 0), dish: 'rice', dc: R.dc, cx: (R.fry || R.grill ? 3 : 1) + (egg ? 1 : 0),
      about: P(`${R.fry ? `${ITEMS[R.fry[0]].zh}下油鍋（170°C）炸 ${R.fry[2]} 分鐘、切塊；` : R.grill ? `${ITEMS[R.grill[0]].zh}上煎台，翻面煎 ${R.grill[2]} 分鐘；` : ''}盛一碗白飯，${R.steps ? `舀上${R.steps.map(([it]) => ITEMS[it].zh).join('、')}，` : '鋪上去，'}${R.pour ? `淋${ITEMS[R.pour[0]].zh}，` : ''}配${R.side.map(([it]) => ITEMS[it].zh).join('、')}${egg ? `，加一顆${ITEMS[egg].zh}` : ''}。`, `${R.fry ? `${ITEMS[R.fry[0]].en} fried ${R.fry[2]} minutes at 170°C and cut; ` : R.grill ? `${ITEMS[R.grill[0]].en} on the griddle, flipped, ${R.grill[2]} minutes; ` : ''}a bowl of rice, ${R.steps ? R.steps.map(([it]) => ITEMS[it].en.toLowerCase()).join(', ') + ' on top' : 'laid on top'}${R.pour ? `, ${ITEMS[R.pour[0]].en.toLowerCase()} over` : ''}, with ${R.side.map(([it]) => ITEMS[it].en.toLowerCase()).join(' and ')}${egg ? ` and a ${ITEMS[egg].en.toLowerCase()}` : ''}.`),
      steps: [...cook, { kind: 'scoop', item: 'rice', n: 1 }, ...top, ...(R.pour ? [{ kind: 'pour', item: R.pour[0], ml: R.pour[1], tol: 8, w: 1 }] : []), ...R.side.map(([it, n]) => ({ kind: 'scoop', item: it, n, w: 1 })), ...(egg ? [{ kind: 'scoop', item: egg, n: 1, w: 1 }] : []), { kind: 'serve' }] });
  }
  // braised plates: back into the pot to heat through, cut, a little liquid, spring onion
  const LUWEI = [['tofu', 3, '滷豆干', 'Braised tofu', 35], ['kelp', 4, '滷海帶', 'Braised kelp', 30], ['egg', 2, '滷蛋（兩顆）', 'Two braised eggs', 30], ['duckblood', 3, '滷鴨血', 'Braised duck blood', 40], ['baiye', 3, '滷百頁豆腐', 'Braised bai ye tofu', 40], ['riceblood', 3, '滷米血', 'Braised rice blood cake', 35], ['ear', 4, '滷豬耳朵', 'Braised pig’s ear', 60], ['shank', 1, '滷牛腱', 'Braised beef shank', 90]];
  for (const [it, n, zh, en, price] of LUWEI) food({ id: `luwei_${it}`, cat: 'braise', zh, en, short: zh.replace('滷', '').slice(0, 3), price, dish: 'braise', dc: ITEMS[it].color, cx: 1, about: P(`${ITEMS[it].zh}前一晚就滷好。點單時放回滷汁鍋熱 3 分鐘，撈起切開，淋一點滷汁、撒蔥花。`, `${ITEMS[it].en}, braised the night before. To order: 3 minutes back in the pot, then cut, a spoonful of the liquid, spring onion.`),
    steps: [{ kind: 'pick', item: 'braise' }, { kind: 'scoop', item: it, n }, { kind: 'steep', item: 'braise', min: 3, tol: 0.8 }, { kind: 'do', item: 'cut' }, { kind: 'pour', item: 'juice', ml: 30, tol: 10 }, { kind: 'scoop', item: 'scallion', n: 1, w: 1 }, { kind: 'serve' }] });
  for (const [id, items, zh, en, price] of [['luwei_tofukelp', [['tofu', 2], ['kelp', 2]], '豆干海帶拼盤', 'Tofu and kelp plate', 50], ['luwei_mix', [['tofu', 2], ['kelp', 2], ['egg', 1], ['duckblood', 2], ['baiye', 2]], '綜合滷味', 'Mixed braised plate', 90], ['luwei_meat', [['ear', 3], ['shank', 1], ['egg', 1]], '滷味肉拼', 'Braised meat plate', 120]])
    food({ id, cat: 'braise', zh, en, short: zh.slice(0, 3), price, dish: 'braise', dc: ITEMS[items[0][0]].color, cx: 2, about: P(`${items.map(([it]) => ITEMS[it].zh).join('、')}放回滷汁鍋熱 3 分鐘，撈起切開裝盤，淋滷汁、撒蔥花。`, `${items.map(([it]) => ITEMS[it].en.toLowerCase()).join(', ')} back in the pot for 3 minutes, cut and plated with a spoonful of liquid and spring onion.`),
      steps: [{ kind: 'pick', item: 'braise' }, ...items.map(([it, n], i) => ({ kind: 'scoop', item: it, n, w: i ? 1 : 0 })), { kind: 'steep', item: 'braise', min: 3, tol: 0.8 }, { kind: 'do', item: 'cut' }, { kind: 'pour', item: 'juice', ml: 30, tol: 10 }, { kind: 'scoop', item: 'scallion', n: 1, w: 1 }, { kind: 'serve' }] });
  // griddle: dan bing (egg crepes), turnip cake, scallion pancake
  for (const [f, n, zh, en, price] of [[null, 0, '原味蛋餅', 'Plain dan bing', 30], ['cheese', 1, '起司蛋餅', 'Cheese dan bing', 40], ['corn', 2, '玉米蛋餅', 'Corn dan bing', 40], ['tuna', 2, '鮪魚蛋餅', 'Tuna dan bing', 45], ['ham', 1, '火腿蛋餅', 'Ham dan bing', 40], ['bacon', 2, '培根蛋餅', 'Bacon dan bing', 45], ['floss', 1, '肉鬆蛋餅', 'Pork floss dan bing', 40], ['hashbrown', 1, '薯餅蛋餅', 'Hash brown dan bing', 45], ['scallion', 2, '蔥花蛋餅', 'Spring onion dan bing', 35]])
    food({ id: `danbing_${f || 'plain'}`, cat: 'snack', zh, en, short: zh.slice(0, 3), price, dish: 'plate', dc: '#f0d080', dt: f ? ITEMS[f].color : null, cx: 3,
      about: P(`煎台上打一顆蛋${f ? `、放${ITEMS[f].zh}` : ''}，趁蛋還沒凝固蓋上餅皮，翻面煎 1.5 分鐘，捲起來切段，淋醬油膏。`, `Crack an egg on the griddle${f ? ` with the ${ITEMS[f].en.toLowerCase()}` : ''}, lay the crepe on while the egg is still wet, flip, 1.5 minutes, roll up, cut, a drizzle of thick soy.`),
      steps: [{ kind: 'pick', item: 'griddle' }, { kind: 'scoop', item: 'rawegg', n: 1 }, ...(f ? [{ kind: 'scoop', item: f, n, w: 1 }] : []), { kind: 'do', item: 'skin' }, { kind: 'do', item: 'flip' }, { kind: 'steep', item: 'griddle', min: 1.5, tol: 0.5 }, { kind: 'do', item: 'roll' }, { kind: 'do', item: 'cut' }, { kind: 'pour', item: 'soypaste', ml: 15, tol: 6 }, { kind: 'serve' }] });
  for (const egg of [false, true]) {
    food({ id: `radishcake${egg ? '_egg' : ''}`, cat: 'snack', zh: egg ? '蘿蔔糕加蛋' : '煎蘿蔔糕', en: egg ? 'Turnip cake with egg' : 'Pan-fried turnip cake', short: '蘿蔔糕', price: egg ? 45 : 35, dish: 'plate', dc: '#e8d8b0', cx: 2, about: P(`蘿蔔糕上煎台，一面煎金黃再翻面，共 4 分鐘${egg ? '，旁邊打一顆蛋一起煎' : ''}，淋醬油膏。`, `Turnip cake on the griddle, golden on one side, flipped, 4 minutes in all${egg ? ', an egg fried alongside' : ''}, thick soy over.`),
      steps: [{ kind: 'pick', item: 'griddle' }, { kind: 'scoop', item: 'radishcake', n: 2 }, ...(egg ? [{ kind: 'scoop', item: 'rawegg', n: 1, w: 1 }] : []), { kind: 'do', item: 'flip' }, { kind: 'steep', item: 'griddle', min: 4, tol: 1, w: 1 }, { kind: 'pour', item: 'soypaste', ml: 15, tol: 6 }, { kind: 'serve' }] });
    food({ id: `scallioncake${egg ? '_egg' : ''}`, cat: 'snack', zh: egg ? '蔥油餅加蛋' : '蔥油餅', en: egg ? 'Scallion pancake with egg' : 'Scallion pancake', short: '蔥油餅', price: egg ? 45 : 35, dish: 'plate', dc: '#e8c878', cx: 2, about: P(`蔥油餅上煎台，兩面煎到酥${egg ? '，打一顆蛋在上面一起煎' : ''}，3 分鐘，切塊、淋醬油膏。`, `Scallion pancake on the griddle until crisp both sides${egg ? ', an egg cooked on top' : ''}, 3 minutes, cut, thick soy over.`),
      steps: [{ kind: 'pick', item: 'griddle' }, { kind: 'scoop', item: 'scallioncake', n: 1 }, ...(egg ? [{ kind: 'scoop', item: 'rawegg', n: 1, w: 1 }] : []), { kind: 'do', item: 'flip' }, { kind: 'steep', item: 'griddle', min: 3, tol: 0.8, w: 1 }, { kind: 'do', item: 'cut' }, { kind: 'pour', item: 'soypaste', ml: 15, tol: 6 }, { kind: 'serve' }] });
  }
  // dumplings the old way: when it boils, a bowl of cold water, three times
  for (const [it, zh, en] of [['jcabbage', '高麗菜水餃', 'Cabbage-pork dumplings'], ['jleek', '韭菜水餃', 'Chive-pork dumplings'], ['jcorn', '玉米水餃', 'Corn-pork dumplings'], ['jshrimp', '鮮蝦水餃', 'Shrimp dumplings']])
    food({ id: `dumpling_${it}`, cat: 'dim', zh: zh + '（十顆）', en: en + ' (10)', short: zh.slice(0, 2) + '餃', price: it === 'jshrimp' ? 90 : 70, dish: 'plate', dc: ITEMS[it].color, cx: 2,
      about: P('水滾了才下水餃，每次滾起來就加一碗冷水，「點三次水」，餃子浮起來皮變透就熟了（大約 6 分鐘）。撈起瀝乾，配薑絲。', 'Dumplings into fully boiling water; each time it boils back up, a bowl of cold water goes in, three times. When they float and the skins turn clear (about 6 minutes) they are done. Drain, serve with ginger.'),
      steps: [{ kind: 'heat', item: 'water', target: 100, tol: 3 }, { kind: 'pick', item: 'dpot', w: 1 }, { kind: 'scoop', item: it, n: 10 }, { kind: 'scoop', item: 'splash', n: 3, note: P('點三次水：皮 Q 不破', 'three splashes: firm skins that don’t burst') }, { kind: 'steep', item: 'dpot', min: 6, tol: 1.2, w: 1 }, { kind: 'do', item: 'drain' }, { kind: 'scoop', item: 'ginger', n: 1 }, { kind: 'serve' }] });
  for (const [it, zh, en] of [['gpork', '豬肉鍋貼', 'Pork potstickers'], ['gleek', '韭菜鍋貼', 'Chive potstickers']])
    food({ id: `potsticker_${it}`, cat: 'dim', zh: zh + '（十顆）', en: en + ' (10)', short: '鍋貼', price: 70, dish: 'plate', dc: '#e0b070', cx: 3,
      about: P('鍋貼排在煎台上，淋一圈麵粉水，蓋上鍋蓋燜 6 分鐘，水收乾就有一片酥脆的冰花。', 'Potstickers lined up on the griddle, a ring of flour water poured round, lid on for 6 minutes: when the water is gone they sit on a crisp lace.'),
      steps: [{ kind: 'pick', item: 'griddle' }, { kind: 'scoop', item: it, n: 10 }, { kind: 'pour', item: 'flourwater', ml: 60, tol: 15 }, { kind: 'do', item: 'cover' }, { kind: 'steep', item: 'griddle', min: 6, tol: 1.2 }, { kind: 'serve' }] });
  // the steamer
  for (const [it, n, min, zh, en, price, side] of [['xlb', 8, 8, '小籠包', 'Soup dumplings (8)', 120, [['ginger', 1]]], ['shumai', 6, 8, '燒賣', 'Shumai (6)', 80, []], ['porkbun', 2, 12, '鮮肉包', 'Pork buns (2)', 50, []], ['vegbun', 2, 10, '高麗菜包', 'Vegetable buns (2)', 45, []], ['charsiu', 2, 10, '叉燒包', 'Char siu buns (2)', 60, []], ['zongzi', 1, 15, '南部粽', 'Southern zongzi', 60, [['peanut', 1], ['cilantro', 1]]]])
    food({ id: `steam_${it}`, cat: 'dim', zh, en, short: zh.slice(0, 3), price, dish: 'steamer', dc: ITEMS[it].color, cx: 2, about: P(`${ITEMS[it].zh}排進竹蒸籠，水滾後蒸 ${min} 分鐘${side.length ? `，配${side.map(([s]) => ITEMS[s].zh).join('、')}` : ''}。`, `${ITEMS[it].en} into the bamboo steamer over boiling water for ${min} minutes${side.length ? `, with ${side.map(([s]) => ITEMS[s].en.toLowerCase()).join(' and ')}` : ''}.`),
      steps: [{ kind: 'pick', item: 'steamer' }, { kind: 'scoop', item: it, n }, { kind: 'steep', item: 'steamer', min, tol: Math.max(1, min * 0.15) }, ...side.map(([s, k]) => ({ kind: 'scoop', item: s, n: k })), { kind: 'serve' }] });
  food({ id: 'guabao', cat: 'dim', zh: '刈包', en: 'Gua bao', short: '刈包', price: 60, dish: 'steamer', dc: '#f8f4ec', cx: 3, about: P('刈包皮蒸 3 分鐘，夾控肉、酸菜，撒花生粉和香菜。', 'The bun steamed 3 minutes, filled with braised pork belly and pickled greens, peanut powder and coriander on top.'),
    steps: [{ kind: 'pick', item: 'steamer' }, { kind: 'scoop', item: 'guabao', n: 1 }, { kind: 'steep', item: 'steamer', min: 3, tol: 0.8 }, { kind: 'scoop', item: 'kongrou', n: 1 }, { kind: 'scoop', item: 'pickled', n: 1, w: 1 }, { kind: 'scoop', item: 'peanut', n: 1 }, { kind: 'scoop', item: 'cilantro', n: 1, w: 1 }, { kind: 'serve' }] });
  // desserts: tofu pudding, cold or with hot ginger syrup; shaved ice; grass jelly
  const DH = [['peanutsoft', '花生'], ['redbean', '紅豆'], ['fenyuan', '粉圓'], ['taroball', '芋圓'], ['mungbean', '綠豆'], ['barleyseed', '薏仁'], ['sweetpotato', '地瓜圓']];
  for (const hot of [false, true]) {
    for (const [it, zh] of DH) food({ id: `douhua_${it}${hot ? '_hot' : ''}`, cat: 'dessert', zh: `${hot ? '熱' : ''}${zh}豆花`, en: `${hot ? 'Hot tofu pudding' : 'Tofu pudding'} with ${MORE[it] ? MORE[it].en.toLowerCase() : it}`, short: zh + '豆花', price: 45, dish: 'dessert', dc: '#f8f4e4', dt: (MORE[it] || {}).color, cx: 1,
      about: P(hot ? `用扁杓把豆花一片片舀進碗裡，淋熱薑汁糖水，加${zh}。熱的不加冰。` : `用扁杓把豆花一片片舀進碗裡，淋二砂糖水，加${zh}，最後一杓碎冰。`, hot ? `Tofu pudding scooped in thin slices with a flat ladle, hot ginger syrup over, ${zh}. No ice when it’s hot.` : `Tofu pudding scooped in thin slices with a flat ladle, cane sugar syrup, the topping, then a scoop of crushed ice.`),
      steps: [{ kind: 'scoop', item: 'douhua', n: 1 }, { kind: 'pour', item: hot ? 'gingersyrup' : 'syrup', ml: 100, tol: 20 }, { kind: 'scoop', item: it, n: 2, w: 1 }, ...(hot ? [] : [{ kind: 'scoop', item: 'shaved', n: 1 }]), { kind: 'serve' }] });
    food({ id: `douhua_mix${hot ? '_hot' : ''}`, cat: 'dessert', zh: `${hot ? '熱' : ''}綜合豆花`, en: `${hot ? 'Hot m' : 'M'}ixed tofu pudding`, short: '綜合豆花', price: 60, dish: 'dessert', dc: '#f8f4e4', dt: '#8a2a2a', cx: 2,
      about: P(`豆花舀成薄片，淋${hot ? '熱薑汁' : '二砂'}糖水，加花生、紅豆、粉圓三樣${hot ? '' : '，最後加碎冰'}。`, `Thin slices of tofu pudding, ${hot ? 'hot ginger' : 'cane sugar'} syrup, peanuts, red beans and small tapioca${hot ? '' : ', crushed ice on top'}.`),
      steps: [{ kind: 'scoop', item: 'douhua', n: 1 }, { kind: 'pour', item: hot ? 'gingersyrup' : 'syrup', ml: 100, tol: 20 }, { kind: 'scoop', item: 'peanutsoft', n: 1, w: 1 }, { kind: 'scoop', item: 'redbean', n: 1, w: 1 }, { kind: 'scoop', item: 'fenyuan', n: 1, w: 1 }, ...(hot ? [] : [{ kind: 'scoop', item: 'shaved', n: 1 }]), { kind: 'serve' }] });
  }
  const ICE = [
    ['mango', '芒果雪花冰', 'Mango shaved ice', 150, [['mangocube', 4]], [['mangosauce', 40], ['condensed', 30]]],
    ['strawberry', '草莓牛奶冰', 'Strawberry milk ice', 150, [['freshberry', 6]], [['condensed', 40]]],
    ['redbeanmilk', '紅豆牛奶冰', 'Red bean milk ice', 70, [['redbean', 3]], [['condensed', 40]]],
    ['peanut', '花生冰', 'Peanut shaved ice', 60, [['peanutsoft', 3]], [['syrup', 50]]],
    ['fenguo', '黑糖粉粿冰', 'Brown sugar fen guo ice', 70, [['fenguo', 3]], [['brownsyrup', 40]]],
    ['taroball', '芋圓冰', 'Taro ball ice', 70, [['taroball', 3], ['sweetpotato', 2]], [['syrup', 50]]],
    ['mix', '八寶冰', 'Eight-treasure ice', 80, [['redbean', 1], ['mungbean', 1], ['peanutsoft', 1], ['fenyuan', 1], ['barleyseed', 1], ['taroball', 1]], [['syrup', 50]]],
    ['grass', '燒仙草', 'Hot grass jelly', 60, [['grass', 3], ['peanutsoft', 1], ['taroball', 1]], [['brownsyrup', 30]]],
  ];
  for (const [id, zh, en, price, tops, pours] of ICE) {
    const hot = id === 'grass';
    food({ id: `ice_${id}`, cat: 'dessert', zh, en, short: zh.slice(0, 3), price, dish: 'dessert', dc: hot ? '#3a2a20' : '#f0f8fc', dt: MORE[tops[0][0]] ? MORE[tops[0][0]].color : '#c83a2a', cx: 2,
      about: hot ? P('仙草凍加熱到化開變成濃稠的燒仙草，加花生、芋圓，淋黑糖漿。', 'Grass jelly warmed until it melts into a thick hot pudding, peanuts and taro balls on top, brown sugar syrup over.') : P(`刨一碗細冰，鋪上${tops.map(([t]) => (MORE[t] || {}).zh).join('、')}，淋${pours.map(([t]) => MORE[t].zh).join('、')}。`, `A bowl of fine shaved ice, ${tops.map(([t]) => (MORE[t] || {}).en.toLowerCase()).join(', ')} on top, ${pours.map(([t]) => MORE[t].en.toLowerCase()).join(' and ')} over.`),
      steps: hot ? [{ kind: 'heat', item: 'water', target: 90, tol: 6, note: P('隔水加熱，讓仙草化開', 'warm it over hot water until it melts') }, { kind: 'scoop', item: 'grass', n: 3 }, { kind: 'do', item: 'stir' }, { kind: 'scoop', item: 'peanutsoft', n: 1 }, { kind: 'scoop', item: 'taroball', n: 1, w: 1 }, { kind: 'pour', item: 'brownsyrup', ml: 30, tol: 8, w: 1 }, { kind: 'serve' }]
        : [{ kind: 'do', item: 'shave' }, ...tops.map(([t, n], i) => ({ kind: 'scoop', item: t, n, w: i ? 1 : 0 })), ...pours.map(([t, ml]) => ({ kind: 'pour', item: t, ml, tol: Math.max(8, ml * 0.25) })), { kind: 'serve' }] });
  }
  return out;
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const CATS = [
  { id: 'pure', zh: '純茶', en: 'Pure tea' }, { id: 'milk', zh: '奶茶', en: 'Milk tea' }, { id: 'latte', zh: '鮮奶茶', en: 'Fresh milk tea' }, { id: 'foam', zh: '奶蓋', en: 'Cheese foam' }, { id: 'fruit', zh: '果茶', en: 'Fruit tea' }, { id: 'special', zh: '特調', en: 'Specials' },
  { id: 'dry', zh: '乾麵', en: 'Dry noodles' }, { id: 'soup', zh: '湯麵', en: 'Noodle soup' }, { id: 'rice', zh: '飯', en: 'Rice' }, { id: 'braise', zh: '滷味', en: 'Braised' }, { id: 'snack', zh: '煎台', en: 'Griddle' }, { id: 'dim', zh: '點心', en: 'Dim sum' }, { id: 'dessert', zh: '甜品', en: 'Desserts' },
];
// when each one opens up: easy ones first, the long recipes later (reputation)
export function assignUnlocks(list) {
  const catW = { pure: 0, milk: 1, fruit: 1, special: 2, latte: 2, dry: 1, braise: 1, rice: 1, snack: 2, foam: 3, soup: 3, dim: 3, dessert: 2 };
  const order = list.slice().sort((a, b) => (catW[a.cat] + (a.cx || 2) + a.steps.length * 0.12) - (catW[b.cat] + (b.cx || 2) + b.steps.length * 0.12) || a.id.localeCompare(b.id));
  order.forEach((p, i) => { p.unlock = Math.round(5000 * Math.pow(i / order.length, 1.5) / 10) * 10; });
}
