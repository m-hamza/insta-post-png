import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Download, Languages, RotateCcw, Sparkles } from "lucide-react";
import type { CardConfig } from "./lib/config";
import { DEFAULT_CONFIG, RATIOS } from "./lib/config";
import { captureCard, copyBlob, downloadBlob, shareBlob } from "./lib/exporter";
import { clearConfig, fileToLogoDataUrl, loadConfig, saveConfig } from "./lib/utils";
import { I18nProvider, IDEA_TEXTS, useI18n } from "./lib/i18n";
import CardCanvas from "./components/CardCanvas";
import PreviewStage from "./components/PreviewStage";
import { BrandPanel, ContentPanel, StylePanel } from "./components/Panels";
import { Sheet, Toasts, cx, type ToastItem } from "./components/ui";

type Tab = "preview" | "content" | "style" | "brand";

/* ================= پوسته‌ی اصلی (داخل Provider) ================= */
function Studio({
  config,
  setConfig,
}: {
  config: CardConfig;
  setConfig: Dispatch<SetStateAction<CardConfig>>;
}) {
  const { t, dir, lang } = useI18n();
  const [tab, setTab] = useState<Tab>("preview");
  const [exporting, setExporting] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [savedTick, setSavedTick] = useState(0);
  const exportNode = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(1);

  const patch = (p: Partial<CardConfig>) => setConfig((c) => ({ ...c, ...p }));

  const pushToast = (kind: ToastItem["kind"], key: string) => {
    const id = idRef.current++;
    setToasts((ts) => [...ts.slice(-2), { id, kind, key }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 3200);
  };

  useEffect(() => {
    if (!saveConfig(config)) {
      pushToast("error", "toast.storageFull");
    } else {
      setSavedTick((n) => n + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const onLogoFile = async (file: File | null) => {
    if (!file) return;
    try {
      const data = await fileToLogoDataUrl(file);
      patch({ logoData: data });
      pushToast("success", "toast.logoSaved");
    } catch (e) {
      pushToast("error", (e as Error).message === "not-image" ? "toast.notImage" : "toast.badImage");
    }
  };

  const doExport = async () => {
    if (!exportNode.current || exporting) return;
    setExporting(true);
    try {
      const blob = await captureCard(exportNode.current);
      const r = RATIOS[config.ratio];
      const filename = `starteach-${config.template}-${r.w}x${r.h}-${Date.now()}.png`;
      const shared = await shareBlob(blob, filename);
      if (shared === "unsupported") {
        downloadBlob(blob, filename);
        pushToast("success", "toast.downloaded");
      }
    } catch {
      pushToast("error", "toast.badImage");
    } finally {
      setExporting(false);
    }
  };

  const doCopy = async () => {
    if (!exportNode.current) return;
    const blob = await captureCard(exportNode.current);
    const ok = await copyBlob(blob);
    pushToast(ok ? "success" : "error", ok ? "toast.copied" : "toast.copyFail");
  };

  const doReset = () => {
    clearConfig();
    setConfig({ ...DEFAULT_CONFIG, lang });
    setResetOpen(false);
    pushToast("success", "toast.reset");
  };

  const addTemplateIdea = () => {
    const list = IDEA_TEXTS[lang][config.template] ?? IDEA_TEXTS[lang].tweet;
    patch({ content: list[0] });
  };

  const ratio = RATIOS[config.ratio];

  const tabs: { id: Tab; label: string }[] = [
    { id: "preview", label: t("tab.preview") },
    { id: "content", label: t("tab.content") },
    { id: "style", label: t("tab.style") },
    { id: "brand", label: t("tab.brand") },
  ];

  return (
    <div dir={dir} className="flex min-h-dvh flex-col">
      <Toasts items={toasts} />

      {/* ---------- هدر ---------- */}
      <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2.5 px-3 md:h-16 md:px-5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-lg"
            style={{ background: config.accent, boxShadow: `0 6px 22px -6px ${config.accent}` }}
          >
            <span className="font-display text-[15px] leading-none text-ink-950">ST</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-display truncate text-[17px] leading-6 text-mist-100 md:text-lg">
              {lang === "fa" ? "استودیو کارت استارتیچ" : "Starteach Card Studio"}
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: config.accent }} />
              <span className="font-code text-[10px] text-mist-500">{t("app.version")}</span>
            </div>
          </div>

          <div className="ms-auto flex items-center gap-1.5 md:gap-2">
            {/* کلید تغییر زبان */}
            <button
              type="button"
              onClick={() => patch({ lang: lang === "fa" ? "en" : "fa" })}
              title={t("lang.aria")}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-ink-700 bg-ink-900 px-2.5 text-[12px] font-extrabold text-mist-300 transition hover:border-ink-600 hover:text-mist-100 active:scale-95"
            >
              <Languages className="h-4 w-4 text-skyx-400" />
              <span className="font-code">{lang === "fa" ? "EN" : "فا"}</span>
            </button>

            <button
              type="button"
              onClick={() => setResetOpen(true)}
              title={t("reset.aria")}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-700 bg-ink-900 text-mist-400 transition hover:border-ink-600 hover:text-mist-100 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={doCopy}
              title={t("toast.copied")}
              className="hidden h-9 w-9 items-center justify-center rounded-xl border border-ink-700 bg-ink-900 text-mist-400 transition hover:border-ink-600 hover:text-mist-100 active:scale-95 sm:flex"
            >
              <Copy className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={doExport}
              disabled={exporting}
              className="hidden h-9 items-center gap-1.5 rounded-xl px-3.5 text-[13px] font-extrabold text-ink-950 transition active:scale-95 disabled:opacity-60 md:flex"
              style={{ background: config.accent, boxShadow: `0 8px 24px -8px ${config.accent}` }}
            >
              <Download className="h-4 w-4" />
              {t("btn.download")}
            </button>
          </div>
        </div>
      </header>

      {/* ---------- بدنه ---------- */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-0 pt-0 pb-40 md:grid md:grid-cols-[400px_1fr] md:items-start md:gap-5 md:px-5 md:pb-10 md:pt-5 lg:grid-cols-[430px_1fr]">
        {/* پنل تنظیمات: بعد از پیش‌نمایش در موبایل، اول در دسکتاپ */}
        <aside className="order-2 border-t border-ink-800 bg-ink-900/40 px-4 py-4 md:order-1 md:rounded-2xl md:border md:px-4 md:py-5">
          <div className="sticky top-16 hidden md:block">
            <div className="mb-4 flex rounded-xl border border-ink-700 bg-ink-900 p-1">
              {tabs.slice(1).map((tb) => (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setTab(tb.id)}
                  className={cx(
                    "flex-1 rounded-lg py-2 text-[13px] font-bold transition-all duration-200",
                    tab === tb.id ? "bg-ink-600 text-brand-300 shadow-sm" : "text-mist-500 hover:text-mist-300",
                  )}
                >
                  {tb.label}
                </button>
              ))}
            </div>
            <div className="scrollbar-slim max-h-[calc(100dvh-10rem)] overflow-y-auto pe-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  {tab === "content" && <ContentPanel config={config} setConfig={patch} />}
                  {tab === "style" && <StylePanel config={config} setConfig={patch} />}
                  {tab === "brand" && <BrandPanel config={config} setConfig={patch} onLogoFile={onLogoFile} />}
                  {tab === "preview" && <ContentPanel config={config} setConfig={patch} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* تب‌های موبایل */}
          <div className="md:hidden">
            <div className="mb-4 flex rounded-xl border border-ink-700 bg-ink-900 p-1">
              {tabs.slice(1).map((tb) => (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setTab(tb.id)}
                  className={cx(
                    "flex-1 rounded-lg py-2 text-[13px] font-bold transition-all duration-200",
                    tab === tb.id ? "bg-ink-600 text-brand-300 shadow-sm" : "text-mist-500 hover:text-mist-300",
                  )}
                >
                  {tb.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {tab === "content" && <ContentPanel config={config} setConfig={patch} />}
                {tab === "style" && <StylePanel config={config} setConfig={patch} />}
                {tab === "brand" && <BrandPanel config={config} setConfig={patch} onLogoFile={onLogoFile} />}
                {tab === "preview" && <ContentPanel config={config} setConfig={patch} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>

        {/* پیش‌نمایش: اول در موبایل */}
        <section className="order-1 md:order-2">
          <div className="-mx-0 border-b border-ink-800 bg-ink-900/40 px-4 py-4 md:mx-0 md:rounded-2xl md:border md:px-5 md:py-5">
            <PreviewStage ratioId={config.ratio} nodeRef={exportNode}>
              <CardCanvas config={config} />
            </PreviewStage>
            <div className="mt-3 flex items-center justify-between">
              <span key={savedTick} className={savedTick ? "saved-flash text-[11px] font-semibold text-brand-400" : "text-[11px] text-transparent"}>
                {t("saved")}
              </span>
              <span className="font-code text-[11px] text-mist-500" dir="ltr">
                {ratio.w}×{ratio.h} px
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- نوار اقدام پایین (موبایل) ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-800 bg-ink-950/92 backdrop-blur-md md:hidden">
        <div className="flex gap-2.5 px-3 pt-2.5" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
          <button
            type="button"
            onClick={doExport}
            disabled={exporting}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-[15px] font-extrabold text-ink-950 transition active:scale-[0.97] disabled:opacity-60"
            style={{ background: config.accent, boxShadow: `0 10px 30px -10px ${config.accent}` }}
          >
            {exporting ? (
              <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            {t("btn.download")}
          </button>
          <button
            type="button"
            onClick={doCopy}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-700 bg-ink-900 text-mist-300 transition active:scale-95"
            aria-label={t("toast.copied")}
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ---------- شیت بازنشانی ---------- */}
      <Sheet open={resetOpen} onClose={() => setResetOpen(false)} title={t("reset.title")}>
        <p className="text-sm leading-7 text-mist-300">{t("reset.body")}</p>
        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={() => setResetOpen(false)}
            className="h-11 flex-1 rounded-xl border border-ink-600 bg-ink-800 text-sm font-bold text-mist-200 transition hover:bg-ink-700 active:scale-[0.98]"
          >
            {t("reset.cancel")}
          </button>
          <button
            type="button"
            onClick={doReset}
            className="h-11 flex-1 rounded-xl bg-rosex-400 text-sm font-extrabold text-ink-950 transition hover:brightness-110 active:scale-[0.98]"
          >
            {t("reset.confirm")}
          </button>
        </div>
      </Sheet>

      {/* دکمه‌ی شناور تغییر سریع متن (موبایل) */}
      {tab !== "preview" && (
        <button
          type="button"
          onClick={addTemplateIdea}
          className="fixed bottom-24 end-4 z-30 flex h-11 items-center gap-1.5 rounded-full border border-ink-600 bg-ink-800/95 px-4 text-[12px] font-bold text-mist-200 shadow-xl backdrop-blur transition hover:border-brand-500/50 hover:text-brand-300 active:scale-95 md:hidden"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          {lang === "fa" ? "یه ایده بده" : "Inspire me"}
        </button>
      )}
    </div>
  );
}

/* ================= ریشه با Provider ================= */
export default function App() {
  const [config, setConfig] = useState<CardConfig>(loadConfig);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = config.lang;
    el.dir = config.lang === "fa" ? "rtl" : "ltr";
    document.title =
      config.lang === "fa" ? "استودیو کارت و ریلز استارتیچ" : "Starteach Card & Reels Studio";
  }, [config.lang]);

  return (
    <I18nProvider lang={config.lang}>
      <Studio config={config} setConfig={setConfig} />
    </I18nProvider>
  );
}
