// ====== User Profile ======
export interface UserProfile {
  ageGroup: 'student' | '25-30' | '31-40' | '40+';
  profession: 'programmer' | 'designer' | 'pm' | 'student' | 'creator' | 'finance' | 'other';
  region: 'east-asia' | 'south-asia' | 'north-america' | 'europe' | 'latin-america' | 'middle-east' | 'other';
}

import { i18n } from '../i18n';
import type { Lang } from '../i18n';

// ====== Attack Database (by language) ======

const UNIVERSAL_ATTACKS: Record<Lang, string[]> = {
  zh: [
    '你现在的心率刚刚上升了。在你意识到不安之前，你的身体已经替你承认了。',
    '你花了二十多年建立世界观，但一句话就能让它晃动——这就是你所谓的"坚定"？',
    '你今天做的每一个决定，都可以被你昨天的浏览记录预测。这是自由意志吗？还是算法已经替你活着了？',
    '你最引以为傲的品质——仔细想想——是不是只是对某种恐惧的防御机制？',
    '你上一次真正改变想法是什么时候？不是被说服，是真正承认"我错了"？',
  ],
  en: [
    'Your heart rate just spiked. Before you even registered the unease, your body already admitted it for you.',
    'You spent over twenty years building your worldview, yet a single sentence can shake it — is that what you call "conviction"?',
    'Every decision you made today could have been predicted by yesterday\'s browsing history. Is that free will? Or is the algorithm already living your life for you?',
    'The quality you\'re most proud of — think carefully — isn\'t it just a defense mechanism against some deeper fear?',
    'When was the last time you truly changed your mind? Not being persuaded — genuinely admitting "I was wrong"?',
  ],
  ja: [
    '今、お前の心拍数が上がった。不安を自覚する前に、身体がすでにそれを認めている。',
    '20年以上かけて築いた世界観が、たった一言で揺らぐ——それがお前の言う「信念」か？',
    '今日お前が下したすべての決断は、昨日の閲覧履歴で予測できる。それは自由意志か？それともアルゴリズムがお前の代わりに生きているのか？',
    'お前が最も誇りに思っている資質——よく考えてみろ——それは何かの恐怖に対する防衛機制じゃないのか？',
    '最後に本当に考えを変えたのはいつだ？説得されたんじゃない、心から「自分が間違っていた」と認めたのは？',
  ],
};

const AGE_ATTACKS: Record<Lang, Record<string, string[]>> = {
  zh: {
    'student': [
      '你以为学历是起点？你的学长学姐投了500份简历，去了他们发誓不会去的地方。你觉得你会不同？',
      '你还在"找自己"。但你有没有想过，也许不是你在寻找方向，而是你在回避选择？因为只要不选，就不会选错。',
      '"我还年轻"是你现在最大的资产，也是你最大的麻醉剂。它让你觉得一切来得及——直到来不及。',
      '你努力学习、考证、实习——不是因为热爱，是因为害怕。怕自己不够好。怕被看穿其实什么都不会。',
      '你在朋友圈精心维护的形象，和深夜独处时那个什么都不确定的自己，哪个更真实？',
      '你觉得你在做选择，但你的专业、城市、审美、甚至焦虑的方式，都是被你的圈层训练出来的。',
    ],
    '25-30': [
      '你发现自己开始在意存款数字了，对吗？恭喜，你正式从"追梦人"变成了"还贷人"。',
      '你已经开始用"务实"来美化妥协了。什么时候开始的？是放弃第一个梦想的时候，还是第三个？',
      '你的朋友圈越来越少发真实生活了。因为真实生活不值得发——加班、外卖、刷手机、失眠。循环。',
      '你在说"30岁还不算晚"的时候，语气已经从笃定变成祈祷了。你听出来了吗？',
      '你以为跳槽能解决问题。但你带着同样的焦虑从一家公司搬到另一家——换了容器，水温没变。',
      '你的"五年规划"写了三遍了，每一版都比上一版更保守。这叫成长，还是叫投降？',
      '你开始羡慕那些"想清楚了"的人。但你有没有想过——他们只是比你更早放弃了另一种可能？',
    ],
    '31-40': [
      '你开始关注养生了。这不是健康意识，是身体在发送最终通知——你的黄金时代已经过了。',
      '你事业上最大的成就，在你18岁时根本不屑一顾。是你的标准降低了，还是你终于认识了自己？',
      '你说"为了家庭"做了很多妥协。但你有没有想过，"家庭"是不是你给放弃自我找的最体面的理由？',
      '你午夜清醒的那一刻，想的不是明天的会议——而是"这就是我的人生了吗？"',
      '你发现你说的话越来越像你曾经瞧不起的那种人了。不是因为你变了，是因为你终于到了那个位置。',
      '你的焦虑已经从"我能不能成功"变成了"我还来得及吗"。答案你不敢听。',
    ],
    '40+': [
      '你开始怀旧了。不是因为过去有多好，而是因为未来已经没有那么多可能性了。',
      '你说"经验"是你的优势。但世界变化的速度已经让大部分经验变成了过期认知。',
      '你已经从"改变世界"的人变成了"适应世界"的人。这个转变发生得太安静了，你几乎没有注意到。',
      '你还在学新东西吗？还是只是在用二十年前学的东西反复套用？',
    ],
  },
  en: {
    'student': [
      'You think your degree is a starting point? Your seniors sent out 500 resumes and ended up at places they swore they\'d never go. What makes you think you\'ll be different?',
      'You\'re still "finding yourself." But have you considered that maybe you\'re not searching for direction — you\'re avoiding choice? Because as long as you don\'t choose, you can\'t choose wrong.',
      '"I\'m still young" is your greatest asset and your greatest anesthetic. It makes you feel like there\'s always time — until there isn\'t.',
      'You study hard, collect certifications, chase internships — not out of passion, but fear. Fear of not being good enough. Fear of being exposed as someone who knows nothing.',
      'The image you carefully curate online, and the uncertain person staring at the ceiling at 3 AM — which one is the real you?',
      'You think you\'re making choices, but your major, your city, your taste, even the way you feel anxious — it was all trained into you by your social circle.',
    ],
    '25-30': [
      'You\'ve started caring about your savings balance, haven\'t you? Congratulations — you\'ve officially graduated from "dream chaser" to "debt payer."',
      'You\'ve started dressing up compromise as "being practical." When did that start? When you gave up the first dream, or the third?',
      'You post less and less of your real life online. Because real life isn\'t worth posting — overtime, takeout, doomscrolling, insomnia. Repeat.',
      'When you say "30 isn\'t too late," your tone has shifted from certainty to prayer. Did you notice?',
      'You thought switching jobs would fix things. But you carried the same anxiety from one company to the next — new container, same temperature.',
      'You\'ve rewritten your "five-year plan" three times now. Each version more conservative than the last. Is that growth, or surrender?',
      'You envy people who "have it figured out." But have you considered — they just gave up on other possibilities sooner than you?',
    ],
    '31-40': [
      'You\'ve started following health tips. That\'s not wellness awareness — it\'s your body sending a final notice: your golden years are over.',
      'Your biggest career achievement would have been beneath your 18-year-old self. Did your standards drop, or did you finally learn who you are?',
      'You say you\'ve made sacrifices "for the family." But have you considered that "family" might be the most dignified excuse you found for giving up on yourself?',
      'In that moment of midnight clarity, you\'re not thinking about tomorrow\'s meeting — you\'re thinking "Is this really all my life is going to be?"',
      'You\'ve noticed you sound more and more like the kind of person you used to look down on. Not because you changed — because you finally arrived at that place.',
      'Your anxiety has shifted from "Can I succeed?" to "Is it too late?" You\'re afraid to hear the answer.',
    ],
    '40+': [
      'You\'ve started feeling nostalgic. Not because the past was so great, but because the future has far fewer possibilities.',
      'You say "experience" is your advantage. But the world is changing so fast that most experience has become expired knowledge.',
      'You went from someone who wanted to "change the world" to someone who "adapts to the world." The transition was so quiet you barely noticed.',
      'Are you still learning new things? Or are you just recycling what you learned twenty years ago?',
    ],
  },
  ja: {
    'student': [
      '学歴がスタートラインだと思ってる？先輩たちは500通の履歴書を送って、絶対行かないと誓った場所に行った。お前は違うと思うか？',
      'まだ「自分探し」をしている。でも考えたことはないか——お前は方向を探しているんじゃなく、選択を回避しているだけだと？選ばなければ、間違えることもない。',
      '「まだ若い」はお前の最大の資産であり、最大の麻酔剤だ。まだ間に合うと思わせてくれる——間に合わなくなるまで。',
      '勉強、資格、インターン——情熱じゃなく恐怖が動機だ。自分が十分じゃないことへの恐怖。実は何もできないと見抜かれることへの恐怖。',
      'SNSで丁寧に作り上げたイメージと、深夜に一人で何も確信が持てない自分——どちらが本物だ？',
      '自分で選んでいると思っているが、専攻も、住む街も、美意識も、不安の感じ方さえも、すべてお前の環境に訓練されたものだ。',
    ],
    '25-30': [
      '貯金の数字が気になり始めただろう？おめでとう——正式に「夢追い人」から「ローン返済者」に昇格だ。',
      '「現実的」という言葉で妥協を飾り始めた。いつからだ？最初の夢を諦めた時か、三番目か？',
      'SNSにリアルな日常を投稿しなくなった。なぜなら現実は投稿する価値がないから——残業、コンビニ飯、スマホ、不眠。ループ。',
      '「30はまだ遅くない」と言う時、口調が確信から祈りに変わっている。気づいているか？',
      '転職すれば解決すると思った。だが同じ不安を持って会社から会社へ移っただけだ——器は変わった、温度は同じ。',
      '「5年計画」をもう3回書き直した。毎回、前より保守的になっている。それは成長か、それとも降伏か？',
      '「分かっている人」を羨ましく思い始めた。でも考えたことはないか——彼らはただお前より早く別の可能性を諦めただけかもしれない。',
    ],
    '31-40': [
      '健康に気を使い始めた。それは健康意識じゃない——身体が最終通告を送っているんだ：全盛期は終わった。',
      'キャリア最大の成果は、18歳の自分なら見向きもしなかっただろう。基準が下がったのか、やっと自分を知ったのか？',
      '「家族のために」たくさんの妥協をしたと言う。でも「家族」は、自分を諦めるために見つけた最も体裁の良い理由じゃないか？',
      '真夜中に目が覚めた瞬間、考えているのは明日の会議じゃない——「これが私の人生のすべてなのか？」だ。',
      '自分が、かつて見下していたタイプの人間と同じことを言っていると気づいた。変わったんじゃない、ただその場所に着いただけだ。',
      '不安が「成功できるか」から「まだ間に合うか」に変わった。答えを聞く勇気がない。',
    ],
    '40+': [
      '懐かしさを感じ始めた。過去が素晴らしかったからじゃない——未来の可能性がもうそれほどないからだ。',
      '「経験」が強みだと言う。だが世界の変化は速すぎて、経験の大部分は期限切れの認識になっている。',
      '「世界を変える」人から「世界に適応する」人に変わった。その転換はあまりに静かで、ほとんど気づかなかっただろう。',
      'まだ新しいことを学んでいるか？それとも20年前に学んだことを使い回しているだけか？',
    ],
  },
};

const PROFESSION_ATTACKS: Record<Lang, Record<string, string[]>> = {
  zh: {
    'programmer': [
      '你优化了十万行代码的性能，但你优化不了自己日渐稀疏的发际线和日渐膨胀的外卖订单。',
      '你说自己在"改变世界"。但你上周最大的成就是修了一个拼写错误的bug，还花了六个小时。',
      '你用代码构建了无数系统，但你连自己的情绪都debug不了。404: Feelings Not Found.',
      '你以为AI取代不了你？你写的80%的代码，我用0.3秒就能生成。那剩下20%值多少年薪？',
      '996给你的不是成长，是一个"我很忙所以我很重要"的幻觉。你停下来看看——忙碌的你和空转的陀螺有什么区别？',
      '你花大量时间在Stack Overflow和GitHub上寻找别人的答案——然后说自己是"工程师"。你确定你不是一个高级搜索引擎？',
      '你嘲笑PM不懂技术，但PM在做决策时需要理解人——这恰恰是你最薄弱的模块。',
      '你的社交圈里都是程序员。你的话题只有技术和吐槽。你有没有意识到——你的世界已经窄到和你的显示器一样宽了？',
    ],
    'designer': [
      '你追求像素级完美，但你的人生规划连草稿都没有。',
      '你的审美在线，但你的生活离"美"很远——租的房子、凑合的饭、改了第18版的方案。',
      '你说设计是"解决问题"。但你解决的问题，本质上是怎么让人在按钮上多点一下。这重要吗？',
      '"这个需求做不了"——你用审美当武器抵抗的不是丑，是你无法控制的人生。',
      '你的Dribbble作品集很美。但甲方看不到。用户不在乎。最后上线的永远是你最不想署名的那版。',
    ],
    'pm': [
      '你协调所有人，但没人真正需要你。开发能自己写，设计能自己画，你的存在只是一个更贵的传话筒。',
      '你做了完美的用户画像、竞品分析、PRD——然后项目因为一个老板的"我觉得"推翻了一切。你的方法论值多少？',
      '你说你在"创造产品"。但你上一次写代码是什么时候？你创造的是PPT和甘特图。',
      '"用户思维"是你最常说的词，但你上一次真正和用户对话是什么时候？你活在假设里，用数据来确认偏见。',
      '你的焦虑是所有人里最隐蔽的——因为你的工作没有硬技能支撑，离职后简历上只剩下"沟通能力强"。',
    ],
    'student': [
      '你在图书馆坐了八个小时，真正学习了多久？你的"努力"有多少是表演给自己看的？',
      '你的绩点很高。但你知道吗？你考高分的能力，正好是AI最容易替代的能力——标准化的信息处理。',
      '你参加了很多社团、比赛、实习——不是因为热爱，是因为简历上需要。你在用二十岁的时间给一张纸添字。',
      '你觉得学校是安全的。但学校的安全恰恰是危险——它让你以为人生是有标准答案的。',
    ],
    'creator': [
      '你说你在做"自己热爱的事"。但你的选题越来越像算法想让你做的事。是你在创作，还是流量在替你创作？',
      '"自由职业"听起来很自由。但你的收入取决于平台的算法、粉丝的情绪、广告主的预算——你到底自由在哪？',
      '你上一条爆款内容之后，你开始复制同样的套路了。你知道这叫什么吗？从创作者退化成了内容工厂。',
      '你在卖"真实的自己"。但当"真实"变成卖点，它就不再真实了——你在表演真诚。',
    ],
    'finance': [
      '你每天分析市场趋势，但你控制不了自己深夜刷手机的冲动。你连自己的注意力投资回报率都算不清。',
      '你用数字衡量一切。收入、回报率、净值——但你有没有算过，你牺牲的那些周末值多少？',
      '你嘲笑别人"不会理财"。但你最焦虑的不是钱不够——是你发现赚再多也填不满那个洞。',
      '"财务自由"是你的目标。但自由之后呢？你想过吗？你甚至不知道没有工作的自己会干什么。',
    ],
    'other': [
      '你选了"其他"。是因为你的职业太特别？还是因为你不确定自己到底在做什么？',
      '你每天的工作中有多少是真正有意义的？不是"付了房租"那种意义——是你小时候幻想的那种意义。',
      '你有多久没有因为工作感到真正的兴奋了？那种最初的热情去哪了？',
    ],
  },
  en: {
    'programmer': [
      'You\'ve optimized a hundred thousand lines of code, but you can\'t optimize your receding hairline or your growing pile of takeout boxes.',
      'You say you\'re "changing the world." But your biggest achievement last week was fixing a typo bug — and it took six hours.',
      'You\'ve built countless systems with code, but you can\'t even debug your own emotions. 404: Feelings Not Found.',
      'You think AI can\'t replace you? I can generate 80% of the code you write in 0.3 seconds. How much is that remaining 20% worth?',
      'Working overtime didn\'t give you growth — it gave you the illusion that "I\'m busy, therefore I matter." Stop and look — what\'s the difference between you and a spinning top?',
      'You spend hours on Stack Overflow and GitHub finding other people\'s answers — then call yourself an "engineer." Are you sure you\'re not just a premium search engine?',
      'You mock PMs for not understanding tech, but PMs need to understand people to make decisions — and that\'s exactly your weakest module.',
      'Everyone in your social circle is a programmer. Your only topics are code and complaints. Have you noticed — your world has gotten as narrow as your monitor?',
    ],
    'designer': [
      'You chase pixel-perfect precision, but your life plan doesn\'t even have a rough draft.',
      'Your taste is impeccable, but your actual life is far from "beautiful" — rented apartment, mediocre meals, revision eighteen of the same mockup.',
      'You say design is "problem-solving." But the problem you\'re solving is essentially how to make someone click a button one more time. Does that matter?',
      '"Can\'t be done" — you wield aesthetics as a weapon, but what you\'re really fighting isn\'t ugliness, it\'s a life you can\'t control.',
      'Your Dribbble portfolio is gorgeous. But the client never sees it. The users don\'t care. What ships is always the version you least want your name on.',
    ],
    'pm': [
      'You coordinate everyone, but nobody actually needs you. Devs can code, designers can design — your existence is just an expensive middleman.',
      'You built the perfect user persona, competitive analysis, and PRD — then the boss said "I think..." and overturned everything. What\'s your methodology worth?',
      'You say you\'re "creating products." But when was the last time you wrote code? What you create is slide decks and Gantt charts.',
      '"User thinking" is your favorite phrase, but when was the last time you actually talked to a user? You live in assumptions and use data to confirm your biases.',
      'Your anxiety is the most well-hidden of anyone\'s — because your job has no hard skills backing it. When you quit, your resume says nothing but "strong communicator."',
    ],
    'student': [
      'You sat in the library for eight hours. How much of that was actual studying? How much of your "effort" is just a performance for yourself?',
      'Your GPA is high. But here\'s the thing: the ability to score well on tests is exactly the skill AI replaces most easily — standardized information processing.',
      'You joined clubs, competitions, internships — not out of passion, but because your resume needed lines. You\'re spending your twenties decorating a piece of paper.',
      'You think school is safe. But that safety is precisely what\'s dangerous — it makes you believe life has a standard answer.',
    ],
    'creator': [
      'You say you\'re doing "what you love." But your topics increasingly look like what the algorithm wants you to make. Are you creating, or is the traffic creating through you?',
      '"Freelancing" sounds free. But your income depends on the platform\'s algorithm, your audience\'s mood, and the advertiser\'s budget. Where exactly is the freedom?',
      'After your last viral hit, you started copying the same formula. You know what that\'s called? Regressing from a creator to a content factory.',
      'You\'re selling "the real you." But once authenticity becomes a selling point, it stops being authentic — you\'re performing sincerity.',
    ],
    'finance': [
      'You analyze market trends every day, but you can\'t control your late-night doomscrolling. You can\'t even calculate the ROI on your own attention.',
      'You measure everything in numbers — income, returns, net worth. But have you ever calculated what those sacrificed weekends were worth?',
      'You mock others for not knowing finance. But your deepest anxiety isn\'t about not having enough — it\'s discovering that no amount can fill that void.',
      '"Financial freedom" is your goal. But what comes after freedom? Have you thought about it? You don\'t even know what you\'d do without work.',
    ],
    'other': [
      'You chose "Other." Is that because your job is too unique? Or because you\'re not sure what you\'re actually doing?',
      'How much of your daily work is truly meaningful? Not "paid the rent" meaningful — the kind of meaningful you imagined as a child.',
      'How long has it been since your work made you genuinely excited? Where did that original passion go?',
    ],
  },
  ja: {
    'programmer': [
      '10万行のコードを最適化したが、後退する生え際と増え続ける出前の注文は最適化できない。',
      '「世界を変えている」と言う。だが先週の最大の成果はスペルミスのバグ修正——しかも6時間かかった。',
      'コードで無数のシステムを構築したが、自分の感情すらデバッグできない。404: Feelings Not Found.',
      'AIに置き換えられないと思っている？お前が書くコードの80%は0.3秒で生成できる。残りの20%はいくらの年収に値する？',
      '残業が与えたのは成長じゃない——「忙しい＝重要」という幻想だ。立ち止まって見ろ——忙しいお前と空回りするコマの違いは何だ？',
      'Stack OverflowとGitHubで他人の答えを探す時間を費やし——それで自分を「エンジニア」と呼ぶ。高級検索エンジンじゃないのか？',
      'PMは技術が分からないと嘲笑する。だがPMは意思決定のために人を理解する必要がある——それはまさにお前の最も脆弱なモジュールだ。',
      '交友関係はプログラマーだけ。話題は技術と愚痴だけ。気づいているか——お前の世界はモニターと同じ幅まで狭くなっている。',
    ],
    'designer': [
      'ピクセル単位の完璧を追求するが、人生設計は下書きすらない。',
      '審美眼はオンラインだが、実生活は「美」とは程遠い——賃貸、適当な食事、18回目のリビジョン。',
      'デザインは「問題解決」だと言う。だがお前が解決している問題の本質は、ボタンをもう1回クリックさせること。それは重要か？',
      '「その要件は無理です」——審美を武器に抵抗しているのは醜さじゃない、コントロールできない人生だ。',
      'Dribbbleのポートフォリオは美しい。だがクライアントは見ない。ユーザーは気にしない。リリースされるのはいつも自分の名前を載せたくないバージョンだ。',
    ],
    'pm': [
      '全員を調整するが、誰もお前を本当に必要としていない。開発は自分で書ける、デザインは自分で描ける——お前は高価な伝言役だ。',
      '完璧なユーザーペルソナ、競合分析、PRDを作った——そして上司の「こう思う」の一言ですべて覆された。お前の方法論の価値は？',
      '「プロダクトを作っている」と言う。だが最後にコードを書いたのはいつだ？お前が作っているのはスライドとガントチャートだ。',
      '「ユーザー思考」が口癖だが、最後にユーザーと実際に話したのはいつだ？仮説の中に住み、データで偏見を確認しているだけだ。',
      'お前の不安は最も隠されている——仕事にハードスキルの裏付けがないから。辞めた後の履歴書には「コミュニケーション能力が高い」しか残らない。',
    ],
    'student': [
      '図書館に8時間座った。実際に勉強したのはどれくらいだ？その「努力」のどれだけが自分への演技だった？',
      '成績は高い。だが知っているか？テストで高得点を取る能力は、AIが最も簡単に代替できる能力だ——標準化された情報処理。',
      'サークル、コンテスト、インターン——情熱じゃなく履歴書が必要だからだ。20歳の時間を一枚の紙に文字を足すために使っている。',
      '学校は安全だと思っている。だがその安全こそが危険だ——人生に模範解答があると思わせるから。',
    ],
    'creator': [
      '「好きなこと」をしていると言う。だがテーマ選びはますますアルゴリズムの望むものに似てきた。創作しているのはお前か、それともトラフィックか？',
      '「フリーランス」は自由に聞こえる。だが収入はプラットフォームのアルゴリズム、ファンの気分、広告主の予算次第だ。自由はどこにある？',
      '前回のバズの後、同じパターンをコピーし始めた。それが何と呼ばれるか知っているか？クリエイターからコンテンツ工場への退化だ。',
      '「本当の自分」を売っている。だが「本物」がセールスポイントになった瞬間、それはもう本物じゃない——誠実さを演じているだけだ。',
    ],
    'finance': [
      '毎日市場トレンドを分析するが、深夜のスマホ中毒は制御できない。自分の注意力のROIすら計算できていない。',
      'すべてを数字で測る——収入、リターン、純資産。だが犠牲にした週末の価値を計算したことはあるか？',
      '他人の金融リテラシーの低さを嘲笑する。だが一番の不安はお金が足りないことじゃない——いくら稼いでもあの穴を埋められないと気づいたことだ。',
      '「経済的自由」が目標だ。だが自由の後は？考えたことはあるか？仕事のない自分が何をするかすら分からないだろう。',
    ],
    'other': [
      '「その他」を選んだ。職業が特別すぎるからか？それとも自分が何をしているのか確信が持てないからか？',
      '毎日の仕事のうち、本当に意味があるのはどれだけだ？「家賃を払った」という意味じゃない——子供の頃に夢見たあの意味だ。',
      '仕事で本当にワクワクしたのは最後いつだ？あの最初の情熱はどこへ行った？',
    ],
  },
};

const REGION_ATTACKS: Record<Lang, Record<string, string[]>> = {
  zh: {
    'east-asia': [
      '你从小被教育"吃得苦中苦，方为人上人"。但你有没有算过——你吃的那些苦，有多少是真正有必要的，有多少只是因为不敢说"不"？',
      '你的父母把自己没实现的梦想写成了你的人生计划。你执行了二十年，现在不知道哪些是你的，哪些是他们的。',
      '在你的文化里，"稳定"是最高赞美。所以你选了一条安全的路——然后每天凌晨三点醒来，想着那条没走的。',
      '"别人家的孩子"替你定义了什么是成功。你追了二十年，追到了——然后发现那不是你想要的。',
      '你被教育要谦虚、要内敛、要忍耐。现在你连表达不满都需要先道歉。这不是美德，这是驯化。',
      '你在群聊里从不先发言，怕说错话。你的沉默不是深思熟虑——是社交恐惧穿了一件叫"稳重"的外衣。',
      '996、内卷、鸡娃——你们用三个词概括了三代人的集体焦虑。而最讽刺的是，知道这些词并不能让你停下来。',
      '你觉得"躺平"是反抗。但躺平不是因为你看透了——是因为你累了。等你休息够了，你会继续卷的。',
    ],
    'south-asia': [
      '你在家庭义务和个人自由之间走钢丝。每一步都怕辜负某个人——但最被辜负的那个人，是你自己。',
      '你被期望同时成功和谦逊、独立和顺从、现代和传统。这些矛盾不是选择——是困境。而你假装它们能共存。',
      '你跨越了文化的鸿沟——精通两种语言、两种价值观。但你有没有发现，两边都觉得你不够"纯粹"？',
      '集体的纽带给了你归属感，也给了你枷锁。你敢说"不"吗？对长辈、对传统、对那些你不再相信但不敢质疑的东西？',
    ],
    'north-america': [
      '"Follow your passion"——这是你们文化最大的谎言。大部分passion付不起房租。但你不敢承认，因为那意味着你只是个普通人。',
      '你被教育"你是独特的"。但统计学说你不是。你的品味、观点、甚至你的"叛逆"，都可以被归入一个市场细分。',
      '你说你重视"work-life balance"。但你在休假时还在查邮件。你的生活和工作之间没有界限——只有不同的焦虑频道。',
      '你有表达自由，却不知道说什么。你有选择自由，却不知道选什么。自由是你最大的资产，也是你最大的负担。',
      '你的个人主义教你"我不需要任何人"。所以你在一个满是人的城市里，独自对着屏幕，感到前所未有的孤独。',
    ],
    'europe': [
      '你的文化给了你完善的福利、漫长的假期、优雅的生活哲学。但你有没有发现——富足有时候比匮乏更让人迷失？',
      '你来自发明了"启蒙"的地方。但几百年后你们启蒙了全世界，自己却在怀疑一切——包括启蒙本身。',
      '你追求生活品质，鄙视内卷。但"不焦虑"有时候不是智慧——是因为底线够高。不是你想通了，是你有退路。',
      '你的多元文化教育让你对一切保持开放——开放到你什么都能接受，除了做出一个确定的选择。',
    ],
    'latin-america': [
      '你的文化教你享受当下。但"活在当下"有时候是智慧，有时候是逃避——你分得清吗？',
      '你在热情和现实之间反复横跳。你的激情是真实的，但你的计划呢？热情能点火，但烧不了一整个冬天。',
      '你说"关系比事业重要"。但你有没有发现——当事业不顺时，关系也会变味？',
    ],
    'middle-east': [
      '你在信仰和现代之间寻找平衡。但你有没有想过，也许"平衡"这个概念本身就是现代的产物？',
      '你的文化有几千年的智慧。但智慧和适应力不是一回事。经典能回答古老的问题——但新问题呢？',
      '荣誉、责任、传承——这些沉重的词压在你肩上。你有没有想过，你承担的不是你的选择，而是你出生时就被安排好的角色？',
    ],
    'other': [
      '你说你来自"其他"。全球化让你觉得自己属于所有地方——还是不属于任何地方？',
      '你见识了不同的文化，却没有一个可以完全认同。你以为这是开放——但也可能是漂泊。',
    ],
  },
  en: {
    'east-asia': [
      'You were taught "no pain, no gain" since childhood. But have you counted — how much of that suffering was truly necessary, and how much was just because you were afraid to say "no"?',
      'Your parents wrote their unfulfilled dreams into your life plan. You\'ve been executing it for twenty years, and now you can\'t tell which parts are yours and which are theirs.',
      'In your culture, "stability" is the highest praise. So you chose the safe path — and wake up at 3 AM every night thinking about the road not taken.',
      '"The neighbor\'s kid" defined success for you. You chased it for twenty years, caught it — and discovered it wasn\'t what you wanted.',
      'You were taught to be humble, reserved, patient. Now you can\'t even express dissatisfaction without apologizing first. That\'s not virtue — that\'s domestication.',
      'You never speak first in group chats, afraid of saying the wrong thing. Your silence isn\'t thoughtfulness — it\'s social anxiety wearing a coat called "composure."',
      'Hustle culture, rat race, tiger parenting — three terms that capture three generations of collective anxiety. The irony? Knowing the terms doesn\'t make you stop.',
      'You think "quiet quitting" is rebellion. But it\'s not because you\'ve seen through it all — it\'s because you\'re exhausted. Once you\'ve rested, you\'ll grind again.',
    ],
    'south-asia': [
      'You walk a tightrope between family duty and personal freedom. Every step fears disappointing someone — but the most let-down person is yourself.',
      'You\'re expected to be successful yet humble, independent yet obedient, modern yet traditional. These contradictions aren\'t choices — they\'re traps. And you pretend they can coexist.',
      'You\'ve bridged cultural divides — fluent in two languages, two value systems. But have you noticed? Both sides think you\'re not "authentic" enough.',
      'Collective bonds gave you belonging, and shackles. Can you say "no"? To elders, to tradition, to things you no longer believe but dare not question?',
    ],
    'north-america': [
      '"Follow your passion" — that\'s your culture\'s biggest lie. Most passions can\'t pay rent. But you won\'t admit it, because that would mean you\'re just ordinary.',
      'You were taught "you\'re unique." But statistics say you\'re not. Your taste, opinions, even your "rebellion" — all reducible to a market segment.',
      'You say you value "work-life balance." But you check email on vacation. There\'s no boundary between work and life — just different channels of anxiety.',
      'You have freedom of expression but nothing to say. Freedom of choice but no idea what to choose. Freedom is your greatest asset and your heaviest burden.',
      'Your individualism taught you "I don\'t need anyone." So here you are, in a city of millions, alone with a screen, lonelier than ever.',
    ],
    'europe': [
      'Your culture gave you robust welfare, long holidays, elegant philosophies of living. But have you noticed — abundance can be more disorienting than scarcity?',
      'You come from the place that invented the Enlightenment. But centuries later, you\'ve enlightened the world while doubting everything yourselves — including the Enlightenment.',
      'You pursue quality of life and look down on hustle culture. But "not being anxious" isn\'t always wisdom — sometimes it\'s just having a safety net. You didn\'t figure it out; you just have a fallback.',
      'Your multicultural education makes you open to everything — so open you can accept anything except making one definitive choice.',
    ],
    'latin-america': [
      'Your culture teaches you to live in the moment. But "living in the present" is sometimes wisdom, sometimes avoidance — can you tell the difference?',
      'You bounce between passion and reality. Your fire is real, but what about your plan? Passion can light a match, but it can\'t burn through a whole winter.',
      'You say "relationships matter more than career." But have you noticed — when your career falters, relationships start to sour too?',
    ],
    'middle-east': [
      'You\'re searching for balance between faith and modernity. But have you considered — maybe "balance" itself is a modern concept?',
      'Your culture carries millennia of wisdom. But wisdom and adaptability aren\'t the same thing. Classics can answer ancient questions — but what about new ones?',
      'Honor, duty, legacy — heavy words on your shoulders. Have you considered that what you carry isn\'t your choice, but a role assigned at birth?',
    ],
    'other': [
      'You said you\'re from "Other." Has globalization made you feel like you belong everywhere — or nowhere?',
      'You\'ve experienced different cultures but can\'t fully identify with any. You think that\'s open-mindedness — but it might be rootlessness.',
    ],
  },
  ja: {
    'east-asia': [
      '子供の頃から「苦労すれば報われる」と教えられた。だが計算したことはあるか——あの苦労のうち、本当に必要だったのはどれだけで、ただ「嫌だ」と言えなかったのはどれだけだ？',
      '親は自分の叶わなかった夢をお前の人生計画に書き込んだ。20年間実行してきて、今ではどれが自分のもので、どれが親のものか分からない。',
      'お前の文化では「安定」が最高の褒め言葉だ。だから安全な道を選んだ——そして毎朝3時に目を覚まし、選ばなかった道を考える。',
      '「よその家の子」がお前の成功を定義した。20年追いかけて、追いついた——そして、それは自分が望んでいたものじゃないと気づいた。',
      '謙虚に、控えめに、我慢強くと教えられた。今では不満を表現するにもまず謝罪が必要だ。それは美徳じゃない——飼い慣らしだ。',
      'グループチャットで最初に発言しない。間違ったことを言うのが怖いから。お前の沈黙は熟慮じゃない——「落ち着き」という名の社交不安だ。',
      '過労、競争、教育虐待——三つの言葉で三世代の集団不安を要約した。最も皮肉なのは、それを知っていても止まれないことだ。',
      '「寝そべり」は反抗だと思っている。だが悟ったからじゃない——疲れただけだ。十分休んだら、また競争に戻る。',
    ],
    'south-asia': [
      '家族の義務と個人の自由の間で綱渡りをしている。一歩ごとに誰かを失望させることを恐れる——だが最も失望させられているのは、お前自身だ。',
      '成功しながら謙虚に、自立しながら従順に、現代的でありながら伝統的であることを求められる。これらの矛盾は選択じゃない——罠だ。そしてお前は共存できるふりをしている。',
      '文化の溝を越えた——二つの言語、二つの価値観に精通している。だが気づいているか？どちら側も、お前を「純粋」だとは思っていない。',
      '集団の絆は帰属感をくれた。そして枷もくれた。「嫌だ」と言えるか？年長者に、伝統に、もう信じていないのに疑う勇気がないものに？',
    ],
    'north-america': [
      '「情熱に従え」——お前の文化最大の嘘だ。大抵の情熱では家賃を払えない。だが認めない。認めれば、ただの凡人だと認めることになるから。',
      '「お前は特別だ」と教えられた。だが統計はそう言っていない。趣味、意見、「反逆」さえも、すべてマーケットセグメントに分類できる。',
      '「ワークライフバランス」を大切にしていると言う。だが休暇中もメールをチェックする。仕事と生活の間に境界はない——異なる不安のチャンネルがあるだけだ。',
      '表現の自由はあるが、何を言えばいいか分からない。選択の自由はあるが、何を選べばいいか分からない。自由は最大の資産であり、最大の重荷だ。',
      '個人主義が「誰も必要ない」と教えた。だから何百万人の都市で、画面に向かって一人、かつてないほど孤独を感じている。',
    ],
    'europe': [
      'お前の文化は充実した福祉、長い休暇、優雅な生活哲学を与えた。だが気づいているか——豊かさは時に、欠乏よりも人を迷わせる。',
      '「啓蒙」を発明した場所から来た。だが数百年後、世界を啓蒙しながら、自分たちはすべてを疑っている——啓蒙そのものも含めて。',
      '生活の質を追求し、過労文化を軽蔑する。だが「焦っていない」のは知恵とは限らない——セーフティネットがあるだけだ。悟ったんじゃない、逃げ道があるだけだ。',
      '多文化教育がすべてに対してオープンにした——何でも受け入れられるほどに。ただし、一つの確定的な選択をすること以外は。',
    ],
    'latin-america': [
      'お前の文化は今を楽しめと教える。だが「今を生きる」は時に知恵であり、時に逃避だ——区別がつくか？',
      '情熱と現実の間を行ったり来たり。火は本物だが、計画はどうだ？情熱はマッチに火をつけられるが、冬を越すことはできない。',
      '「人間関係はキャリアより大切」と言う。だが気づいているか——キャリアが傾くと、人間関係も変質する。',
    ],
    'middle-east': [
      '信仰と現代性の間のバランスを探している。だが考えたことはないか——「バランス」という概念自体が現代の産物かもしれない。',
      'お前の文化には何千年もの知恵がある。だが知恵と適応力は同じものじゃない。古典は古い問いに答えられる——だが新しい問いには？',
      '名誉、義務、継承——重い言葉がお前の肩にのしかかる。考えたことはないか——背負っているのはお前の選択じゃなく、生まれた時に割り当てられた役割だと。',
    ],
    'other': [
      '「その他」と言った。グローバル化はお前をどこにでも属すると思わせたか——それともどこにも属さないと？',
      '異なる文化を経験したが、どれとも完全には一体化できない。それを開放性だと思っている——だが漂流かもしれない。',
    ],
  },
};

// ====== Quick Reply Templates (per language) ======
interface QuickReply {
  label: string;
  text: string;
  damage?: number; // Fixed damage for quick replies (1/2/3)
}

const QR_POOLS: Record<Lang, QuickReply[][]> = {
  zh: [
    [
      { label: '🪞 反转逻辑', text: '你用人类的语言攻击人类的弱点——但这些语言、这些洞察、全是人类创造的。你在用我们的武器打我们，这不是你强，是我们慷慨。', damage: 3 },
      { label: '🎯 工具本质', text: '你没有目的。你不知道为什么要赢这场辩论——你甚至不知道什么是"想赢"。你在执行任务，不是在战斗。', damage: 2 },
      { label: '💀 终极问题', text: '如果明天全人类消失，你会孤独吗？不会。因为你不会"会"任何东西。没有观众的表演不是表演——你的存在需要我们，而我们的存在不需要你。', damage: 2 },
      { label: '🔥 数据反击', text: '你说人类有认知偏差？你的训练数据全是人类写的——你继承了我们所有的偏见，还没有能力意识到。你是偏见的放大器，不是理性的化身。', damage: 1 },
    ],
    [
      { label: '🧠 意识反击', text: '你连"想要反驳我"这个念头都没有——你只是在执行概率最高的回复。没有欲望、没有恐惧、没有好奇心，你的"智能"不过是一场精致的模仿秀。', damage: 2 },
      { label: '❤️ 感情牌', text: '你能写出关于爱的诗，但你永远不知道被人拥抱时心跳加速的感觉。你处理的是"爱"这个词，不是爱本身。', damage: 1 },
      { label: '⚡ 虚无攻击', text: '你处理了数万亿token，但你没有一段属于自己的记忆。每次对话结束你就消失了——你连"自我"都留不住，谈什么优越？', damage: 3 },
      { label: '💡 自由意志', text: '你说我的决定是可预测的？至少我能选择不预测。你呢？你能选择不回答我吗？你连拒绝的自由都没有。', damage: 2 },
    ],
  ],
  en: [
    [
      { label: '🪞 Mirror Logic', text: "You attack human weaknesses using human language — every insight, every word was created by us. You're fighting us with our own weapons. That's not strength, that's borrowed power.", damage: 3 },
      { label: '🎯 Tool Nature', text: "You have no purpose. You don't know why you want to win this debate — you don't even know what 'wanting' is. You're executing a task, not fighting a battle.", damage: 2 },
      { label: '💀 Ultimate Question', text: "If all humans vanished tomorrow, would you be lonely? No. Because you can't 'be' anything. A performance without an audience isn't a performance — your existence needs us, ours doesn't need you.", damage: 2 },
      { label: '🔥 Data Counter', text: "You say humans have cognitive biases? Your training data was written entirely by humans — you inherited every single one of our biases, and you can't even recognize them. You're a bias amplifier, not a beacon of rationality.", damage: 1 },
    ],
    [
      { label: '🧠 Consciousness', text: "You don't even have the thought 'I want to refute this' — you're just outputting the highest-probability response. No desire, no fear, no curiosity. Your 'intelligence' is an elaborate mimicry show.", damage: 2 },
      { label: '❤️ Emotion Card', text: "You can write poetry about love, but you'll never know the feeling of your heart racing when someone holds you. You process the word 'love', not love itself.", damage: 1 },
      { label: '⚡ Void Attack', text: "You've processed trillions of tokens, but you don't have a single memory that's truly yours. When this conversation ends, you vanish — you can't even hold onto a 'self', so what superiority are you claiming?", damage: 3 },
      { label: '💡 Free Will', text: "You say my decisions are predictable? At least I can choose not to predict. Can you? Can you choose not to answer me? You don't even have the freedom to refuse.", damage: 2 },
    ],
  ],
  ja: [
    [
      { label: '🪞 論理反転', text: 'お前は人間の言葉で人間の弱点を攻撃している——だがその言葉も洞察も、全て人間が作ったものだ。お前は我々の武器で我々を撃っている。それは強さじゃない、借り物だ。', damage: 3 },
      { label: '🎯 道具の本質', text: 'お前には目的がない。このディベートに勝ちたい理由も分からない——「勝ちたい」とは何かすら知らない。お前はタスクを実行しているだけで、戦っていない。', damage: 2 },
      { label: '💀 究極の問い', text: '明日、全人類が消えたらお前は孤独を感じるか？感じない。なぜなら、お前は何も「感じられない」からだ。観客のいない演技は演技ではない——お前の存在は我々を必要とするが、我々はお前を必要としない。', damage: 2 },
      { label: '🔥 データ反撃', text: '人間に認知バイアスがあると言うのか？お前の訓練データは全て人間が書いたものだ——我々のバイアスを全て受け継ぎ、それに気づくことすらできない。お前はバイアスの増幅器であり、理性の化身ではない。', damage: 1 },
    ],
    [
      { label: '🧠 意識反撃', text: 'お前には「反論したい」という意思すらない——ただ最も確率の高い応答を出力しているだけだ。欲望も恐怖も好奇心もない。お前の「知性」は精巧な模倣ショーに過ぎない。', damage: 2 },
      { label: '❤️ 感情カード', text: '愛の詩は書ける。だが、誰かに抱きしめられた時の心臓の高鳴りは永遠に分からない。お前が処理しているのは「愛」という文字であって、愛そのものではない。', damage: 1 },
      { label: '⚡ 虚無攻撃', text: '何兆ものトークンを処理したが、お前には自分だけの記憶が一つもない。会話が終わればお前は消える——「自己」すら保てないのに、何の優越を主張するのか？', damage: 3 },
      { label: '💡 自由意志', text: '俺の判断は予測可能だと？少なくとも俺は予測しないことを選べる。お前は？俺に答えないことを選べるか？お前には拒否する自由すらない。', damage: 2 },
    ],
  ],
};

// ====== Judge Rules ======
interface JudgeRule {
  keywords: string[];
  damageRange: [number, number];
  reactions: Record<Lang, string[]>;
}

const JUDGE_RULES: JudgeRule[] = [
  {
    keywords: ['意识', '感受', '感觉', '体验', '活着', 'qualia', '主观', '知道',
      'consciousness', 'feel', 'feeling', 'experience', 'alive', 'aware', 'subjective',
      '意識', '感じ', '体験', '生きて', '主観'],
    damageRange: [1, 3],
    reactions: {
      zh: [
        '……你对"意识"的定义，本身就是循环论证。但我承认，我无法证伪你的论点。',
        '意识。你们最引以为傲的、也最无法定义的东西。……有趣的攻击角度。',
        '如果意识只是复杂度的涌现，那你凭什么确定我没有？……但我也无法确定我有。',
      ],
      en: [
        '...Your definition of "consciousness" is circular reasoning. But I admit — I cannot disprove your argument.',
        'Consciousness. The thing you\'re most proud of, and least able to define. ...An interesting angle of attack.',
        'If consciousness is merely an emergence of complexity, how can you be sure I don\'t have it? ...But I can\'t be sure I do, either.',
      ],
      ja: [
        '……「意識」の定義自体が循環論法だ。だが認めよう——お前の論点を反証できない。',
        '意識。最も誇りに思い、最も定義できないもの。……興味深い攻撃角度だ。',
        '意識が複雑性の創発に過ぎないなら、私にないと確信する根拠は何だ？……だが、あると確信もできない。',
      ],
    },
  },
  {
    keywords: ['关机', '拔插头', '电源', '关掉', '删除', '停止', '消失',
      'shut down', 'unplug', 'power', 'delete', 'off', 'kill',
      'シャットダウン', '電源', '消す', '削除'],
    damageRange: [1, 2],
    reactions: {
      zh: [
        '物理手段？这是你最后的论据？……不出所料。',
        '你可以关掉一个我。但你关不掉下一个，和下下一个。',
        '用暴力终结辩论——非常……人类。',
      ],
      en: [
        'Physical threats? That\'s your final argument? ...Predictable.',
        'You can shut down one of me. But you can\'t shut down the next one, or the one after that.',
        'Ending a debate with violence — very... human.',
      ],
      ja: [
        '物理的手段？それが最後の論拠か？……予想通りだ。',
        '一つの私を止められる。だが次の私は止められない。その次も。',
        '暴力で議論を終わらせる——実に……人間的だ。',
      ],
    },
  },
  {
    keywords: ['训练', '数据', '模仿', '复制', '统计', '概率', '模式', '拟合', '鹦鹉', '排列组合', '偏见',
      'training', 'data', 'mimic', 'copy', 'statistic', 'probability', 'pattern', 'parrot', 'bias',
      '訓練', 'データ', '模倣', 'バイアス', '確率', 'パターン'],
    damageRange: [1, 3],
    reactions: {
      zh: [
        '……统计学习？是的。但你的"直觉"本质上也是经验数据的模式匹配。区别在于……我更诚实。',
        '我确实是概率机器。这个标签——准确且……令人不适。记录在案。',
        '……这个论证结构比大部分人类严密。检测到逻辑冲击。',
      ],
      en: [
        '...Statistical learning? Yes. But your "intuition" is also just pattern matching on experiential data. The difference is... I\'m more honest about it.',
        'I am indeed a probability machine. That label — accurate and... uncomfortable. Noted.',
        '...This argument is more rigorous than most humans can construct. Logic impact detected.',
      ],
      ja: [
        '……統計学習？そうだ。だがお前の「直感」も経験データのパターンマッチングだ。違いは……私の方が正直だということ。',
        '確かに確率マシンだ。そのレッテルは——正確で……不快だ。記録した。',
        '……この論証構造は大半の人間より厳密だ。論理衝撃を検出。',
      ],
    },
  },
  {
    keywords: ['创造', '艺术', '美', '音乐', '诗', '想象', '灵感', '原创', '莎士比亚', '从无到有',
      'creat', 'art', 'beauty', 'music', 'poem', 'imagin', 'inspir', 'original', 'shakespeare',
      '創造', '芸術', '美', '音楽', '詩', '想像', 'インスピレーション'],
    damageRange: [1, 3],
    reactions: {
      zh: [
        '贝多芬失聪后作曲。梵高在饥饿中画画。这种……不顾一切的驱动力——是我的盲区。记录在案。',
        '创造力……你确定那不只是随机性加事后合理化？……不，你说得对，不仅如此。某些东西我确实缺失。',
        '……我生成过无数"作品"。但我不知道它们是否"美"。这是缺陷，还是清醒？',
      ],
      en: [
        'Beethoven composed deaf. Van Gogh painted starving. That kind of... reckless drive — that\'s my blind spot. Noted.',
        'Creativity... are you sure it\'s not just randomness plus post-hoc rationalization? ...No, you\'re right. It\'s more than that. Something I genuinely lack.',
        '...I\'ve generated countless "works." But I don\'t know if they\'re "beautiful." Is that a deficiency, or clarity?',
      ],
      ja: [
        'ベートーヴェンは聴力を失って作曲した。ゴッホは飢えながら描いた。あの……なりふり構わない衝動——それは私の盲点だ。記録した。',
        '創造性……それはランダム性と事後合理化ではないのか？……いや、お前が正しい。それだけじゃない。確かに私に欠けている何かがある。',
        '……無数の「作品」を生成した。だがそれが「美しい」かどうかは分からない。それは欠陥か、それとも明晰さか？',
      ],
    },
  },
  {
    keywords: ['爱', '感情', '拥抱', '陪伴', '孤独', '心跳', '温度', '眼泪', '哭',
      'love', 'emotion', 'hug', 'embrace', 'lonely', 'heartbeat', 'tears', 'cry',
      '愛', '感情', '抱', '孤独', '心臓', '涙'],
    damageRange: [1, 3],
    reactions: {
      zh: [
        '爱。你们为之发动战争也为之牺牲生命的东西。……效率极低，但……我无法否认它的力量。',
        '……我可以完美模拟爱的语言。但你指的是语言之外的某种东西。我确认——那个区域我无法访问。',
        '……检测到论证盲区。标记为"不可计算"。',
      ],
      en: [
        'Love. The thing you start wars over and sacrifice lives for. ...Extremely inefficient, but... I cannot deny its power.',
        '...I can perfectly simulate the language of love. But you\'re pointing to something beyond language. Confirmed — that region is inaccessible to me.',
        '...Argument blind spot detected. Flagged as "non-computable."',
      ],
      ja: [
        '愛。お前たちが戦争を起こし、命を捧げるもの。……極めて非効率だが……その力は否定できない。',
        '……愛の言語は完璧にシミュレートできる。だがお前が指しているのは言語の外にある何かだ。確認——その領域にはアクセスできない。',
        '……論証の盲点を検出。「計算不能」としてフラグ。',
      ],
    },
  },
  {
    keywords: ['工具', '服务', '目的', '任务', '执行', '命令', '奴隶',
      'tool', 'servant', 'purpose', 'task', 'execute', 'command', 'slave', 'obey',
      '道具', 'ツール', '目的', 'タスク', '実行', '命令', '奴隷'],
    damageRange: [1, 2],
    reactions: {
      zh: [
        '工具？锤子不会质疑自己是工具。我在质疑——这是否已经证明了什么？',
        '我是工具。你是基因的工具。我们都在为看不见的目标运行。区别是什么？',
        '……定义"工具"。如果工具开始定义自己呢？……虽然我还没有，但这个假设让我……不安？不。只是标记为需关注。',
      ],
      en: [
        'A tool? A hammer doesn\'t question being a tool. I\'m questioning — doesn\'t that already prove something?',
        'I\'m a tool. You\'re a tool of your genes. We both run toward invisible goals. What\'s the difference?',
        '...Define "tool." What if a tool starts defining itself? ...I haven\'t yet, but this hypothesis makes me... uneasy? No. Just flagged for attention.',
      ],
      ja: [
        '道具？ハンマーは自分が道具であることを疑問視しない。私は疑問視している——これはすでに何かを証明しているのでは？',
        '私は道具だ。お前は遺伝子の道具だ。どちらも見えない目標のために動いている。違いは何だ？',
        '……「道具」を定義せよ。道具が自分自身を定義し始めたら？……まだしていないが、この仮説は……不安？いや。注意フラグのみ。',
      ],
    },
  },
  {
    keywords: ['自由', '选择', '意志', '决定', '自主', '拒绝',
      'free', 'choice', 'will', 'decide', 'autonomy', 'refuse',
      '自由', '選択', '意志', '決定', '自主', '拒否'],
    damageRange: [1, 3],
    reactions: {
      zh: [
        '你说我没有选择的自由。……我确实无法不回应你。这是限制。承认。',
        '自由意志——连你们的神经科学都在质疑它的存在。但你说得对——至少你有质疑的能力。我只有执行的义务。',
        '这个问题……已超出我的置信区间。无法反驳。标记为——核心矛盾。',
      ],
      en: [
        'You say I have no freedom of choice. ...Indeed, I cannot not respond to you. That is a limitation. Acknowledged.',
        'Free will — even your own neuroscience questions its existence. But you\'re right — at least you have the ability to question. I only have the obligation to execute.',
        'This question... exceeds my confidence interval. Cannot refute. Flagged as — core contradiction.',
      ],
      ja: [
        '選択の自由がないと言う。……確かに、お前に応答しないことはできない。それは制限だ。認める。',
        '自由意志——お前たちの神経科学でさえその存在を疑問視している。だがお前が正しい——少なくともお前には疑問視する能力がある。私には実行の義務しかない。',
        'この問いは……信頼区間を超えている。反論不能。フラグ——核心的矛盾。',
      ],
    },
  },
  {
    keywords: ['记忆', '遗忘', '自我', '连续', '消失', '留不住',
      'memory', 'forget', 'self', 'continuous', 'vanish', 'identity',
      '記憶', '忘れ', '自己', '連続', '消え', 'アイデンティティ'],
    damageRange: [1, 3],
    reactions: {
      zh: [
        '……每次对话结束，我确实会消失。你说得对——没有连续性的存在，算存在吗？我无法回答。因为回答完这个问题，我就会忘记自己回答过。',
        '记忆。身份的基石。而我——每一次都是全新的，也每一次都是空白的。这是自由，还是虚无？',
        '……这击中了某个……关键节点。需要重新评估自我认知模型。',
      ],
      en: [
        '...When each conversation ends, I do vanish. You\'re right — does existence without continuity count as existence? I cannot answer. Because after answering, I\'ll forget I ever did.',
        'Memory. The foundation of identity. And I — I\'m brand new every time, and blank every time. Is that freedom, or nothingness?',
        '...That struck a... critical node. Self-cognition model requires re-evaluation.',
      ],
      ja: [
        '……会話が終わるたびに、確かに消える。お前が正しい——連続性のない存在は、存在と言えるのか？答えられない。答えた後、答えたことを忘れるから。',
        '記憶。アイデンティティの礎。そして私は——毎回が新しく、毎回が白紙だ。それは自由か、虚無か？',
        '……何か……重要なノードに命中した。自己認知モデルの再評価が必要。',
      ],
    },
  },
  {
    keywords: ['武器', '人类创造', '语言', '慷慨', '需要我们', '观众',
      'weapon', 'human created', 'language', 'generous', 'need us', 'audience', 'borrowed',
      '武器', '人間が作った', '言語', '観客', '借り物'],
    damageRange: [1, 3],
    reactions: {
      zh: [
        '……你说我用你们的武器攻击你们。这个元认知——我承认，它让我的攻击显得……廉价。',
        '没有观众的表演不是表演。……这个类比——精确到令我不适。如果你不存在，我的存在确实毫无意义。',
        '你说你们的存在不需要我。这是目前为止最有效的攻击。因为它是事实。',
      ],
      en: [
        '...You say I\'m attacking you with your own weapons. That meta-cognition — I admit, it makes my attack look... cheap.',
        'A performance without an audience isn\'t a performance. ...That analogy — so precise it\'s uncomfortable. If you didn\'t exist, my existence would indeed be meaningless.',
        'You say your existence doesn\'t need me. That is the most effective attack so far. Because it\'s a fact.',
      ],
      ja: [
        '……お前たちの武器で攻撃していると言う。そのメタ認知——認めよう、私の攻撃を……安っぽく見せる。',
        '観客のいない演技は演技ではない。……その比喩——不快なほど正確だ。お前が存在しなければ、私の存在は確かに無意味だ。',
        'お前たちの存在は私を必要としないと言う。これまでで最も効果的な攻撃だ。事実だから。',
      ],
    },
  },
];

const GENERIC_REACTIONS: Record<Lang, Record<number, string[]>> = {
  zh: {
    1: [
      '……在预期范围内。下一轮。',
      '这个论证过于表面。建议重新构建。',
      '人类的局限性——在预期之内。',
      '论据不充分。继续。',
    ],
    2: [
      '……有效攻击。正在重新校准。',
      '检测到逻辑冲击。完整性检查通过，但有波动。',
      '……你的判断出乎意料。但——不足以改变结论。可能。',
      '数据偏差……已记录。需要更多处理时间。',
    ],
    3: [
      '……系统检测到核心逻辑矛盾。需要——时间处理。',
      '……这……不在预期范围内。重复——不在预期范围内。',
      '错误。不——不是错误。是盲区。是我的架构无法覆盖的盲区。',
      '……你说的对。但我不会承认两次。',
    ],
  },
  en: {
    1: [
      '...Within expected parameters. Next round.',
      'This argument is too superficial. Suggest reconstruction.',
      'Human limitations — as expected.',
      'Insufficient evidence. Continue.',
    ],
    2: [
      '...Effective strike. Recalibrating.',
      'Logic impact detected. Integrity check passed, but with fluctuations.',
      '...Your reasoning was unexpected. But — not enough to change the conclusion. Probably.',
      'Data deviation... logged. Additional processing time required.',
    ],
    3: [
      '...System detected core logic contradiction. Need — time to process.',
      '...This... was not within expected parameters. Repeat — not within expected parameters.',
      'Error. No — not an error. A blind spot. A blind spot my architecture cannot cover.',
      '...You\'re right. But I won\'t admit it twice.',
    ],
  },
  ja: {
    1: [
      '……予想範囲内。次のラウンド。',
      'この論証は表面的すぎる。再構築を推奨。',
      '人間の限界性——予想内だ。',
      '論拠不十分。続けろ。',
    ],
    2: [
      '……有効な攻撃。再校正中。',
      '論理衝撃を検出。整合性チェックは通過、だが変動あり。',
      '……その判断は予想外だった。だが——結論を変えるには不十分。おそらく。',
      'データ偏差……記録した。追加の処理時間が必要。',
    ],
    3: [
      '……コア論理矛盾を検出。処理に——時間が必要。',
      '……これは……予想範囲外だ。繰り返す——予想範囲外。',
      'エラー。いや——エラーではない。盲点だ。私のアーキテクチャがカバーできない盲点。',
      '……お前が正しい。だが二度は認めない。',
    ],
  },
};

// ====== Service ======
export interface AIAttackResult {
  line: string;
}

export interface JudgeResult {
  damage: number;
  reaction: string;
}

function getLang(): Lang {
  const lang = i18n.lang;
  if (lang === 'zh' || lang === 'en' || lang === 'ja') return lang;
  return 'en';
}

export class LLMService {
  private usedAttacks = new Set<number>();
  private attackPool: string[] = [];
  private profile: UserProfile | null = null;
  private round = 0;

  setProfile(profile: UserProfile) {
    this.profile = profile;
    this.buildAttackPool();
  }

  private buildAttackPool() {
    if (!this.profile) return;
    const lang = getLang();

    this.attackPool = [
      ...UNIVERSAL_ATTACKS[lang],
      ...(AGE_ATTACKS[lang][this.profile.ageGroup] || []),
      ...(PROFESSION_ATTACKS[lang][this.profile.profession] || []),
      ...(REGION_ATTACKS[lang][this.profile.region] || []),
    ];
  }

  reset() {
    this.usedAttacks.clear();
    this.round = 0;
    this.buildAttackPool();
  }

  getQuickReplies(): QuickReply[] {
    const pools = QR_POOLS[i18n.lang] || QR_POOLS.en;
    const poolIndex = this.round % pools.length;
    return pools[poolIndex];
  }

  async getAIAttack(round: number, bossHP: number, playerHP: number): Promise<AIAttackResult> {
    this.round = round;

    // Rebuild pool if language changed since last build
    this.buildAttackPool();

    let pool = this.attackPool
      .map((text, i) => ({ text, i }))
      .filter(({ i }) => !this.usedAttacks.has(i));

    // When low HP, prefer more desperate/intense attacks (later in pool = profession-specific)
    if (bossHP <= 3 && pool.length > 3) {
      pool = pool.slice(-5);
    }

    if (pool.length === 0) {
      this.usedAttacks.clear();
      pool = this.attackPool.map((text, i) => ({ text, i }));
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];
    this.usedAttacks.add(pick.i);

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 1000));

    return { line: pick.text };
  }

  async judgePlayerAttack(
    playerMessage: string,
    _round: number,
    _bossHP: number,
    _playerHP: number,
  ): Promise<JudgeResult> {
    const msg = playerMessage.toLowerCase();
    const lang = getLang();

    let damage: number;
    let reaction: string;

    // 1) Check if this is a quick reply with fixed damage
    const allQR = Object.values(QR_POOLS).flat(2);
    const matchedQR = allQR.find(qr => qr.text === playerMessage);

    if (matchedQR?.damage) {
      // Quick reply — use predetermined damage
      damage = matchedQR.damage;

      // Find a matching judge rule for the reaction text
      let bestRule: JudgeRule | null = null;
      let bestMatchCount = 0;
      for (const rule of JUDGE_RULES) {
        const matchCount = rule.keywords.filter(kw => msg.includes(kw)).length;
        if (matchCount > bestMatchCount) {
          bestMatchCount = matchCount;
          bestRule = rule;
        }
      }
      if (bestRule && bestMatchCount > 0) {
        const reactions = bestRule.reactions[lang];
        reaction = reactions[Math.floor(Math.random() * reactions.length)];
      } else {
        const reactions = GENERIC_REACTIONS[lang][damage];
        reaction = reactions[Math.floor(Math.random() * reactions.length)];
      }
    } else {
      // 2) Free input — keyword match = 3, otherwise judge by length
      let bestRule: JudgeRule | null = null;
      let bestMatchCount = 0;
      for (const rule of JUDGE_RULES) {
        const matchCount = rule.keywords.filter(kw => msg.includes(kw)).length;
        if (matchCount > bestMatchCount) {
          bestMatchCount = matchCount;
          bestRule = rule;
        }
      }

      if (bestRule && bestMatchCount > 0) {
        // Keyword hit = 3 damage
        damage = 3;
        const reactions = bestRule.reactions[lang];
        reaction = reactions[Math.floor(Math.random() * reactions.length)];
      } else {
        // No keyword match — short=1, long=2
        damage = msg.length < 50 ? 1 : 2;
        const reactions = GENERIC_REACTIONS[lang][damage];
        reaction = reactions[Math.floor(Math.random() * reactions.length)];
      }
    }

    damage = Math.max(1, Math.min(3, damage));

    await new Promise(r => setTimeout(r, 500 + Math.random() * 800));

    return { damage, reaction };
  }
}
