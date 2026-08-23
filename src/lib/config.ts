import type { Lang } from "./i18n";

export const STORAGE_KEY = "starteach-studio-v3";

export type TemplateId = "tweet" | "hook" | "problem" | "code";
export const TEMPLATE_IDS: TemplateId[] = ["tweet", "hook", "problem", "code"];

export type RatioId = "9:16" | "1:1" | "16:9";
export const RATIO_IDS: RatioId[] = ["9:16", "1:1", "16:9"];
export const RATIOS: Record<RatioId, { w: number; h: number }> = {
  "9:16": { w: 1080, h: 1920 },
  "1:1": { w: 1080, h: 1080 },
  "16:9": { w: 1920, h: 1080 },
};

export type BgStyle = "plain" | "glow" | "grid";
export const BG_IDS: BgStyle[] = ["plain", "glow", "grid"];

export type VerifiedKind = "brand" | "blue" | "gold" | "none";
export const VERIFIED_IDS: VerifiedKind[] = ["brand", "blue", "gold", "none"];

export type FontId = "vazir" | "lalezar" | "inter" | "fira";
export const FONT_IDS: FontId[] = ["vazir", "lalezar", "inter", "fira"];
export const FONTS: Record<FontId, { stack: string }> = {
  vazir: { stack: "'Vazirmatn', sans-serif" },
  lalezar: { stack: "'Lalezar', 'Vazirmatn', sans-serif" },
  inter: { stack: "'Inter', 'Vazirmatn', sans-serif" },
  fira: { stack: "'Fira Code', 'Vazirmatn', monospace" },
};

export type SizeId = "sm" | "md" | "lg" | "xl";
export const SIZE_IDS: SizeId[] = ["sm", "md", "lg", "xl"];
/** مقیاس تایپوگرافی بر اساس عرض بومی ۱۰۸۰ پیکسل */
export const SIZE_MAP: Record<TemplateId, Record<SizeId, number>> = {
  tweet: { sm: 42, md: 49, lg: 57, xl: 66 },
  hook: { sm: 94, md: 110, lg: 128, xl: 148 },
  problem: { sm: 37, md: 42, lg: 48, xl: 55 },
  code: { sm: 34, md: 38, lg: 43, xl: 49 },
};

export const PRESET_ACCENTS = [
  "#10b981",
  "#34d399",
  "#0ea5e9",
  "#f5b84b",
  "#f472b6",
  "#a78bfa",
  "#fb7185",
  "#e2e8f0",
];

export interface CardConfig {
  lang: Lang;
  brandName: string;
  brandHandle: string;
  brandDomain: string;
  verified: VerifiedKind;
  logoData: string | null;
  template: TemplateId;
  ratio: RatioId;
  bg: BgStyle;
  accent: string;
  textDir: "rtl" | "ltr";
  headerAlign: "right" | "left";
  font: FontId;
  size: SizeId;
  content: string;
  savedIdeas: string[];
  showStats: boolean;
  stats: { comments: string; retweets: string; likes: string };
}

export const DEFAULT_CONFIG: CardConfig = {
  lang: "fa",
  brandName: "استارتیچ | Starteach",
  brandHandle: "@starteach",
  brandDomain: "starteach.ir",
  verified: "brand",
  logoData: null,
  template: "tweet",
  ratio: "9:16",
  bg: "glow",
  accent: "#10b981",
  textDir: "rtl",
  headerAlign: "right",
  font: "vazir",
  size: "md",
  content:
    "وقتی مشتری می‌گه: «فقط یه تغییر کوچیک می‌خوام!»\n\nو تو می‌دونی یعنی *بازنویسی کل دیتابیس* و سه شب بی‌خوابی… 😐",
  savedIdeas: [],
  showStats: true,
  stats: { comments: "142", retweets: "890", likes: "4.2K" },
};
