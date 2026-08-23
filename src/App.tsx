import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Download, Loader2, Palette, PenLine, RotateCcw, Share2, User } from "lucide-react";

import type { CardConfig, RatioId } from "./lib/config";
import { DEFAULT_CONFIG, RATIOS, TEMPLATES } from "./lib/config";
import { clearConfig, faDigits, fileToLogoDataUrl, loadConfig, saveConfig } from "./lib/utils";
import { captureCard, copyBlob, downloadBlob, shareBlob } from "./lib/exporter";

import PreviewStage from "./components/PreviewStage";
import { BrandPanel, ContentPanel, StylePanel } from "./components/Panels";
import type { Notify, Patch } from "./components/Panels";
import { cx, Sheet, Toasts } from "./components/ui";
import type { ToastItem } from "./components/ui";

type TabId = "content" | "style" | "brand";

const TABS: { id: TabId; label: string; icon: typeof PenLine }[] = [
  { id: "content", label: "محتوا", icon: PenLine },
  { id: "style", label: "ظاهر", icon: Palette },
  { id: "brand", label: "برند", icon: User },
];

const RATIO_GLYPH: Record<RatioId, string> = {
  "9:16": "h-4 w-2.5",
  "1:1": "h-3 w-3",
  "16:9": "h-2.5 w-4",
};

export default function App() {
  const [config, setConfig] = useState<CardConfig>(loadConfig);
  const [tab, setTab] = useState<TabId>("content");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [saveFlash, setSaveFlash] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const toastId = useRef(0);
  const firstRun = useRef(true);

  const patch: Patch = useCallback((p) => setConfig((c) => ({ ...c, ...p })), []);

  const notify: Notify = useCallback((kind, text) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, kind, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2700);
  }, []);

  /* ذخیره‌ی خودکار با تأخیر */
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      const ok = saveConfig(config);
      if (ok) setSaveFlash((f) => f + 1);
      else notify("error", "حافظه‌ی مرورگر پر است؛ لوگوی سبک‌تری انتخاب کن");
    }, 400);
    return () => window.clearTimeout(t);
  }, [config, notify]);

  const filenameFor = () => `starteach-${config.template}-${config.ratio.replace(":", "x")}.png`;

  async function handleDownload() {
    if (busy.current || !stageRef.current) return;
    busy.current = true;
    setExporting(true);
    try {
      const blob = await captureCard(stageRef.current);
      downloadBlob(blob, filenameFor());
      const { w, h } = RATIOS[config.ratio];
      notify("success", `تصویر ${faDigits(w)}×${faDigits(h)} دانلود شد`);
    } catch (e) {
      console.error(e);
      notify("error", "خطا در ساخت تصویر؛ دوباره تلاش کن");
    } finally {
      busy.current = false;
      setExporting(false);
    }
  }

  async function handleShare() {
    if (busy.current || !stageRef.current) return;
    busy.current = true;
    setExporting(true);
    try {
      const blob = await captureCard(stageRef.current);
      const res = await shareBlob(blob, filenameFor());
      if (res === "unsupported") {
        downloadBlob(blob, filenameFor());
        notify("info", "اشتراک‌گذاری در دسترس نبود؛ فایل دانلود شد");
      }
    } catch (e) {
      console.error(e);
      notify("error", "خطا در ساخت تصویر؛ دوباره تلاش کن");
    } finally {
      busy.current = false;
      setExporting(false);
    }
  }

  async function handleCopy() {
    if (busy.current || !stageRef.current) return;
    busy.current = true;
    setExporting(true);
    try {
      const blob = await captureCard(stageRef.current);
      const ok = await copyBlob(blob);
      notify(ok ? "success" : "error", ok ? "تصویر در کلیپ‌بورد کپی شد" : "کپی تصویر در این مرورگر پشتیبانی نمی‌شود");
    } catch (e) {
      console.error(e);
      notify("error", "خطا در کپی تصویر");
    } finally {
      busy.current = false;
      setExporting(false);
    }
  }

  async function handleLogoFile(file: File) {
    try {
      const data = await fileToLogoDataUrl(file);
      patch({ logoData: data });
      notify("success", "لوگو فشرده و ذخیره شد");
    } catch {
      notify("error", "فایل انتخابی یک تصویر معتبر نیست");
    }
  }

  function handleReset() {
    clearConfig();
    setConfig({ ...DEFAULT_CONFIG, stats: { ...DEFAULT_CONFIG.stats } });
    setSheetOpen(false);
    notify("success", "همه‌چیز به تنظیمات اولیه برگشت");
  }

  const { w, h } = RATIOS[config.ratio];
  const tabIdx = TABS.findIndex((t) => t.id === tab);

  return (
    <div className="flex min-h-dvh flex-col">
      <Toasts items={toasts} />

      {/* ============ هدر ============ */}
      <header className="sticky top-0 z-50 border-b border-ink-800 bg-ink-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-xl bg-brand-500 shadow-[0_8px_24px_-8px_rgba(16,185,129,0.7)]">
              <span className="font-display text-[22px] leading-none text-ink-950">س</span>
            </div>
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 font-display text-lg leading-6 text-mist-100">
                استودیو استارتیچ
                <span className="rounded-full border border-brand-500/25 bg-brand-500/10 px-2 py-0.5 font-code text-[10px] font-semibold text-brand-300" dir="ltr">
                  v3.0
                </span>
              </h1>
              <p className="hidden truncate text-[11px] text-mist-500 sm:block">
                کارت و کاور ریلز برای شبکه‌های اجتماعی — خروجی بومی {faDigits(w)}×{faDigits(h)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveFlash > 0 && (
              <span key={saveFlash} className="saved-flash hidden items-center gap-1 text-[11px] font-semibold text-brand-400 sm:flex">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                ذخیره شد
              </span>
            )}

            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={handleCopy}
                title="کپی تصویر"
                className="rounded-xl border border-ink-700 bg-ink-800 p-2.5 text-mist-300 transition hover:border-ink-600 hover:text-mist-100 active:scale-95"
              >
                <Copy className="h-4.5 w-4.5" />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex h-10 items-center gap-2 rounded-xl border border-ink-700 bg-ink-800 px-4 text-[13px] font-bold text-mist-200 transition hover:border-ink-600 active:scale-95"
              >
                <Share2 className="h-4 w-4" />
                اشتراک‌گذاری
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={exporting}
                className="flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-5 text-[13px] font-extrabold text-ink-950 shadow-[0_10px_28px_-10px_rgba(16,185,129,0.65)] transition hover:bg-brand-400 active:scale-95 disabled:opacity-70"
              >
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                دانلود PNG
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              title="بازنشانی تنظیمات"
              className="rounded-xl border border-ink-700 bg-ink-800 p-2.5 text-mist-400 transition hover:border-rosex-400/50 hover:text-rosex-400 active:scale-95"
            >
              <RotateCcw className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ============ بدنه ============ */}
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 pb-32 lg:grid lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start lg:gap-7 lg:px-6 lg:pb-14 lg:pt-6">
        {/* --- پیش‌نمایش --- */}
        <section className="-mx-4 overflow-hidden border-b border-ink-800 bg-ink-900/60 lg:mx-0 lg:sticky lg:top-20 lg:rounded-2xl lg:border lg:shadow-2xl">
          {/* نوار ابزار پیش‌نمایش */}
          <div className="flex items-center justify-between gap-2 border-b border-ink-800 px-4 py-3">
            <span className="flex items-center gap-2 text-xs font-bold text-mist-300">
              <span className="pulse-dot h-2 w-2 rounded-full bg-brand-400" />
              پیش‌نمایش زنده
              <span className="hidden text-[11px] font-semibold text-mist-500 sm:inline">
                — قالب «{TEMPLATES[config.template].label}»
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="rounded-lg border border-ink-700 bg-ink-800 px-2.5 py-1 font-code text-[11px] text-mist-300" dir="ltr">
                {w}×{h}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="کپی تصویر در کلیپ‌بورد"
                className="rounded-lg border border-ink-700 bg-ink-800 p-1.5 text-mist-400 transition hover:text-mist-100 active:scale-95 lg:hidden"
              >
                <Copy className="h-4 w-4" />
              </button>
            </span>
          </div>

          {/* صحنه */}
          <div
            className="relative px-4 py-5"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1.5px)",
              backgroundSize: "19px 19px",
            }}
          >
            <PreviewStage config={config} stageRef={stageRef} className="h-[44dvh] min-h-[300px] max-h-[430px] lg:h-[500px] lg:max-h-none" />
          </div>

          {/* انتخاب سریع ابعاد */}
          <div className="flex items-center gap-2 overflow-x-auto border-t border-ink-800 px-4 py-3 no-scrollbar">
            {(Object.keys(RATIOS) as RatioId[]).map((id) => {
              const r = RATIOS[id];
              const active = config.ratio === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => patch({ ratio: id })}
                  className={cx(
                    "flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-all active:scale-95",
                    active
                      ? "border-brand-500/70 bg-brand-500/10 text-brand-300"
                      : "border-ink-700 bg-ink-900 text-mist-400 hover:border-ink-600 hover:text-mist-200",
                  )}
                >
                  <span className={cx("rounded-[3px] border-[1.5px] border-current", RATIO_GLYPH[id])} />
                  {r.label}
                  <span className="hidden font-medium text-mist-500 sm:inline">· {r.use}</span>
                </button>
              );
            })}
            <span className="ms-auto hidden shrink-0 font-code text-[10.5px] text-mist-500 lg:inline" dir="ltr">
              PNG · {w}×{h}
            </span>
          </div>
        </section>

        {/* --- کنترل‌ها --- */}
        <section className="min-w-0 lg:pt-0">
          {/* نوار تب‌ها */}
          <div className="sticky top-14 z-40 -mx-4 border-b border-ink-800 bg-ink-950/92 px-4 backdrop-blur-md lg:sticky lg:top-20 lg:z-30 lg:mx-0 lg:rounded-t-2xl lg:border lg:border-b-0 lg:bg-ink-900/80">
            <div className="relative flex">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={cx(
                      "relative z-10 flex h-12 flex-1 items-center justify-center gap-2 text-[13.5px] font-extrabold transition-colors",
                      active ? "text-brand-300" : "text-mist-500 hover:text-mist-300",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </button>
                );
              })}
              <span
                aria-hidden
                className="absolute bottom-0 h-[2.5px] rounded-full bg-brand-400 transition-transform duration-300 ease-out"
                style={{ width: `${100 / TABS.length}%`, right: 0, transform: `translateX(${-tabIdx * 100}%)` }}
              />
            </div>
          </div>

          <div className="-mx-4 border-b border-ink-800 bg-ink-900/40 px-4 py-4 lg:mx-0 lg:rounded-b-2xl lg:border lg:px-5 lg:py-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                {tab === "content" && <ContentPanel config={config} patch={patch} notify={notify} />}
                {tab === "style" && <StylePanel config={config} patch={patch} />}
                {tab === "brand" &&
                  (
                    <BrandPanel
                      config={config}
                      patch={patch}
                      onLogoFile={handleLogoFile}
                      onRemoveLogo={() => {
                        patch({ logoData: null });
                        notify("info", "لوگو حذف شد؛ حروف اختصاری جایگزین می‌شود");
                      }}
                    />
                  )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* ============ نوار اقدام موبایل ============ */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-700 bg-ink-950/95 px-4 pt-3 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "calc(0.8rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-md gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            disabled={exporting}
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-ink-600 bg-ink-800 px-4 text-sm font-bold text-mist-200 transition active:scale-95 disabled:opacity-60"
          >
            <Share2 className="h-4.5 w-4.5" />
            اشتراک
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={exporting}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 text-[15px] font-extrabold text-ink-950 shadow-[0_12px_32px_-10px_rgba(16,185,129,0.65)] transition active:scale-[0.98] disabled:opacity-70"
          >
            {exporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            {exporting ? "در حال ساخت تصویر…" : "دانلود خروجی PNG"}
          </button>
        </div>
      </div>

      {/* ============ شیت بازنشانی ============ */}
      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="بازنشانی استودیو">
        <p className="mb-5 text-sm leading-7 text-mist-400">
          همه‌ی تنظیمات، متن کارت و لوگوی ذخیره‌شده پاک می‌شود و استودیو به حالت اولیه برمی‌گردد. این کار قابل بازگشت
          نیست.
        </p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="h-12 flex-1 rounded-xl border border-ink-600 bg-ink-800 text-sm font-bold text-mist-200 transition hover:bg-ink-700 active:scale-95"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="h-12 flex-1 rounded-xl bg-rosex-400 text-sm font-extrabold text-ink-950 transition hover:brightness-110 active:scale-95"
          >
            بله، بازنشانی کن
          </button>
        </div>
      </Sheet>
    </div>
  );
}
