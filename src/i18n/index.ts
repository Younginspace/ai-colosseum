import { en } from './locales/en';
import { zh } from './locales/zh';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { es } from './locales/es';
import type { TranslationKeys } from './locales/en';

export type Lang = 'en' | 'zh' | 'ja' | 'ko' | 'es';

const LOCALES: Record<Lang, Record<string, string>> = { en, zh, ja, ko, es };

const LS_KEY = 'ai-colosseum-lang';

type LangChangeListener = (lang: Lang) => void;

class I18n {
  private _lang: Lang = 'en';
  private _listeners: LangChangeListener[] = [];

  constructor() {
    const stored = localStorage.getItem(LS_KEY) as Lang | null;
    if (stored && stored in LOCALES) {
      this._lang = stored;
    }
  }

  get lang(): Lang {
    return this._lang;
  }

  setLang(lang: Lang) {
    if (!(lang in LOCALES)) return;
    this._lang = lang;
    localStorage.setItem(LS_KEY, lang);
    this._listeners.forEach(fn => fn(lang));
  }

  t(key: TranslationKeys | string): string {
    const locale = LOCALES[this._lang];
    if (key in locale) return locale[key];
    // Fallback to English
    if (key in en) return en[key as TranslationKeys];
    return key;
  }

  onChange(fn: LangChangeListener) {
    this._listeners.push(fn);
  }

  offChange(fn: LangChangeListener) {
    this._listeners = this._listeners.filter(l => l !== fn);
  }
}

// Global singleton
export const i18n = new I18n();

// Convenience shorthand
export const t = (key: TranslationKeys | string): string => i18n.t(key);
