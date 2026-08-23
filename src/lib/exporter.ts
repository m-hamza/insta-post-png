import { toBlob } from "html-to-image";
import { buildFontEmbedCSS } from "./fonts";

/** گرفتن اسکرین‌شات بومی (بدون تغییر مقیاس) از نود کارت */
export async function captureCard(node: HTMLElement): Promise<Blob> {
  await document.fonts.ready;
  const fontEmbedCSS = await buildFontEmbedCSS();
  const blob = await toBlob(node, {
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor: "#0a0f16",
    fontEmbedCSS,
    style: { transform: "none", margin: "0" },
  });
  if (!blob) throw new Error("capture-failed");
  return blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** اشتراک‌گذاری بومی موبایل — در صورت عدم پشتیبانی unsupported برمی‌گرداند */
export async function shareBlob(blob: Blob, filename: string): Promise<"shared" | "unsupported"> {
  const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
  try {
    const file = new File([blob], filename, { type: "image/png" });
    if (nav.canShare && nav.canShare({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: "Starteach Card" });
        return "shared";
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return "shared";
        throw e;
      }
    }
  } catch (e) {
    if ((e as Error)?.name === "AbortError") return "shared";
    throw e;
  }
  return "unsupported";
}

/** کپی تصویر در کلیپ‌بورد (دسکتاپ و iOS جدید) */
export async function copyBlob(blob: Blob): Promise<boolean> {
  try {
    if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  } catch {
    return false;
  }
}
