// 200 things that can happen in a day. None of them has to be done: skip one and nothing is lost; take it on and
// do it well and reputation, money or both go up. Six kinds:
//   make    someone challenges you to make a drink or dish to a score          (60)
//   vip     a special guest comes in; some are secret and you must find them   (20)
//   choice  a difficult customer or a small dilemma, with ways to handle it    (40)
//   quiz    a customer asks something real about tea or Taiwanese food          (40)
//   rush    a crowd is coming; get ready and serve them                         (20)
//   order   a bulk order: make one sample to standard and the whole lot is paid (20)
const T = (zh, en) => ({ zh, en });

// ------------------------------------------------------------------ challenges: who asks, and what
const PEOPLE = [
  ['隔壁茶飲店老闆', 'the tea shop owner next door', '🧑‍🍳', ['boba', 'fruit_passion_fourseason']],
  ['退休的老師傅', 'a retired tea master', '👴', ['pure_oolong', 'pure_beauty']],
  ['大學手搖飲社社長', 'the head of a university bubble tea club', '🎓', ['latte_black_boba', 'foam_fourseason']],
  ['美食部落客', 'a food blogger', '📝', ['brownboba', 'fruit_grapefruit_green']],
  ['外國背包客', 'a backpacker from abroad', '🎒', ['boba', 'melon']],
  ['電視美食節目', 'a TV food show', '📺', ['milk_black_pudding', 'noodle']],
  ['高中熱舞社', 'a high school dance club', '💃', ['fruit_yakult_green', 'fruit_lemon_black']],
  ['坪林的茶農阿伯', 'an old tea farmer from Pinglin', '👨‍🌾', ['pure_pouchong', 'pure_fourseason']],
  ['甜點師', 'a pastry chef', '🧁', ['milk_pudding', 'matcha']],
  ['健身教練（要無糖）', 'a fitness coach (no sugar!)', '💪', ['pure_jinxuan', 'lemon']],
  ['隔壁的阿嬤', 'the grandma next door', '👵', ['melon', 'pure_barley']],
  ['一群小學生', 'a gang of primary school kids', '🧒', ['milk_strawberry', 'cocoa_milk']],
  ['夜班護理師', 'night-shift nurses', '👩‍⚕️', ['latte_black', 'fruit_honeylemon_green']],
  ['計程車司機', 'a taxi driver', '🚕', ['melon_black', 'milk_black']],
  ['廟口的阿伯', 'an uncle from the temple square', '🏮', ['pure_oolong', 'melon']],
  ['料理比賽評審', 'a cooking contest judge', '⚖️', ['tgy', 'latte_earl_pearl']],
  ['日本觀光客', 'Japanese tourists', '🗾', ['matcha_redbean', 'boba']],
  ['韓國交換學生', 'a Korean exchange student', '🇰🇷', ['brownboba', 'fruit_peach_black']],
  ['外送員', 'a delivery rider', '🛵', ['fruit_kumquat_green', 'milk_green_pearl']],
  ['加班的上班族', 'an office worker on overtime', '💼', ['latte_oolong_pearl', 'pure_puer']],
  ['攝影師（要拍美照）', 'a photographer (it must look good)', '📷', ['taro', 'brownboba']],
  ['茶藝老師', 'a tea ceremony teacher', '🍵', ['pure_beauty', 'pure_ruby']],
  ['便利商店店長', 'the convenience store manager', '🏪', ['milk_black_coconut', 'fruit_lemon_black']],
  ['夜市攤販', 'a night market vendor', '🌃', ['luwei_mix', 'scallioncake_egg']],
  ['牛肉麵大賽冠軍', 'a beef noodle contest champion', '🏆', ['soup_beef_noodle', 'soup_clearbeef_wide']],
  ['嘉義來的阿姨', 'an auntie from Chiayi', '🍗', ['rice_chicken', 'rice_lurou_egg']],
  ['早餐店老闆娘', 'the breakfast shop lady', '🍳', ['danbing_cheese', 'radishcake_egg']],
  ['麵店老師傅', 'an old noodle-shop cook', '🍜', ['dry_zhajiang_noodle', 'soup_wonton_noodle']],
  ['冰店老闆', 'the shaved ice shop owner', '🍧', ['ice_mango', 'douhua_peanutsoft']],
  ['點心師傅', 'a dim sum chef', '🥟', ['steam_xlb', 'dumpling_jleek']],
];
const MAKE_LINES = [T('聽說你很厲害，做一杯給我看看！', 'I hear you’re good. Show me!'), T('我想看看你的手藝，要做到標準喔。', 'Let’s see your craft. It has to be up to standard.')];

// ------------------------------------------------------------------ special guests (secret ones don't show who they are)
const VIPS = [
  ['米其林秘密客', 'A Michelin inspector', '🕵️', true, 40, 3], ['美食評論家', 'A food critic', '🧐', true, 25, 2], ['神秘美食家', 'A mysterious gourmet', '🎩', true, 25, 2],
  ['網紅直播主', 'A live-streaming influencer', '🤳', false, 20, 2], ['電視台記者', 'A TV reporter', '🎤', false, 20, 2], ['知名演員', 'A famous actor', '🎬', false, 22, 3],
  ['微服出巡的市長', 'The mayor, incognito', '🏛️', true, 30, 2], ['茶藝大師', 'A tea master', '🍵', false, 25, 2], ['職棒選手', 'A pro baseball player', '⚾', false, 18, 2],
  ['人氣歌手', 'A pop singer', '🎵', false, 22, 3], ['日本美食作家', 'A Japanese food writer', '✒️', true, 28, 2], ['必比登推介評審', 'A Bib Gourmand judge', '🍽️', true, 35, 3],
  ['旅遊雜誌編輯', 'A travel magazine editor', '📰', true, 24, 2], ['外國大使', 'A foreign ambassador', '🎖️', false, 26, 3], ['退休的總鋪師', 'A retired banquet chef', '👨‍🍳', false, 22, 2],
  ['料理節目主持人', 'A cooking show host', '📺', false, 24, 2], ['開箱 YouTuber', 'An unboxing YouTuber', '▶️', false, 20, 2], ['美食評審團', 'A panel of food judges', '📋', true, 30, 3],
  ['五星飯店主廚', 'A five-star hotel chef', '⭐', false, 24, 2], ['老字號茶行老闆', 'The owner of an old tea merchant', '🏮', true, 26, 2],
];

// ------------------------------------------------------------------ difficult customers and dilemmas
// each choice: [zh, en, rep, money, chance of the good outcome (1 = always), what happens zh, en]
const C = (zh, en, rep, money, chance, rz, re) => ({ zh, en, rep, money, chance, rz, re });
const CHOICES = [
  ['嫌太甜的奧客', 'Too sweet!', '😤', '客人喝了一口大叫：「太甜了吧！」但他點的是全糖。', 'A guest shouts “Far too sweet!”, though he ordered full sugar.', [C('免費幫他重做一杯少糖', 'Remake it with less sugar, free', 4, -30, 1, '他喝了說「這樣剛好」，還給了五星評論', 'He loved it and left five stars'), C('笑笑解釋全糖本來就比較甜', 'Smile and explain full sugar is sweet', 2, 0, 0.6, '他想了想，下次點了半糖', 'He thought about it and ordered half sugar next time')]],
  ['要免費加料的客人', 'Free toppings please', '🙄', '客人說：「我是常客，珍珠免費加一下啦！」', '“I’m a regular, throw in the pearls for free!”', [C('這次招待，謝謝支持', 'On the house this once, thanks', 3, -10, 1, '他很開心，帶了朋友來', 'He was delighted and brought friends'), C('推薦集點卡，集滿送一杯', 'Offer a loyalty card instead', 2, 20, 0.8, '他辦了一張，馬上又買一杯', 'He signed up and bought another')]],
  ['插隊的客人', 'A queue jumper', '😠', '有人直接插到排隊的最前面。', 'Someone cuts straight to the front of the queue.', [C('有禮貌地請他重新排隊', 'Politely ask him to queue', 4, 0, 1, '排隊的客人都給你鼓掌', 'The queue applauds you'), C('先幫他點，免得吵起來', 'Serve him quickly to avoid a fuss', 0, 40, 1, '他很快就走了', 'He left quickly')]],
  ['揚言給負評', 'Threatening a bad review', '📱', '客人說：「不打折我就去網路上給一星！」', '“Give me a discount or I’ll post one star!”', [C('不打折，但真誠道歉並送小菜', 'No discount, but a sincere sorry and a snack', 5, -15, 0.8, '他反而寫了好評', 'He ended up writing a good review'), C('照價收費，相信其他客人', 'Charge as normal and trust your regulars', 2, 30, 0.7, '別的客人都幫你說話', 'Other guests stood up for you')]],
  ['說自己是網紅', 'A self-declared influencer', '🤳', '有人說：「我是網紅，請我喝我幫你宣傳！」', '“I’m an influencer: free drinks and I’ll promote you!”', [C('請他喝一杯試試看', 'Give him one and see', 2, -40, 0.4, '他真的幫你宣傳了，客人變多', 'He really did post: more guests came'), C('請他先付錢，喜歡再分享', 'Ask him to pay, and share if he likes it', 2, 40, 1, '他付了錢，還是拍了照', 'He paid, and posted anyway')]],
  ['大聲講電話', 'A loud phone call', '📞', '一位客人在店裡大聲講電話，別人都皺眉。', 'A guest is on a very loud phone call; others are frowning.', [C('輕聲請他到門外講', 'Quietly ask him to step outside', 4, 0, 1, '店裡又安靜下來了', 'Peace returns'), C('把收音機音樂調大一點', 'Turn the radio up a little', 2, 0, 1, '大家都在聽歌了', 'Everyone is listening to the music now')]],
  ['自帶外食', 'Outside food', '🍱', '一群學生帶了雞排進來，只點一杯飲料。', 'Students bring in fried chicken and order one drink.', [C('沒關係，送他們餐巾紙', 'Fine, hand them napkins', 4, 0, 1, '他們下次都來吃你的麵', 'Next time they all ate your noodles'), C('推薦店裡的滷味配飲料', 'Suggest your braised plate with it', 2, 60, 0.7, '他們加點了兩盤', 'They ordered two plates')]],
  ['帶狗進來', 'A dog comes in', '🐕', '客人牽著一隻大狗進門。', 'A guest walks in with a big dog.', [C('請他坐門口的位子，給狗一碗水', 'Seat them by the door with a bowl of water', 5, 0, 1, '大家都在摸狗，氣氛超好', 'Everyone is petting the dog; lovely atmosphere'), C('說明店內不能帶寵物，可以外帶', 'Explain: no pets inside, but takeaway is fine', 1, 50, 1, '他外帶了兩杯', 'He took two to go')]],
  ['喝完說沒點', '“I never ordered that”', '🤨', '客人喝完一大半才說：「這不是我點的。」', 'Half-way through, a guest says: “This isn’t what I ordered.”', [C('查一下點單，真的錯了就重做', 'Check the ticket; remake if it really was wrong', 3, -20, 1, '原來是店員聽錯，客人很滿意你的處理', 'The staff had misheard; he was happy with how you handled it'), C('請他看收據，好好溝通', 'Show the receipt and talk it through', 2, 30, 0.6, '他笑著承認記錯了', 'He laughed and admitted his mistake')]],
  ['要求做菜單上沒有的', 'Off-menu request', '🤔', '客人想要「鐵觀音加芋泥加黑糖加奶蓋」。', 'A guest wants Tieguanyin plus taro plus brown sugar plus cheese foam.', [C('建議比較搭的組合', 'Suggest a combination that works', 4, 30, 1, '他說：「你們真的懂茶！」', '“You really know your tea!”'), C('照做，客人最大', 'Make it, the customer is king', 1, 60, 0.5, '他喝完說…好像有點怪', 'He drank it and said… it was a bit odd')]],
  ['搶位子吵架', 'A fight over seats', '😡', '兩組客人為了一張桌子吵起來。', 'Two groups argue over one table.', [C('幫他們併桌，送一盤小菜', 'Push tables together, send a snack', 5, -20, 1, '兩組人最後聊成朋友', 'They ended up friends'), C('請先來的坐，另一組優先排下一桌', 'First come first served, the other gets the next table', 3, 0, 1, '大家都覺得公平', 'Everyone thinks it fair')]],
  ['小孩打翻飲料', 'A spilled drink', '🧃', '小朋友把整杯珍奶打翻了，媽媽很不好意思。', 'A child knocks over a whole bubble tea; the mother is mortified.', [C('馬上收拾，再送一杯', 'Clean up and bring another, free', 6, -40, 1, '媽媽感動到成了常客', 'She became a regular'), C('收拾乾淨，半價再做一杯', 'Clean up and offer a new one at half price', 3, 20, 1, '媽媽連聲道謝', 'She thanked you again and again')]],
  ['要求打八折', 'Asks for 20% off', '💸', '客人說：「我買三杯，打八折吧？」', '“I’m buying three, 20% off?”', [C('買三杯送一份滷味', 'Buy three, get a braised plate free', 3, 40, 1, '他很滿意', 'He was pleased'), C('照價，但多送一份珍珠', 'Full price, but extra pearls', 2, 60, 0.8, '他說也可以', 'He said fair enough')]],
  ['嫌冰塊太多', 'Too much ice', '🧊', '客人說：「冰塊比飲料多！」', '“There’s more ice than drink!”', [C('換一杯少冰，多補一點飲料', 'Swap for less ice, top it up', 4, -15, 1, '他說這家很有良心', '“An honest shop,” he said'), C('說明正常冰的份量，下次可以選少冰', 'Explain regular ice, suggest less ice next time', 2, 0, 1, '他記下來了', 'He made a note')]],
  ['下雨天沒帶傘', 'Caught in the rain', '☔', '一位客人淋得濕透，看起來很冷。', 'A guest comes in soaked and shivering.', [C('借他一把傘，送一杯熱薑茶', 'Lend an umbrella, give a hot ginger tea', 6, -15, 1, '他後來帶整個辦公室來', 'He later brought his whole office'), C('推薦熱飲', 'Recommend a hot drink', 2, 40, 1, '他點了熱奶茶', 'He ordered a hot milk tea')]],
  ['占位子讀書一整天', 'Studying all day', '📚', '有個學生點一杯坐了五個小時。', 'A student has sat five hours on one drink.', [C('隨他，學生讀書不容易', 'Let him be; studying is hard', 3, 0, 1, '他考上後送你一張感謝卡', 'He passed his exam and sent you a thank-you card'), C('客滿時禮貌地請他併桌', 'When full, ask politely to share the table', 2, 30, 1, '他很配合', 'He was happy to')]],
  ['要用廁所不消費', 'Just the toilet', '🚻', '路人問能不能借廁所。', 'A passer-by asks to use the toilet.', [C('當然可以', 'Of course', 3, 0, 1, '他出來買了一杯', 'He came out and bought a drink'), C('借，順便遞一張菜單', 'Yes, and hand him a menu', 2, 35, 0.7, '他點了外帶', 'He ordered to go')]],
  ['醉漢進門', 'A drunk wanders in', '🍺', '一個喝醉的人走進店裡大聲唱歌。', 'A drunk man stumbles in, singing loudly.', [C('請他坐下，送一杯溫開水', 'Sit him down with warm water', 4, 0, 1, '他清醒後一直道謝', 'Sober, he thanked you over and over'), C('打電話請他的家人來接', 'Call his family to fetch him', 3, 0, 1, '家人很感謝你', 'His family were grateful')]],
  ['懷疑食材不新鮮', 'Is it fresh?', '🔍', '客人問：「你們的鮮奶是今天的嗎？」', '“Is your milk from today?”', [C('拿出今天的鮮奶給他看日期', 'Show him today’s carton and date', 5, 0, 1, '他很放心，推薦給朋友', 'Reassured, he recommended you'), C('請他試喝一口', 'Offer him a taste', 3, 20, 1, '他喝了直接點一杯', 'He tasted and ordered')]],
  ['外送訂單弄錯', 'A wrong delivery', '🛵', '外送平台送錯了，客人打電話來抱怨。', 'A delivery went to the wrong place; the customer calls to complain.', [C('馬上重做一份請外送員再送', 'Remake it and send it again', 5, -40, 1, '客人給了五星', 'Five stars'), C('退款並送一張優惠券', 'Refund and a voucher', 3, -20, 1, '客人說下次再訂', 'He’ll order again')]],
  ['嫌珍珠不夠Q', 'Pearls not chewy', '🫧', '客人說今天的珍珠太軟。', 'A guest says today’s pearls are too soft.', [C('道歉，重新煮一鍋新的', 'Apologise and cook a fresh pot', 5, -30, 1, '新的珍珠超Q，大家都說讚', 'The new batch is perfect; everyone loves it'), C('換成椰果給他', 'Swap them for coconut jelly', 2, 0, 1, '他接受了', 'He accepted')]],
  ['硬要坐滿的包廂', 'Wants the whole low table', '🪑', '一個人想自己坐四人的和室桌。', 'One guest wants the four-seat low table to himself.', [C('可以，但客滿時要分享', 'Yes, but share when it gets busy', 3, 0, 1, '他很爽快地答應', 'He agreed happily'), C('建議他坐窗邊的雙人桌', 'Suggest the two-seat by the window', 2, 0, 1, '他說窗邊更好', 'He preferred the window anyway')]],
  ['要求店員陪聊', 'A lonely regular', '🗣️', '一位老先生每天都來，想找人聊天。', 'An old man comes every day, wanting someone to talk to.', [C('陪他聊十分鐘', 'Chat with him ten minutes', 5, 0, 1, '他說這是他一天最開心的時候', 'He says it’s the best part of his day'), C('介紹他認識其他常客', 'Introduce him to other regulars', 4, 0, 1, '他們組了一個下棋社', 'They formed a chess club')]],
  ['臨時要大量外帶', 'A sudden big takeaway', '🥤', '有人突然要外帶 15 杯，說五分鐘內要。', 'Someone wants 15 drinks to go, in five minutes.', [C('老實說需要 15 分鐘', 'Tell him honestly it takes 15 minutes', 3, 150, 1, '他願意等', 'He waited'), C('全店先停下來做他的', 'Stop everything for his order', 1, 200, 1, '他拿到了，但排隊的人有點不開心', 'He got them, but the queue was unhappy')]],
  ['抱怨太吵', 'Too noisy', '🔊', '客人說隔壁桌太吵。', 'A guest says the next table is too loud.', [C('幫他換到安靜的角落', 'Move him to a quiet corner', 4, 0, 1, '他很感謝', 'He was grateful'), C('送他一份點心表示歉意', 'Send a snack as an apology', 3, -15, 1, '他笑了', 'He smiled')]],
  ['問能不能插電充電', 'Can I charge my phone?', '🔌', '客人手機快沒電了。', 'A guest’s phone is about to die.', [C('借他插座和充電線', 'Lend a socket and cable', 4, 0, 1, '他坐下又點了一杯', 'He sat down and ordered another'), C('指給他櫃台旁的插座', 'Point to the socket by the counter', 2, 0, 1, '他道謝', 'He thanked you')]],
  ['遺失錢包', 'A lost wallet', '👛', '店員撿到一個錢包。', 'The staff find a wallet.', [C('照證件聯絡失主', 'Contact the owner from the ID', 7, 0, 1, '失主送來一面感謝錦旗', 'The owner brought you a thank-you banner'), C('交給附近的派出所', 'Hand it to the police box', 5, 0, 1, '警察說你們是好店家', 'The police called you a good shop')]],
  ['有人想學做珍奶', 'Teach me!', '🧑‍🎓', '一位客人問能不能教他做珍珠奶茶。', 'A guest asks you to teach them bubble tea.', [C('開一堂小小的體驗課', 'Run a little class', 6, 80, 1, '體驗課大受歡迎', 'The class was a hit'), C('分享一點小訣竅', 'Share a few tips', 3, 0, 1, '他說會常來', 'He’ll be back')]],
  ['要求看廚房', 'Show me the kitchen', '👀', '客人想看看你的廚房乾不乾淨。', 'A guest wants to see whether your kitchen is clean.', [C('大方帶他參觀', 'Proudly show him round', 6, 0, 1, '他在網路上大推「超乾淨」', 'He posted “spotless!”'), C('請他看門口的衛生評鑑', 'Point to the hygiene certificate', 3, 0, 1, '他放心了', 'He was reassured')]],
  ['生日的客人', 'A birthday', '🎂', '客人說今天是他生日。', 'A guest says it’s their birthday.', [C('全店唱生日快樂歌', 'The whole shop sings Happy Birthday', 6, 0, 1, '他感動到哭', 'He was moved to tears'), C('送一份布丁', 'Give a pudding', 4, -15, 1, '他拍照打卡', 'He posted a photo')]],
  ['被拍照不開心', 'Unhappy at photos', '📸', '一位客人不想被網紅拍進直播裡。', 'A guest doesn’t want to be in an influencer’s stream.', [C('請網紅避開其他客人', 'Ask the influencer to avoid other guests', 4, 0, 1, '兩邊都滿意', 'Both are satisfied'), C('幫客人換到不會入鏡的位子', 'Move the guest out of shot', 3, 0, 1, '他謝謝你的體貼', 'He thanks you for the care')]],
  ['客人是素食者', 'A vegetarian', '🥬', '客人問有沒有素食可以吃。', 'A guest asks what is vegetarian.', [C('推薦麻醬麵（不加肉燥）和豆花', 'Recommend sesame noodles and tofu pudding', 4, 50, 1, '他吃得很開心', 'He ate happily'), C('誠實說明哪些有肉', 'Explain honestly which have meat', 3, 20, 1, '他很信任你', 'He trusts you')]],
  ['過敏的客人', 'An allergy', '⚠️', '客人說他對花生過敏。', 'A guest says they’re allergic to peanuts.', [C('仔細確認他點的沒有花生', 'Check his order has no peanuts', 5, 0, 1, '他說很少店這麼細心', '“Few places are this careful”'), C('提醒廚房換乾淨的器具', 'Have the kitchen use clean utensils', 5, 0, 1, '他放心地吃完', 'He ate without worry')]],
  ['拿到假鈔', 'A fake note', '💵', '收銀發現一張千元鈔好像是假的。', 'The till finds a 1000 note that looks fake.', [C('有禮貌地請客人換一張', 'Politely ask for another note', 3, 0, 1, '客人說他也是被騙的，換了真鈔', 'He had been fooled too, and swapped it'), C('報警處理', 'Call the police', 2, 0, 1, '警察說你們處理得很好', 'The police praised you')]],
  ['阿伯要賒帳', 'Pay you tomorrow', '🧓', '常來的阿伯忘了帶錢。', 'A regular uncle forgot his wallet.', [C('沒關係，明天再給', 'No problem, tomorrow', 4, 0, 0.9, '他隔天多給了一百塊', 'He paid back with 100 extra'), C('請他喝，算招待', 'It’s on the house', 4, -30, 1, '他到處說你們有人情味', 'He tells everyone how kind you are')]],
  ['有人要辦求婚', 'A proposal', '💍', '客人想在你的店裡求婚。', 'A guest wants to propose in your shop.', [C('全力幫忙佈置', 'Help decorate', 8, -50, 1, '她答應了！全店歡呼', 'She said yes! The shop cheers'), C('借他角落的位子', 'Lend him the corner table', 4, 0, 1, '很溫馨', 'So sweet')]],
  ['外國客人看不懂菜單', 'Can’t read the menu', '🌏', '外國客人看不懂中文菜單。', 'A foreign guest can’t read the Chinese menu.', [C('用手機翻譯，推薦招牌', 'Translate and recommend your signature', 4, 60, 1, '他說是在台灣喝過最好喝的', '“Best I’ve had in Taiwan”'), C('畫圖給他看', 'Draw pictures', 4, 40, 1, '他把你的畫拍下來留念', 'He kept your drawing')]],
  ['隔壁店來挖角', 'Poaching your staff', '🕴️', '隔壁店想挖走你最好的店員。', 'The shop next door tries to poach your best staff member.', [C('加薪留人', 'Give a raise', 4, -100, 1, '店員更有幹勁了', 'Your staff are fired up'), C('和店員好好聊聊', 'Have a heart-to-heart', 3, 0, 0.8, '店員決定留下', 'They decided to stay')]],
  ['供應商漲價', 'Supplier price rise', '📦', '茶葉供應商說下個月要漲價。', 'Your tea supplier is raising prices next month.', [C('一次多進一點貨', 'Stock up now', 2, 120, 1, '省了一筆錢', 'You saved a good sum'), C('去坪林直接跟茶農買', 'Buy direct from Pinglin farmers', 4, 80, 1, '茶更新鮮了', 'Fresher tea too')]],
  ['停電了', 'A power cut', '🔌', '整條街突然停電十分鐘。', 'The whole street loses power for ten minutes.', [C('點蠟燭，送每桌一杯冷泡茶', 'Light candles and give each table cold-brew tea', 6, -40, 1, '大家覺得好浪漫', 'Everyone found it romantic'), C('先收現金，用手寫單', 'Cash only, hand-written tickets', 3, 50, 1, '生意照做', 'Business carries on')]],
];

// ------------------------------------------------------------------ questions customers really ask (one right answer)
const QUIZ = [
  ['綠茶適合用幾度的水泡？', 'What water temperature suits green tea?', ['約 80°C', '剛滾的 100°C', '40°C 溫水'], ['About 80°C', 'Boiling, 100°C', 'Lukewarm, 40°C'], 0, '綠茶怕燙，太熱會苦澀。', 'Green tea scalds: too hot turns it bitter.'],
  ['鐵觀音為什麼要用滾水泡？', 'Why is Tieguanyin brewed with boiling water?', ['球狀焙火的烏龍要高溫才泡得開', '為了殺菌', '為了比較快'], ['Rolled, roasted oolong needs heat to open', 'To kill germs', 'To be quicker'], 0, '緊結的球狀茶葉需要高溫才舒展、出味。', 'Tightly rolled leaves only unfurl and give flavour in very hot water.'],
  ['為什麼水果茶通常不加鮮奶？', 'Why don’t fruit teas get fresh milk?', ['果酸會讓牛奶結塊', '因為太貴', '因為顏色不好看'], ['Fruit acid curdles milk', 'It’s too expensive', 'The colour looks bad'], 0, '酸會讓奶蛋白凝結，口感變差。', 'Acid sets the milk proteins, ruining the texture.'],
  ['東方美人茶的蜜香從哪裡來？', 'Where does Oriental Beauty’s honey note come from?', ['小綠葉蟬叮咬過的茶葉', '加了蜂蜜', '用蜂蜜烘焙'], ['Leaves bitten by tea jassids', 'Added honey', 'Roasted with honey'], 0, '茶葉被小綠葉蟬叮咬後產生特殊的蜜香。', 'Leaves bitten by the green leafhopper develop the honey aroma.'],
  ['東方美人茶又被叫做什麼？', 'What else is Oriental Beauty called?', ['膨風茶', '凍頂茶', '碧螺春'], ['Peng Feng (“bragging”) tea', 'Dong Ding', 'Biluochun'], 0, '因為好喝得讓人不敢相信，被說是「膨風」（吹牛）。', 'So good people thought the sellers were bragging: “peng feng”.'],
  ['台茶 18 號的名字是？', 'What is TTES No. 18 called?', ['紅玉', '金萱', '翠玉'], ['Ruby', 'Jin Xuan', 'Cui Yu'], 0, '台茶 18 號是日月潭的紅玉紅茶，有肉桂和薄荷香。', 'TTES 18 is Sun Moon Lake’s Ruby black tea, with cinnamon and mint notes.'],
  ['金萱是台茶幾號？', 'Which TTES number is Jin Xuan?', ['12 號', '13 號', '18 號'], ['No. 12', 'No. 13', 'No. 18'], 0, '金萱是台茶 12 號，有淡淡的奶香。翠玉是 13 號。', 'Jin Xuan is TTES 12, with a light milky note; Cui Yu is 13.'],
  ['文山包種茶主要產在哪裡？', 'Where is Wenshan Pouchong mainly grown?', ['新北坪林', '南投鹿谷', '台東鹿野'], ['Pinglin, New Taipei', 'Lugu, Nantou', 'Luye, Taitung'], 0, '坪林是包種茶的故鄉，還有茶業博物館。', 'Pinglin is pouchong’s home, with its own tea museum.'],
  ['凍頂烏龍產在哪裡？', 'Where does Dong Ding oolong come from?', ['南投鹿谷', '新北坪林', '花蓮瑞穗'], ['Lugu, Nantou', 'Pinglin, New Taipei', 'Ruisui, Hualien'], 0, '凍頂山在南投鹿谷。', 'Dong Ding mountain is in Lugu, Nantou.'],
  ['煮水餃時「點三次水」是為了什麼？', 'Why add cold water three times when boiling dumplings?', ['讓皮不破、餡煮熟', '讓水變多', '讓水餃變大'], ['So skins hold and filling cooks', 'To have more water', 'To make them bigger'], 0, '加冷水讓水溫降下來，外皮不會煮破，裡面也熟透。', 'Cold water calms the boil so skins don’t burst while the filling cooks through.'],
  ['黑糖珍珠鮮奶為什麼不搖？', 'Why isn’t brown sugar boba milk shaken?', ['保留杯壁的虎紋', '怕珍珠破掉', '因為會太冰'], ['To keep the tiger stripes', 'The pearls would break', 'It would get too cold'], 0, '轉杯讓黑糖掛在杯壁，一搖紋路就糊了。', 'The syrup is swirled onto the cup; shaking would smear it.'],
  ['冬瓜茶的甜味主要從哪裡來？', 'Where does winter melon tea’s sweetness come from?', ['冬瓜和糖一起熬成的糖磚', '代糖', '蜂蜜'], ['Melon cooked down with sugar into blocks', 'Sweetener', 'Honey'], 0, '冬瓜加二砂糖熬煮成冬瓜糖磚，再加水煮成冬瓜露。', 'Melon and cane sugar are cooked into blocks, then boiled with water.'],
  ['嘉義雞肉飯傳統用什麼肉？', 'What meat is in traditional Chiayi chicken rice?', ['火雞肉', '烏骨雞', '鴨肉'], ['Turkey', 'Silkie chicken', 'Duck'], 0, '嘉義「雞肉飯」其實多是火雞肉絲，淋雞油、撒紅蔥酥。', 'Chiayi “chicken” rice is mostly shredded turkey with fat and shallots.'],
  ['滷肉飯的肉通常用哪個部位？', 'Which cut goes into braised pork rice?', ['帶皮豬五花', '豬里肌', '雞胸肉'], ['Skin-on pork belly', 'Pork loin', 'Chicken breast'], 0, '帶皮五花肉滷到軟Q，油脂和膠質最香。', 'Skin-on belly braised soft: the fat and gelatin make it.'],
  ['珍珠是用什麼做的？', 'What are tapioca pearls made from?', ['樹薯粉', '糯米粉', '麵粉'], ['Cassava starch', 'Glutinous rice', 'Wheat flour'], 0, '珍珠是樹薯粉（木薯澱粉）做的。', 'They’re made from cassava (tapioca) starch.'],
  ['「波霸」和「珍珠」差在哪？', 'What’s the difference between boba and pearls?', ['波霸顆粒比較大', '波霸是白色的', '波霸是甜的'], ['Boba are bigger', 'Boba are white', 'Boba are sweet'], 0, '波霸是大顆的粉圓。', 'Boba are simply the large pearls.'],
  ['四季春是哪一類茶？', 'What kind of tea is Four Seasons?', ['輕發酵的烏龍茶', '紅茶', '綠茶'], ['A lightly oxidised oolong', 'A black tea', 'A green tea'], 0, '四季春是台灣的烏龍品種，一年四季都能採，香氣清揚。', 'A Taiwanese oolong cultivar picked year-round, light and floral.'],
  ['紅茶是哪一種發酵？', 'How oxidised is black tea?', ['全發酵', '不發酵', '半發酵'], ['Fully', 'Not at all', 'Half'], 0, '紅茶是全發酵茶；綠茶不發酵；烏龍是部分發酵。', 'Black tea is fully oxidised; green not at all; oolong in between.'],
  ['綠茶是哪一種發酵？', 'How oxidised is green tea?', ['不發酵', '全發酵', '後發酵'], ['Not at all', 'Fully', 'Post-fermented'], 0, '綠茶殺青後不發酵，保留清新的香氣。', 'Green tea is heated early so it never oxidises.'],
  ['普洱茶產自哪裡？', 'Where does Pu’er come from?', ['中國雲南', '日本靜岡', '印度阿薩姆'], ['Yunnan, China', 'Shizuoka, Japan', 'Assam, India'], 0, '普洱茶產自雲南，是後發酵茶。', 'Pu’er comes from Yunnan and is post-fermented.'],
  ['傳統豆花用什麼讓豆漿凝固？', 'What sets traditional tofu pudding?', ['石膏', '吉利丁', '太白粉'], ['Gypsum', 'Gelatin', 'Potato starch'], 0, '傳統豆花用食用石膏點漿，口感綿密。', 'Food-grade gypsum sets the soy milk into a silky pudding.'],
  ['愛玉是從什麼做的？', 'What is aiyu jelly made from?', ['愛玉子搓洗出的膠質', '洋菜', '海藻'], ['Gel washed out of aiyu seeds', 'Agar', 'Seaweed'], 0, '愛玉子包在布袋裡在水中搓洗，膠質會讓水凝固。', 'Aiyu seeds are rubbed in water in a cloth bag; their gel sets it.'],
  ['仙草凍是用什麼做的？', 'What is grass jelly made from?', ['仙草乾熬煮', '海藻', '黑糖'], ['Boiled dried mesona plant', 'Seaweed', 'Brown sugar'], 0, '仙草是一種植物，曬乾後熬煮加澱粉就成了仙草凍。', 'Mesona is a plant; dried, boiled and thickened, it sets into jelly.'],
  ['粉粿傳統用什麼粉做？', 'What flour makes fen guo?', ['地瓜粉', '麵粉', '玉米粉'], ['Sweet potato starch', 'Wheat flour', 'Corn starch'], 0, '粉粿用地瓜粉做，Q彈透明。', 'Sweet potato starch gives it the clear, springy bite.'],
  ['小籠包的湯汁從哪裡來？', 'Where does the soup in soup dumplings come from?', ['餡裡拌了豬皮凍', '蒸的時候灌進去', '包之前加水'], ['Pork aspic mixed into the filling', 'Injected while steaming', 'Water added first'], 0, '豬皮凍拌進肉餡，蒸的時候融化成湯。', 'Pork aspic in the filling melts into soup as it steams.'],
  ['蛋餅皮什麼時候蓋上去？', 'When does the crepe go onto the egg?', ['蛋還沒凝固時', '蛋全熟之後', '先煎皮再打蛋'], ['While the egg is still wet', 'Once the egg is cooked', 'Fry the crepe first'], 0, '趁蛋液還沒凝固蓋上，蛋才會黏住餅皮。', 'Laid on wet egg so the two stick together.'],
  ['鍋貼底下那片脆脆的「冰花」是什麼？', 'What is the crisp lace under potstickers?', ['麵粉水煎乾的脆皮', '起司', '炸過的蛋'], ['Flour water fried dry', 'Cheese', 'Fried egg'], 0, '淋一圈麵粉水蓋鍋燜，水收乾就成了冰花。', 'A ring of flour water, lid on; when it dries it becomes lace.'],
  ['茶泡太久會怎樣？', 'What happens if tea steeps too long?', ['變苦澀', '變甜', '沒有變化'], ['It turns bitter', 'It gets sweeter', 'Nothing'], 0, '茶多酚和咖啡因釋出太多，會苦澀。', 'Too many tannins come out: bitter and astringent.'],
  ['煮麵要等水怎樣才下麵？', 'When should noodles go in?', ['水滾了', '水溫溫的', '冷水就下'], ['At a full boil', 'When it’s warm', 'In cold water'], 0, '水滾才下麵，麵才不會糊。', 'Only at a boil, or they go gluey.'],
  ['雪花冰和傳統剉冰差在哪？', 'Snow ice versus shaved ice?', ['雪花冰用加了奶的冰磚刨成薄片', '雪花冰比較硬', '雪花冰不能加料'], ['Snow ice is shaved from a milk ice block', 'Snow ice is harder', 'Snow ice has no toppings'], 0, '雪花冰的冰磚本身有奶或風味，刨成綿綿的薄片。', 'Its ice block is flavoured with milk and shaved into soft ribbons.'],
  ['牛肉麵裡的「酸菜」是什麼醃的？', 'What is the pickled green in beef noodles?', ['芥菜', '高麗菜', '白菜'], ['Mustard greens', 'Cabbage', 'Napa cabbage'], 0, '酸菜是芥菜醃漬發酵的。', 'Fermented mustard greens.'],
  ['奶蓋茶為什麼不插吸管？', 'Why no straw with cheese foam tea?', ['就著杯口一起喝到奶蓋和茶', '吸管會壞掉', '比較環保'], ['To get foam and tea together from the rim', 'The straw would break', 'It’s greener'], 0, '用吸管只會喝到下面的茶，就著杯口才喝得到奶蓋。', 'A straw drinks only the tea; from the rim you get both.'],
  ['刷抹茶用的工具叫什麼？', 'What whisks matcha?', ['茶筅', '茶匙', '濾網'], ['A chasen (bamboo whisk)', 'A tea spoon', 'A strainer'], 0, '茶筅是竹子做的刷子，能把抹茶刷出泡沫。', 'A split-bamboo whisk that froths matcha.'],
  ['抹茶用滾水沖會怎樣？', 'What does boiling water do to matcha?', ['變苦', '變甜', '變紅'], ['Makes it bitter', 'Makes it sweet', 'Turns it red'], 0, '抹茶用約 80°C 的水，太燙會苦澀。', 'Use about 80°C; boiling water makes it bitter.'],
  ['燒仙草是冷的還是熱的？', 'Is shao xiancao hot or cold?', ['熱的', '冷的', '常溫'], ['Hot', 'Cold', 'Room temperature'], 0, '燒仙草是冬天的熱甜品，加花生、芋圓。', 'A hot winter dessert with peanuts and taro balls.'],
  ['刈包裡通常夾什麼？', 'What goes in a gua bao?', ['控肉、酸菜、花生粉、香菜', '炸雞、生菜', '蛋和起司'], ['Pork belly, pickled greens, peanut powder, coriander', 'Fried chicken and lettuce', 'Egg and cheese'], 0, '傳統刈包夾滷五花、酸菜、花生糖粉和香菜。', 'Braised belly, pickled greens, sweet peanut powder and coriander.'],
  ['蘿蔔糕主要用什麼做？', 'What is turnip cake made from?', ['在來米漿和白蘿蔔', '糯米和紅蘿蔔', '麵粉和馬鈴薯'], ['Rice batter and daikon', 'Glutinous rice and carrot', 'Flour and potato'], 0, '在來米磨漿加白蘿蔔絲蒸成。', 'Long-grain rice batter with grated daikon, steamed.'],
  ['三杯雞的「三杯」是哪三樣？', 'What are the three cups in three-cup chicken?', ['麻油、米酒、醬油', '油、鹽、糖', '水、酒、醋'], ['Sesame oil, rice wine, soy sauce', 'Oil, salt, sugar', 'Water, wine, vinegar'], 0, '一杯麻油、一杯米酒、一杯醬油，最後加九層塔。', 'A cup each of sesame oil, rice wine and soy, finished with basil.'],
  ['「微糖」大約是全糖的幾分？', 'Roughly how sweet is “light sugar”?', ['約三分', '約七分', '跟全糖一樣'], ['About 30%', 'About 70%', 'Same as full'], 0, '一般手搖店：微糖約三分、半糖五分、少糖七分。', 'At most shops: light ~30%, half 50%, less ~70%.'],
  ['蜜香紅茶的蜜香和東方美人一樣來自？', 'Honey-scent black tea gets its honey note from…', ['小綠葉蟬叮咬', '加蜂蜜', '炭焙'], ['Tea jassid bites', 'Added honey', 'Charcoal roasting'], 0, '和東方美人一樣，是小綠葉蟬叮咬後的茶葉做的。', 'Like Oriental Beauty, from leaves bitten by the leafhopper.'],
];

// ------------------------------------------------------------------ rushes: a crowd on its way
const RUSHES = [
  ['學校放學了', 'School’s out', '🎒', 2.5], ['突然下大雨', 'A sudden downpour', '🌧️', 2], ['颱風前大家都來買', 'Everyone stocking up before the typhoon', '🌀', 2.5], ['演唱會散場', 'A concert lets out', '🎤', 3], ['廟會遶境經過', 'A temple procession passes', '🏮', 3],
  ['夜市開市了', 'The night market opens', '🌃', 2.5], ['跨年夜', 'New Year’s Eve', '🎆', 3], ['中秋節烤肉', 'Mid-Autumn barbecues', '🌕', 2.5], ['端午節龍舟賽', 'Dragon boat races', '🐉', 2.5], ['情人節', 'Valentine’s Day', '💘', 2],
  ['母親節', 'Mother’s Day', '💐', 2], ['附近的運動會', 'A sports day nearby', '🏃', 2.5], ['期末考結束', 'Exams are over', '📝', 2.5], ['週末市集', 'The weekend market', '🧺', 2], ['附近公司發年終', 'Bonuses paid next door', '💰', 2.5],
  ['電影散場', 'A film lets out', '🎬', 2], ['熱浪來襲', 'A heatwave', '🔥', 3], ['寒流來了（熱飲大賣）', 'A cold snap (hot drinks!)', '🥶', 2], ['你的店上了新聞', 'Your shop is on the news', '📰', 3], ['網路上爆紅', 'You went viral', '📈', 3],
];

// ------------------------------------------------------------------ bulk orders
const ORDERS = [
  ['公司下午茶', 'Office afternoon tea', '🏢', 'boba', 20], ['婚禮喜宴', 'A wedding banquet', '💒', 'melon', 60], ['補習班', 'A cram school', '📚', 'lemon', 30], ['醫院護理站', 'A hospital nurses’ station', '🏥', 'latte_black', 12], ['工地師傅', 'A building site', '🏗️', 'melon_black', 25],
  ['里長辦活動', 'The neighbourhood chief’s event', '🎪', 'melon', 40], ['籃球隊', 'A basketball team', '🏀', 'lemon', 15], ['讀書會', 'A book club', '📖', 'pure_pouchong', 10], ['拍片劇組', 'A film crew', '🎥', 'milk_black', 30], ['生日派對', 'A birthday party', '🎉', 'brownboba', 12],
  ['公司尾牙', 'A company year-end banquet', '🧧', 'rice_lurou', 50], ['幼兒園', 'A kindergarten', '🧸', 'douhua_redbean', 20], ['社區媽媽教室', 'A community mothers’ class', '👩‍👧', 'taro', 15], ['旅行團', 'A tour group', '🚌', 'boba', 40], ['選舉造勢晚會', 'An election rally', '📣', 'melon', 100],
  ['初一十五拜拜', 'Temple offerings', '🙏', 'steam_porkbun', 20], ['喬遷之喜', 'A housewarming', '🏠', 'foam_fourseason', 16], ['畢業典禮', 'A graduation', '🎓', 'fruit_passion_green_coconut', 30], ['社區運動會', 'A community sports day', '🥇', 'melon_lemon', 50], ['熬夜的工程師', 'Engineers pulling an all-nighter', '💻', 'noodle', 8],
];

export const EVENTS = [
  ...PEOPLE.flatMap(([zh, en, icon, pids], i) => pids.map((pid, k) => ({ id: `make_${i}_${k}`, kind: 'make', icon, who: T(zh, en), line: MAKE_LINES[k], pid, target: 70 + ((i + k) % 4) * 5, rep: 4 + ((i * 3 + k) % 6), money: 60 + ((i * 7 + k * 3) % 5) * 40, special: zh.includes('無糖') ? { sweet: 0, label: T('無糖', 'no sugar') } : null }))),
  ...VIPS.map(([zh, en, icon, secret, rep, mult], i) => ({ id: `vip_${i}`, kind: 'vip', icon, who: T(zh, en), secret, rep, mult })),
  ...CHOICES.map(([zh, en, icon, sz, se, opts], i) => ({ id: `choice_${i}`, kind: 'choice', icon, who: T(zh, en), line: T(sz, se), opts })),
  ...QUIZ.map(([qz, qe, az, ae, ok, xz, xe], i) => ({ id: `quiz_${i}`, kind: 'quiz', icon: '❓', who: T('客人想問', 'A guest asks'), line: T(qz, qe), answers: az.map((a, k) => T(a, ae[k])), ok, why: T(xz, xe) })),
  ...RUSHES.map(([zh, en, icon, mult], i) => ({ id: `rush_${i}`, kind: 'rush', icon, who: T(zh, en), mult })),
  ...ORDERS.map(([zh, en, icon, pid, n], i) => ({ id: `order_${i}`, kind: 'order', icon, who: T(zh, en), pid, n, target: 70 })),
];
// answers are shuffled when shown, so the right one isn't always first
export function shuffled(ev, seed) { const idx = ev.answers.map((_, i) => i); for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(((seed * 9301 + i * 49297) % 233280) / 233280 * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } return idx; }
