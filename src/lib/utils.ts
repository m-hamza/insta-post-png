import type { CardConfig } from "./config";
import { DEFAULT_CONFIG, STORAGE_KEY } from "./config";

/* ---------- ذخیره‌سازی لوکال ---------- */
export function loadConfig(): CardConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw) as Partial<CardConfig>;
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      stats: { ...DEFAULT_CONFIG.stats, ...(parsed.stats ?? {}) },
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/** مقدار false یعنی حافظه پر بوده */
export function saveConfig(config: CardConfig): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch {
    return false;
  }
}

export function clearConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/* ---------- رنگ ---------- */
export function hexA(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return `rgba(16,185,129,${alpha})`;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ---------- حروف اختصاری لوگو ---------- */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "ST";
  if (words.length === 1) return words[0].slice(0, 2);
  return (words[0][0] ?? "") + (words[1][0] ?? "");
}

/* ---------- اعداد فارسی ---------- */
const FA = "۰۱۲۳۴۵۶۷۸۹";
export function faDigits(v: string | number): string {
  return String(v).replace(/\d/g, (d) => FA[Number(d)]);
}

/* ---------- فشرده‌سازی لوگو قبل از ذخیره ---------- */
export function fileToLogoDataUrl(file: File, maxSize = 384): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("not-image"));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * scale));
        c.height = Math.max(1, Math.round(img.height * scale));
        const ctx = c.getContext("2d");
        if (!ctx) throw new Error("no-ctx");
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/png"));
      } catch (e) {
        reject(e as Error);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad-image"));
    };
    img.src = url;
  });
}

/* ---------- تفکیک مشکل/راهکار ---------- */
export function splitProblemSolution(content: string): { problem: string; solution: string } {
  const lines = content.split(/\n/);
  const problem = (lines[0] ?? "").trim();
  const solution = lines.slice(1).join("\n").trim();
  return { problem, solution };
}
