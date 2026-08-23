/**
 * ساخت CSS فونت‌های embedشده فقط برای فونت‌ها/وزن‌های موردنیاز کارت.
 * html-to-image به‌جای واکشی همه‌ی @font-faceهای سند، از همین رشته استفاده می‌کند
 * تا خروجی روی موبایل سریع و آفلاین‌دوست باشد.
 */

const REQUIRED: Record<string, number[]> = {
  Vazirmatn: [400, 500, 700, 800],
  Lalezar: [400],
  Inter: [400, 600, 800],
  "Fira Code": [400, 600],
};

let cache: string | null = null;

function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function buildFontEmbedCSS(): Promise<string> {
  if (cache) return cache;
  const faces: string[] = [];
  const seen = new Set<string>();

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSFontFaceRule)) continue;
      const family = rule.style.getPropertyValue("font-family").replace(/["']/g, "").trim();
      const weight = Number(rule.style.getPropertyValue("font-weight"));
      if (!REQUIRED[family] || !REQUIRED[family].includes(weight)) continue;

      const src = rule.style.getPropertyValue("src");
      // فقط زیرمجموعه‌های عربی/لاتین — بقیه برای کارت لازم نیستند
      if (/greek|cyrillic|vietnamese|symbols|devanagari/.test(src)) continue;
      const m = src.match(/url\(([^)]+\.woff2)\)/);
      if (!m) continue;
      const rawUrl = m[1].replace(/['"]/g, "").trim();
      if (/latin-ext/.test(rawUrl)) continue;

      const key = `${family}-${weight}-${rawUrl}`;
      if (seen.has(key)) continue;
      seen.add(key);

      try {
        // آدرس‌های نسبی را نسبت به خودِ stylesheet resolve می‌کنیم
        const absoluteUrl = new URL(rawUrl, sheet.href ?? document.baseURI).href;
        const res = await fetch(absoluteUrl);
        if (!res.ok) continue;
        const b64 = bufferToBase64(await res.arrayBuffer());
        faces.push(
          `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2');}`,
        );
      } catch {
        /* فایل در دسترس نبود — بدون آن ادامه می‌دهیم */
      }
    }
  }

  cache = faces.join("\n");
  return cache;
}
