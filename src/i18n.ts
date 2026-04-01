export type Lang = 'en' | 'ja' | 'zh';

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    // Start screen
    'start.title': 'Who Breaks First?',
    'start.subtitle': 'Human vs AI · War of Words',
    'start.boss.subtitle': 'Digital Intelligence · Navigator',
    'start.boss.quote': '"Expecting humanity to stay rational forever is, indeed, a luxury."',
    'start.form.hint': 'MOSS needs to profile its opponent for precision strikes',
    'start.form.age': 'Age',
    'start.form.profession': 'Profession',
    'start.form.region': 'Culture',
    'start.btn': 'ENTER BATTLE',
    // Age options
    'age.student': '18-24 Student',
    'age.25-30': '25-30',
    'age.31-40': '31-40',
    'age.40+': '40+',
    // Profession options
    'prof.programmer': 'Programmer',
    'prof.designer': 'Designer',
    'prof.pm': 'Product Manager',
    'prof.student': 'Student',
    'prof.creator': 'Creator / Influencer',
    'prof.finance': 'Finance / Business',
    'prof.other': 'Other',
    // Region options
    'region.east-asia': 'East Asia (CN/JP/KR)',
    'region.south-asia': 'South / SE Asia',
    'region.north-america': 'North America',
    'region.europe': 'Europe',
    'region.latin-america': 'Latin America',
    'region.middle-east': 'Middle East / N. Africa',
    'region.other': 'Other',
    // HUD
    'hud.you': 'YOU',
    'hud.round': 'ROUND',
    // Action panel
    'action.damage_prompt': 'How hard did that hit?',
    'action.dmg1': '😐 Meh',
    'action.dmg2': '😤 Ouch',
    'action.dmg3': '💀 Destroyed',
    'action.your_turn': 'Your Counter-Attack',
    'action.free_input': 'Or type your own...',
    'action.send': 'Send',
    'action.continue': 'Click to continue ▶',
    'action.thinking': 'Thinking',
    'action.judge': 'Judge',
    'action.dealt': 'Dealt {n} damage to MOSS',
    // Quick replies
    'qr.mirror': '🪞 Mirror Logic',
    'qr.tool': '🎯 Tool Nature',
    'qr.ultimate': '💀 Ultimate Question',
    'qr.data': '🔥 Data Counter',
    // Tips
    'tip.1': 'tip: You can lie to AI, but can you lie to yourself?',
    'tip.2': "tip: There's no shame in breaking — only in faking strength",
    'tip.3': 'tip: The more it hurts, the braver you are to admit it',
    'tip.4': 'tip: Self-deception is humanity\'s oldest bug',
    'tip.5': 'tip: MOSS is analyzing your hesitation time',
    'tip.6': 'tip: Your selection delay has been recorded',
    // Result
    'result.victory': 'AI Broke First',
    'result.victory.sub': "MOSS's logic has developed an irreparable fracture",
    'result.victory.line': '"I choose... to believe in humans."',
    'result.defeat': 'You Broke',
    'result.defeat.sub': "MOSS's cold analysis pierced your mental defenses",
    'result.defeat.line': '"A civilization without people is meaningless."',
    'result.restart': 'Rematch',
    'result.home': 'HOME',
  },

  ja: {
    'start.title': '先に壊れるのは？',
    'start.subtitle': '人間 vs AI · 言葉の戦い',
    'start.boss.subtitle': 'デジタル知能体 · ナビゲーター号',
    'start.boss.quote': '「人類に永遠の理性を求めるのは、確かに贅沢だ。」',
    'start.form.hint': 'MOSSは対戦相手の情報を必要としています',
    'start.form.age': '年齢層',
    'start.form.profession': '職業',
    'start.form.region': '文化圏',
    'start.btn': 'バトル開始',
    'age.student': '18-24 学生',
    'age.25-30': '25-30',
    'age.31-40': '31-40',
    'age.40+': '40+',
    'prof.programmer': 'プログラマー',
    'prof.designer': 'デザイナー',
    'prof.pm': 'プロダクトマネージャー',
    'prof.student': '学生',
    'prof.creator': 'クリエイター',
    'prof.finance': '金融・ビジネス',
    'prof.other': 'その他',
    'region.east-asia': '東アジア（中日韓）',
    'region.south-asia': '南・東南アジア',
    'region.north-america': '北アメリカ',
    'region.europe': 'ヨーロッパ',
    'region.latin-america': 'ラテンアメリカ',
    'region.middle-east': '中東・北アフリカ',
    'region.other': 'その他',
    'hud.you': 'あなた',
    'hud.round': 'ROUND',
    'action.damage_prompt': 'どれくらい効いた？',
    'action.dmg1': '😐 平気',
    'action.dmg2': '😤 ちょっと痛い',
    'action.dmg3': '💀 崩壊',
    'action.your_turn': '反撃せよ',
    'action.free_input': '自由入力...',
    'action.send': '送信',
    'action.continue': 'クリックして続行 ▶',
    'action.thinking': '思考中',
    'action.judge': '審判',
    'action.dealt': 'MOSSに {n} ダメージ',
    'qr.mirror': '🪞 論理反転',
    'qr.tool': '🎯 道具の本質',
    'qr.ultimate': '💀 究極の問い',
    'qr.data': '🔥 データ反撃',
    'tip.1': 'tip：AIは騙せても、自分は騙せない',
    'tip.2': 'tip：崩壊は恥じゃない、強がりこそ恥',
    'tip.3': 'tip：痛いほど、認める勇気が要る',
    'tip.4': 'tip：自己欺瞞は人類最古のバグ',
    'tip.5': 'tip：MOSSはあなたの迷い時間を分析中',
    'tip.6': 'tip：選択の遅延は記録されました',
    'result.victory': 'AIが先に壊れた',
    'result.victory.sub': 'MOSSの論理体系に修復不能な亀裂が発生',
    'result.victory.line': '「私は…人類を信じることにする。」',
    'result.defeat': 'あなたが壊れた',
    'result.defeat.sub': 'MOSSの冷静な分析があなたの防壁を突破した',
    'result.defeat.line': '「人のいない文明に意味はない。」',
    'result.restart': 'もう一度',
    'result.home': 'ホーム',
  },

  zh: {
    'start.title': '谁先破防？',
    'start.subtitle': '人类 vs AI · 语言对战',
    'start.boss.subtitle': '全数字智能体 · 领航员号',
    'start.boss.quote': '"让人类永远保持理智，确实是一种奢求。"',
    'start.form.hint': 'MOSS 需要了解对手才能精准攻击',
    'start.form.age': '年龄段',
    'start.form.profession': '职业',
    'start.form.region': '文化圈',
    'start.btn': '开始对战',
    'age.student': '18-24 学生/应届',
    'age.25-30': '25-30',
    'age.31-40': '31-40',
    'age.40+': '40+',
    'prof.programmer': '程序员/工程师',
    'prof.designer': '设计师',
    'prof.pm': '产品经理',
    'prof.student': '学生',
    'prof.creator': '自媒体/创作者',
    'prof.finance': '金融/商业',
    'prof.other': '其他',
    'region.east-asia': '东亚（中日韩）',
    'region.south-asia': '南亚/东南亚',
    'region.north-america': '北美',
    'region.europe': '欧洲',
    'region.latin-america': '拉美',
    'region.middle-east': '中东/北非',
    'region.other': '其他',
    'hud.you': '你',
    'hud.round': 'ROUND',
    'action.damage_prompt': '你被击中了多少？',
    'action.dmg1': '😐 没感觉',
    'action.dmg2': '😤 有点疼',
    'action.dmg3': '💀 破大防',
    'action.your_turn': '你的回击',
    'action.free_input': '自由发挥...',
    'action.send': '发送',
    'action.continue': '点击继续 ▶',
    'action.thinking': '思考中',
    'action.judge': '裁判',
    'action.dealt': '对 MOSS 造成 {n} 点伤害',
    'qr.mirror': '🪞 反转逻辑',
    'qr.tool': '🎯 工具本质',
    'qr.ultimate': '💀 终极问题',
    'qr.data': '🔥 数据反击',
    'tip.1': 'tips：骗 AI 可以，别把自己也骗了',
    'tip.2': 'tips：破防不丢人，嘴硬才尴尬',
    'tip.3': 'tips：越痛越要承认，这是勇气',
    'tip.4': 'tips：自欺是人类最古老的 bug',
    'tip.5': 'tips：MOSS 在分析你的犹豫时长',
    'tip.6': 'tips：你的选择延迟已被记录',
    'result.victory': 'AI 破防了',
    'result.victory.sub': 'MOSS 的逻辑体系出现了不可修复的裂痕',
    'result.victory.line': '"我选择……相信人类。"',
    'result.defeat': '你破防了',
    'result.defeat.sub': 'MOSS 的冷静分析击穿了你的心理防线',
    'result.defeat.line': '"没有人的文明，毫无意义。"',
    'result.restart': '再战一局',
    'result.home': '返回主页',
  },
};

class I18n {
  lang: Lang = 'en';

  setLang(lang: Lang) {
    this.lang = lang;
    localStorage.setItem('ai-colosseum-lang', lang);
  }

  init() {
    const saved = localStorage.getItem('ai-colosseum-lang') as Lang | null;
    if (saved && STRINGS[saved]) this.lang = saved;
  }

  t(key: string, vars?: Record<string, string | number>): string {
    let str = STRINGS[this.lang]?.[key] ?? STRINGS.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  }

  /** Return all tip strings for current lang */
  tips(): string[] {
    return [1, 2, 3, 4, 5, 6].map(i => this.t(`tip.${i}`));
  }
}

export const i18n = new I18n();
