export type TemplateId = "tweet" | "hook" | "problem" | "code";
export type RatioId = "9:16" | "1:1" | "16:9";
export type FontId = "vazirmatn" | "lalezar" | "inter" | "fira";
export type SizeId = "sm" | "md" | "lg" | "xl";
export type BgId = "grid" | "glow" | "minimal";
export type DirId = "rtl" | "ltr";
export type AlignId = "right" | "left";
export type VerifiedId = "none" | "brand" | "blue" | "gold";

export interface CardConfig {
  brandName: string;
  brandHandle: string;
  brandDomain: string;
  verified: VerifiedId;
  logoData: string | null;
  template: TemplateId;
  ratio: RatioId;
  accent: string;
  textDir: DirId;
  headerAlign: AlignId;
  font: FontId;
  size: SizeId;
  bg: BgId;
  showStats: boolean;
  content: string;
  stats: { comments: string; retweets: string; likes: string };
}

export const STORAGE_KEY = "starteach-studio-v3";

export const DEFAULT_CONFIG: CardConfig = {
  brandName: "استارتیچ | Starteach",
  brandHandle: "@starteach.ir",
  brandDomain: "starteach.ir",
  verified: "brand",
  logoData: null,
  template: "tweet",
  ratio: "9:16",
  accent: "#10b981",
  textDir: "rtl",
  headerAlign: "right",
  font: "vazirmatn",
  size: "md",
  bg: "glow",
  showStats: true,
  content:
    'وقتی مشتری میگه: «فقط یه تغییر کوچیک می‌خوام، نیم‌ساعته تموم میشه!»\n\n*و تو می‌دونی یعنی بازنویسی کل دیتابیس و ۳ شب بی‌خوابی…* 😅',
  stats: { comments: "142", retweets: "890", likes: "4.2K" },
};

/* ---------- ابعاد بومی خروجی ---------- */
export const RATIOS: Record<RatioId, { w: number; h: number; label: string; use: string }> = {
  "9:16": { w: 1080, h: 1920, label: "۹:۱۶", use: "ریلز و استوری" },
  "1:1": { w: 1080, h: 1080, label: "۱:۱", use: "پست مربعی" },
  "16:9": { w: 1920, h: 1080, label: "۱۶:۹", use: "بنر و توییتر" },
};

/* ---------- قالب‌ها ---------- */
export const TEMPLATES: Record<TemplateId, { label: string; short: string; hint: string }> = {
  tweet: {
    label: "توییت شیشه‌ای",
    short: "توییت",
    hint: "کارت کلاسیک نقل‌قول با پروفایل و آمار — مناسب اسکرین‌شات‌گونه",
  },
  hook: {
    label: "قلاب ریلز",
    short: "قلاب",
    hint: "تیتر درشت لاله‌زار برای ۳ ثانیه‌ی اول ویدیو — متن کوتاه و کوبنده بنویس",
  },
  problem: {
    label: "مشکل / راهکار",
    short: "دو بخشی",
    hint: "خط اول متن = مشکل، بقیه‌ی خطوط = راهکار",
  },
  code: {
    label: "نکته‌ی کد",
    short: "کد",
    hint: "پنجره‌ی ترمینال با فونت Fira Code — خطوط // کامنت می‌شوند",
  },
};

/* ---------- فونت‌ها ---------- */
export const FONTS: Record<FontId, { label: string; stack: string; sample: string }> = {
  vazirmatn: { label: "وزیرمتن", stack: "'Vazirmatn', sans-serif", sample: "سلام Hello 123" },
  lalezar: { label: "لاله‌زار", stack: "'Lalezar', 'Vazirmatn', sans-serif", sample: "سلام Hello 123" },
  inter: { label: "اینتر", stack: "'Inter', 'Vazirmatn', sans-serif", sample: "سلام Hello 123" },
  fira: { label: "فایرا کد", stack: "'Fira Code', 'Vazirmatn', monospace", sample: "const x = 123;" },
};

/* ---------- اندازه‌های متن (پیکسل بومی) ---------- */
export const SIZE_MAP: Record<TemplateId, Record<SizeId, number>> = {
  tweet: { sm: 40, md: 48, lg: 58, xl: 66 },
  hook: { sm: 84, md: 100, lg: 118, xl: 134 },
  problem: { sm: 36, md: 42, lg: 48, xl: 54 },
  code: { sm: 30, md: 34, lg: 40, xl: 45 },
};

export const SIZES: { value: SizeId; label: string }[] = [
  { value: "sm", label: "کوچک" },
  { value: "md", label: "معمولی" },
  { value: "lg", label: "درشت" },
  { value: "xl", label: "غول" },
];

/* ---------- رنگ‌های پیشنهادی ---------- */
export const ACCENT_PRESETS = [
  "#10b981",
  "#14b8a6",
  "#38bdf8",
  "#f5b84b",
  "#f2788f",
  "#fb923c",
  "#a3e635",
  "#e2e8f0",
];

/* ---------- پس‌زمینه قاب ---------- */
export const BGS: { value: BgId; label: string }[] = [
  { value: "glow", label: "هاله‌ی نور" },
  { value: "grid", label: "شبکه‌ای" },
  { value: "minimal", label: "ساده" },
];

/* ---------- ایده‌های آماده ---------- */
export const IDEAS: Record<TemplateId, string[]> = {
  tweet: [
    'وقتی مشتری میگه: «فقط یه تغییر کوچیک می‌خوام!»\n\n*و تو می‌دونی یعنی بازنویسی کل دیتابیس…* 😅',
    'به برنامه‌نویس نگید «کار ساده‌ایه».\n\n*هیچ کاری که ظاهرش ساده‌ست، واقعاً ساده نیست.*',
    '۵ سال تجربه یعنی:\n*دیگه ارورها رو گوگل نمی‌کنم، باهاشون صحبت می‌کنم.* 🧘',
  ],
  hook: [
    "۳ اشتباهی که *فریلنسرها* رو فقیر نگه می‌داره",
    "اگه هنوز *پورتفولیو* نداری، این ریلز رو ببین",
    "راز پروژه‌های ۱۰۰ میلیونی: *نه گفتن*",
  ],
  problem: [
    "طراح فایل نهایی رو بدون فونت می‌فرسته\n\nیک چک‌لیست تحویل بساز و فونت‌ها رو همیشه embed کن",
    "کد قدیمی هیچ داکیومنتی نداره\n\nقبل از هر فیچر جدید، *۱۰ دقیقه* تست و ری‌فکتور بذار",
    "جلسه‌های بی‌پایان انرژی تیم رو می‌گیره\n\nقانون بذار: *بدون دستورجلسه، جلسه‌ای نیست*",
  ],
  code: [
    "// نکته‌ی سریع React\nconst [user, setUser] = useState(null)\n// همیشه *initial value* بده\n// تا undefined غافلگیرت نکنه",
    "// قبل از دیپلوی اینو بزن:\ngit status\ngit diff --stat\n// *هیچ‌وقت* کور کوریه پوش نکن",
    "// ترفند CSS\n.container {\n  container-type: *inline-size*;\n}\n// کوئری به‌جای صفحه، به ظرف!",
  ],
};
