import { createContext, useContext, useMemo, type ReactNode } from "react";
import { faDigits } from "./utils";

export type Lang = "fa" | "en";
export type Dir = "rtl" | "ltr";

type Dict = Record<string, string>;

const fa: Dict = {
  "app.version": "v3 · لوکال",
  "reset.aria": "بازنشانی تنظیمات",
  "lang.aria": "Switch to English",
  "tab.preview": "پیش‌نمایش",
  "tab.settings": "تنظیمات",
  "tab.content": "محتوا",
  "tab.style": "ظاهر",
  "tab.brand": "برند",
  saved: "ذخیره شد",
  "btn.download": "دانلود PNG",
  "btn.share": "اشتراک‌گذاری",
  "preview.aria": "پیش‌نمایش زنده کارت",
  "content.title": "محتوای کارت",
  "content.saveIdea": "ذخیره ایده",
  "content.ideas": "ایده‌ها",
  "content.noIdeas": "ایده‌ای ذخیره نشده",
  "content.removeIdea.aria": "حذف",
  "content.chars": "کاراکتر",
  "content.size": "اندازه متن",
  "content.dir": "جهت متن روی کارت",
  "content.dir.rtl": "راست‌به‌چپ",
  "content.dir.ltr": "چپ‌به‌راست",
  "content.font": "فونت",
  "style.template": "قالب کارت",
  "style.ratio": "ابعاد خروجی",
  "style.accent": "رنگ برند",
  "style.custom": "دلخواه",
  "style.bg": "پس‌زمینه قاب",
  "brand.title": "برند و هویت",
  "brand.name": "نام برند",
  "brand.handle": "آیدی",
  "brand.domain": "دامنه / فوتر",
  "brand.verified": "نشان تأیید",
  "brand.logo": "لوگوی اختصاصی",
  "brand.logoTextStatus": "لوگوی متنی فعال است — حروف اول نام برند",
  "brand.logoImgStatus": "لوگوی تصویر فعال است",
  "brand.logoPick": "انتخاب تصویر",
  "brand.logoRemove": "حذف لوگو",
  "brand.stats": "آمار شبکه‌های اجتماعی",
  "brand.statsToggle": "نمایش آمار زیر کارت",
  "brand.comments": "کامنت",
  "brand.retweets": "بازنشر",
  "brand.likes": "پسند",
  "tpl.tweet": "توییت شیشه‌ای",
  "tpl.hook": "قلاب ریلز",
  "tpl.problem": "مشکل / راهکار",
  "tpl.code": "نکته‌ی کد",
  "ratio.9:16": "۹:۱۶ ریلز",
  "ratio.1:1": "۱:۱ پست",
  "ratio.16:9": "۱۶:۹ بنر",
  "size.sm": "کوچک",
  "size.md": "استاندارد",
  "size.lg": "بزرگ",
  "size.xl": "خیلی بزرگ",
  "font.vazir": "وزیرمتن",
  "font.lalezar": "لاله‌زار (تیتر)",
  "font.inter": "Inter",
  "font.fira": "Fira Code (کد)",
  "ver.brand": "هم‌رنگ برند",
  "ver.blue": "آبی",
  "ver.gold": "طلایی",
  "ver.none": "بدون نشان",
  "bg.plain": "ساده",
  "bg.glow": "هاله نور",
  "bg.grid": "شبکه‌ای",
  "toast.reset": "تنظیمات به حالت اولیه بازگشت",
  "toast.storageFull": "حافظه مرورگر پر است؛ لوگو ذخیره نشد",
  "toast.logoSaved": "لوگو ذخیره شد",
  "toast.notImage": "فایل انتخابی تصویر نیست",
  "toast.badImage": "خواندن تصویر ممکن نشد",
  "toast.downloaded": "خروجی PNG دانلود شد",
  "toast.copied": "تصویر در کلیپ‌بورد کپی شد",
  "toast.copyFail": "کپی در این مرورگر پشتیبانی نمی‌شود",
  "reset.title": "بازنشانی استودیو",
  "reset.body":
    "همه‌ی تنظیمات، متن‌ها و لوگوی ذخیره‌شده پاک می‌شود و کارت به حالت اولیه برمی‌گردد. این عمل قابل بازگشت نیست.",
  "reset.cancel": "انصراف",
  "reset.confirm": "بله، بازنشانی کن",
  "sheet.close": "بستن",
  "card.brandFallback": "نام برند",
  "card.ph.tweet": "اینجا متن کارت نوشته می‌شود…",
  "card.ph.hook": "تیتر جنجالی ویدیو را اینجا بنویس…",
  "card.ph.problem": "متن این بخش خالی است…",
  "card.ph.code": "// کد یا نکته را اینجا بنویس…",
  "card.problem": "مشکل",
  "card.solution": "راهکار",
};

const en: Dict = {
  "app.version": "v3 · Local",
  "reset.aria": "Reset settings",
  "lang.aria": "تغییر زبان به فارسی",
  "tab.preview": "Preview",
  "tab.settings": "Settings",
  "tab.content": "Content",
  "tab.style": "Style",
  "tab.brand": "Brand",
  saved: "Saved",
  "btn.download": "Download PNG",
  "btn.share": "Share",
  "preview.aria": "Live card preview",
  "content.title": "Card content",
  "content.saveIdea": "Save idea",
  "content.ideas": "Ideas",
  "content.noIdeas": "No saved ideas yet",
  "content.removeIdea.aria": "Remove",
  "content.chars": "chars",
  "content.size": "Text size",
  "content.dir": "Card text direction",
  "content.dir.rtl": "Right-to-left",
  "content.dir.ltr": "Left-to-right",
  "content.font": "Font",
  "style.template": "Card template",
  "style.ratio": "Output size",
  "style.accent": "Brand color",
  "style.custom": "Custom",
  "style.bg": "Frame background",
  "brand.title": "Brand & identity",
  "brand.name": "Brand name",
  "brand.handle": "Handle",
  "brand.domain": "Domain / footer",
  "brand.verified": "Verified badge",
  "brand.logo": "Custom logo",
  "brand.logoTextStatus": "Text logo active — brand initials",
  "brand.logoImgStatus": "Image logo active",
  "brand.logoPick": "Choose image",
  "brand.logoRemove": "Remove logo",
  "brand.stats": "Social stats",
  "brand.statsToggle": "Show stats on card",
  "brand.comments": "Comments",
  "brand.retweets": "Reposts",
  "brand.likes": "Likes",
  "tpl.tweet": "Glass Tweet",
  "tpl.hook": "Reel Hook",
  "tpl.problem": "Problem → Solution",
  "tpl.code": "Code Tip",
  "ratio.9:16": "9:16 Reels",
  "ratio.1:1": "1:1 Post",
  "ratio.16:9": "16:9 Banner",
  "size.sm": "Small",
  "size.md": "Standard",
  "size.lg": "Large",
  "size.xl": "Extra large",
  "font.vazir": "Vazirmatn",
  "font.lalezar": "Lalezar (display)",
  "font.inter": "Inter",
  "font.fira": "Fira Code (code)",
  "ver.brand": "Brand color",
  "ver.blue": "Blue",
  "ver.gold": "Gold",
  "ver.none": "None",
  "bg.plain": "Plain",
  "bg.glow": "Glow",
  "bg.grid": "Grid",
  "toast.reset": "Settings restored to defaults",
  "toast.storageFull": "Browser storage is full — logo not saved",
  "toast.logoSaved": "Logo saved",
  "toast.notImage": "The selected file is not an image",
  "toast.badImage": "Could not read the image",
  "toast.downloaded": "PNG downloaded",
  "toast.copied": "Image copied to clipboard",
  "toast.copyFail": "Copying is not supported in this browser",
  "reset.title": "Reset studio",
  "reset.body":
    "All settings, texts and the saved logo will be erased and the card returns to its defaults. This cannot be undone.",
  "reset.cancel": "Cancel",
  "reset.confirm": "Yes, reset",
  "sheet.close": "Close",
  "card.brandFallback": "Brand name",
  "card.ph.tweet": "Your card text goes here…",
  "card.ph.hook": "Write your video hook here…",
  "card.ph.problem": "This section is empty…",
  "card.ph.code": "// write your code or tip here…",
  "card.problem": "Problem",
  "card.solution": "Solution",
};

const DICTS: Record<Lang, Dict> = { fa, en };

/* ---------- ایده‌های آماده‌ی متنی برای هر قالب و هر زبان ---------- */
export const IDEA_TEXTS: Record<Lang, Record<string, string[]>> = {
  fa: {
    tweet: [
      "بهترین کد، کدیه که *نوشته نمی‌شه*؛ اول بپرس اصلاً لازمه؟",
      "فریلنسری یعنی حقوقت دلاریه، *خوابت* هیچ‌وقت!",
      "برنامه‌نویس‌ها ۳ دروغ می‌گن: *تقریباً تمومه*، *فقط یه باگه*، *فردا مستند می‌کنم*.",
    ],
    hook: [
      "تا حالا *۳ سال* کد اشتباه می‌زدی و خبر نداشتی!",
      "*۵ ابزار* که سرعت کدنویسی‌ات را دو برابر می‌کنند",
      "چرا همه‌ی سنیورها *نه گفتن* را بلدند؟",
    ],
    problem: [
      "پرینت‌های دیباگ توی کد جا موندن!\nقبل از مرج، git diff را خط‌به‌خط بازبینی کن و یک اسکریپت lint برای کد مرده بگذار.",
      "ری‌اکت وسط پروژه سنگین می‌شه\nکامپوننت‌ها را با memo کوچک کن و state را از درخت‌های بزرگ بیرون بکش.",
      "مشتری آخر شب فیچر جدید می‌خواد!\nاسکوپ را مکتوب کن و برای هر تغییر، *هزینه و زمان* بفرست.",
    ],
    code: [
      "const sleep = (ms) =>\n  new Promise((r) => setTimeout(r, ms));\n// ولی هیچ‌وقت توی پروداکشن استفاده نشد 😄",
      "git commit -m \"fix: bug\"\n// دقیق‌ترین کامیت تاریخ بشریت",
      "// TODO: این کامنت را بعداً پاک کن\nconst later = never;",
    ],
  },
  en: {
    tweet: [
      "The best code is the code you *never write* — ask if it's needed first.",
      "Your first 100 users come from *showing up* every single day.",
      "The best error message is the one that *never shows up*.",
    ],
    hook: [
      "Stop writing clean code. *Write clear code.*",
      "*3 habits* that quietly kill your focus as a developer",
      "Nobody tells beginners this about *pull requests*",
    ],
    problem: [
      "Junior devs ask how. Senior devs ask why.\nAsk why first, then how — the code writes itself.",
      "Debug prints keep leaking into production!\nReview every git diff line by line and add a lint rule for dead code.",
      "The client wants a new feature at midnight!\nPut the scope in writing and quote *cost and time* for every change.",
    ],
    code: [
      "const focus = distractions.filter((d) => !d.urgent);\n// deep work = the filtered list",
      "// name things for the reader, not the compiler\nconst hoursLeftUntilLaunch = 3;",
      "git commit -m \"small steps, working software\"\n// ship often, break nothing",
    ],
  },
};

/* ---------- placeholder تخصصی هر قالب در هر زبان ---------- */
export const PLACEHOLDERS: Record<Lang, Record<string, string>> = {
  fa: {
    tweet: "متن کارت را بنویس؛ دور کلمه‌های مهم *ستاره* بگذار تا هایلایت شوند…",
    hook: "تیتر کوتاه و کوبنده؛ مثلا: *۳ اشتباهی* که همه برنامه‌نویس‌ها می‌کنند…",
    problem: "خط اول: شرح مشکل\nخط‌های بعدی: راهکار",
    code: "هر خط یک خط کد؛ با // کامنت بگذار…",
  },
  en: {
    tweet: "Write your card text — wrap key words in *stars* to highlight them…",
    hook: "Short, punchy headline — e.g. *3 mistakes* every developer makes…",
    problem: "Line one: the problem\nFollowing lines: the solution",
    code: "One line of code per line — use // for comments…",
  },
};

/* ---------- کانتکست ---------- */
export interface I18nValue {
  lang: Lang;
  dir: Dir;
  rtl: boolean;
  t: (key: string) => string;
  num: (v: number) => string;
}

const I18nContext = createContext<I18nValue>({
  lang: "fa",
  dir: "rtl",
  rtl: true,
  t: (k) => k,
  num: String,
});

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo<I18nValue>(() => {
    const dir: Dir = lang === "fa" ? "rtl" : "ltr";
    const dict = DICTS[lang];
    return {
      lang,
      dir,
      rtl: lang === "fa",
      t: (key) => dict[key] ?? key,
      num: (v) => (lang === "fa" ? faDigits(v) : String(v)),
    };
  }, [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
