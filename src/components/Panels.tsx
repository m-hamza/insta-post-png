import type { CardConfig } from "../lib/config";
import {
  BG_IDS,
  FONTS,
  FONT_IDS,
  PRESET_ACCENTS,
  RATIO_IDS,
  RATIOS,
  SIZE_IDS,
  TEMPLATE_IDS,
  VERIFIED_IDS,
} from "../lib/config";
import { hexA } from "../lib/utils";
import { IDEA_TEXTS, PLACEHOLDERS, useI18n } from "../lib/i18n";
import {
  AlignLeft,
  AlignRight,
  BookmarkPlus,
  Code2,
  Grid3x3,
  Hash,
  Heart,
  ImagePlus,
  MessagesSquare,
  MonitorPlay,
  Paintbrush,
  Palette,
  RectangleHorizontal,
  Repeat2,
  Sparkles,
  Split,
  Trash2,
  Type,
  UserRound,
} from "lucide-react";
import { PanelSection, Field, TextInput, Segmented, ToggleSwitch, cx } from "./ui";
import { Highlight, VerifiedSeal } from "./CardCanvas";

type SetConfig = (patch: Partial<CardConfig>) => void;

/* ---------- قالب‌ها ---------- */
const TPL_META: Record<string, { icon: typeof MessageCircleIcon; sample: string }> = {
  tweet: { icon: MessageCircleIcon, sample: "متن کارت با هایلایت *رنگی*…" },
  hook: { icon: MegaphoneIcon, sample: "*تیتر* درشت و کوبنده" },
  problem: { icon: ScaleIcon, sample: "مشکل ← *راهکار*" },
  code: { icon: TerminalIcon, sample: "const tip = 'code';" },
};
function MessageCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
function MegaphoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}
function ScaleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}
function TerminalIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 17 6-6-6-6" />
      <path d="M12 19h8" />
    </svg>
  );
}

function TemplatePicker({ config, setConfig }: { config: CardConfig; setConfig: SetConfig }) {
  const { t, lang } = useI18n();
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {TEMPLATE_IDS.map((id) => {
        const active = config.template === id;
        const Meta = TPL_META[id];
        return (
          <button
            key={id}
            type="button"
            onClick={() => setConfig({ template: id })}
            className={cx(
              "rounded-xl border p-3 text-start transition-all duration-200 active:scale-[0.97]",
              active
                ? "border-brand-500/60 bg-brand-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_8px_24px_-12px_rgba(16,185,129,0.5)]"
                : "border-ink-700 bg-ink-900 hover:border-ink-600",
            )}
          >
            <span
              className="mb-2.5 block h-14 w-full overflow-hidden rounded-lg border"
              style={{
                borderColor: active ? hexA(config.accent, 0.45) : "#1b2735",
                background: "#0b1118",
                direction: "rtl",
              }}
            >
              <span className="block p-2">
                {id === "tweet" && (
                  <span className="block rounded-md border border-white/10 bg-ink-800 p-2">
                    <span className="mb-1.5 flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: config.accent }} />
                      <span className="h-1.5 w-10 rounded-full bg-ink-600" />
                    </span>
                    <span className="block h-1.5 w-4/5 rounded-full bg-ink-700" />
                    <span className="mt-1 block h-1.5 w-3/5 rounded-full bg-ink-700" />
                  </span>
                )}
                {id === "hook" && (
                  <span className="flex h-full flex-col items-start justify-center gap-1.5">
                    <span className="h-2.5 w-4/5 rounded-full bg-mist-300/80" />
                    <span className="h-2.5 w-1/2 rounded-full" style={{ background: config.accent }} />
                  </span>
                )}
                {id === "problem" && (
                  <span className="grid h-full grid-cols-2 gap-1.5">
                    <span className="rounded-md border border-rosex-400/40 bg-rosex-400/10 p-1.5">
                      <span className="block h-1.5 w-3/4 rounded-full bg-rosex-400/60" />
                    </span>
                    <span className="rounded-md border p-1.5" style={{ borderColor: hexA(config.accent, 0.4), background: hexA(config.accent, 0.1) }}>
                      <span className="block h-1.5 w-3/4 rounded-full" style={{ background: hexA(config.accent, 0.7) }} />
                    </span>
                  </span>
                )}
                {id === "code" && (
                  <span className="block h-full rounded-md border border-white/10 bg-[#0a0f1c] p-2">
                    <span className="mb-1.5 flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-rosex-400/70" />
                      <span className="h-1.5 w-1.5 rounded-full bg-goldx-400/70" />
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400/70" />
                    </span>
                    <span className="block h-1.5 w-4/5 rounded-full bg-ink-600" />
                    <span className="mt-1 block h-1.5 w-2/3 rounded-full" style={{ background: hexA(config.accent, 0.55) }} />
                  </span>
                )}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Meta.icon className={cx("h-4 w-4 shrink-0", active ? "text-brand-300" : "text-mist-500")} />
              <span className={cx("truncate text-[13px] font-bold", active ? "text-mist-100" : "text-mist-300")}>
                {t(`tpl.${id}`)}
              </span>
            </span>
          </button>
        );
      })}
      {/* یادآوری ایده فقط برای اطلاع — بدون اکشن */}
      <span className="col-span-2 flex items-start gap-1.5 text-[11px] leading-5 text-mist-500">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-goldx-400" />
        {lang === "fa"
          ? "ایده‌های آماده در تب «محتوا» کنار فیلد متن ذخیره شده‌اند."
          : "Ready-made ideas live in the Content tab, next to the text field."}
      </span>
    </div>
  );
}

/* ---------- تب محتوا ---------- */
export function ContentPanel({ config, setConfig }: { config: CardConfig; setConfig: SetConfig }) {
  const { t, num, lang } = useI18n();
  const addIdea = () => {
    const text = config.content.trim();
    if (!text || config.savedIdeas.includes(text)) return;
    setConfig({ savedIdeas: [text, ...config.savedIdeas].slice(0, 12) });
  };
  const ideas = IDEA_TEXTS[lang][config.template] ?? IDEA_TEXTS[lang].tweet;

  return (
    <div className="space-y-6">
      <PanelSection icon={<Type className="h-4 w-4" />} title={t("content.title")}>
        <div className="relative">
          <textarea
            dir="auto"
            rows={5}
            value={config.content}
            onChange={(e) => setConfig({ content: e.target.value })}
            placeholder={PLACEHOLDERS[lang][config.template]}
            className="w-full resize-y rounded-xl border border-ink-700 bg-ink-900 p-3.5 pb-7 text-[16px] leading-7 text-mist-100 outline-none transition-colors placeholder:text-mist-500/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          <span className="pointer-events-none absolute bottom-2.5 start-3.5 text-[11px] text-mist-500">
            {num(config.content.length)} {t("content.chars")}
          </span>
          <button
            type="button"
            onClick={addIdea}
            disabled={!config.content.trim()}
            title={t("content.saveIdea")}
            className="absolute bottom-2 end-2.5 rounded-lg p-1.5 text-brand-400 transition hover:bg-brand-500/10 active:scale-90 disabled:text-mist-500/50"
          >
            <BookmarkPlus className="h-4.5 w-4.5" />
          </button>
        </div>

        {config.savedIdeas.length > 0 && (
          <div className="mt-3 rounded-xl border border-ink-700 bg-ink-900/60 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-mist-400">
              <BookmarkPlus className="h-3.5 w-3.5 text-brand-400" />
              {t("content.ideas")}
              <span className="text-mist-500">({num(config.savedIdeas.length)})</span>
            </div>
            <ul className="max-h-44 space-y-1.5 overflow-y-auto">
              {config.savedIdeas.map((idea, i) => (
                <li key={`${idea.slice(0, 24)}-${i}`} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfig({ content: idea })}
                    className="min-w-0 flex-1 truncate rounded-lg border border-transparent bg-ink-800 px-3 py-2 text-start text-xs text-mist-200 transition hover:border-ink-600 hover:bg-ink-700 active:scale-[0.98]"
                  >
                    {idea.replace(/\n/g, " — ")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig({ savedIdeas: config.savedIdeas.filter((_, j) => j !== i) })}
                    className="rounded-lg p-2 text-mist-500 transition hover:bg-rosex-400/10 hover:text-rosex-400 active:scale-90"
                    aria-label={t("content.removeIdea.aria")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Segmented
            value={config.size}
            onChange={(size) => setConfig({ size })}
            options={SIZE_IDS.map((id) => ({ value: id, label: t(`size.${id}`) }))}
          />
          <Segmented
            value={config.textDir}
            onChange={(textDir) => setConfig({ textDir })}
            options={[
              { value: "rtl", label: t("content.dir.rtl"), title: t("content.dir.rtl") },
              { value: "ltr", label: t("content.dir.ltr"), title: t("content.dir.ltr") },
            ]}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Field label={t("content.font")}>
              <div className="grid grid-cols-2 gap-2">
                {FONT_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setConfig({ font: id })}
                    className={cx(
                      "flex h-11 items-center justify-between rounded-xl border px-3.5 transition-all active:scale-[0.97]",
                      config.font === id
                        ? "border-brand-500/60 bg-brand-500/10 text-mist-100"
                        : "border-ink-700 bg-ink-900 text-mist-400 hover:border-ink-600",
                    )}
                  >
                    <span className="text-[13px] font-semibold">{t(`font.${id}`)}</span>
                    <span className="truncate text-[11px] text-mist-500" style={{ fontFamily: FONTS[id].stack }}>
                      آا 12
                    </span>
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>
      </PanelSection>

      <PanelSection icon={<Sparkles className="h-4 w-4" />} title={t("content.ideas")}>
        <div className="space-y-2">
          {ideas.map((idea) => (
            <button
              key={idea}
              type="button"
              onClick={() => setConfig({ content: idea })}
              className="block w-full rounded-xl border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-start text-[13px] leading-6 text-mist-300 transition hover:border-brand-500/40 hover:bg-ink-800 active:scale-[0.99]"
            >
              <Highlight text={idea} accent={config.accent} />
            </button>
          ))}
        </div>
      </PanelSection>
    </div>
  );
}

/* ---------- تب ظاهر ---------- */
export function StylePanel({ config, setConfig }: { config: CardConfig; setConfig: SetConfig }) {
  const { t } = useI18n();
  const isPreset = PRESET_ACCENTS.includes(config.accent);
  return (
    <div className="space-y-6">
      <PanelSection icon={<MonitorPlay className="h-4 w-4" />} title={t("style.template")}>
        <TemplatePicker config={config} setConfig={setConfig} />
      </PanelSection>

      <PanelSection icon={<RectangleHorizontal className="h-4 w-4" />} title={t("style.ratio")}>
        <div className="grid grid-cols-3 gap-2.5">
          {RATIO_IDS.map((id) => {
            const { w, h } = RATIOS[id];
            const active = config.ratio === id;
            const boxW = id === "16:9" ? 46 : id === "1:1" ? 34 : 22;
            const boxH = id === "16:9" ? 26 : id === "1:1" ? 34 : 42;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setConfig({ ratio: id })}
                className={cx(
                  "flex flex-col items-center gap-2 rounded-xl border py-3.5 transition-all active:scale-[0.96]",
                  active
                    ? "border-brand-500/60 bg-brand-500/10"
                    : "border-ink-700 bg-ink-900 hover:border-ink-600",
                )}
              >
                <span
                  className="block rounded-[4px] border-2"
                  style={{
                    width: boxW,
                    height: boxH,
                    borderColor: active ? config.accent : "#26374a",
                    background: active ? hexA(config.accent, 0.15) : "transparent",
                  }}
                />
                <span className={cx("font-code text-[12px] font-semibold", active ? "text-brand-300" : "text-mist-400")}>
                  {t(`ratio.${id}`)}
                </span>
              </button>
            );
          })}
        </div>
      </PanelSection>

      <PanelSection icon={<Palette className="h-4 w-4" />} title={t("style.accent")}>
        <div className="flex items-center gap-2.5">
          {PRESET_ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setConfig({ accent: c })}
              className={cx(
                "h-8.5 w-8.5 shrink-0 rounded-full border-2 transition-transform active:scale-90",
                config.accent === c ? "scale-110 border-mist-100" : "border-transparent hover:scale-105",
              )}
              style={{ background: c, boxShadow: config.accent === c ? `0 0 18px ${hexA(c, 0.45)}` : undefined }}
              aria-label={c}
            />
          ))}
          <label
            className={cx(
              "relative ms-auto h-8.5 w-8.5 shrink-0 cursor-pointer rounded-full border-2 border-dashed transition-transform active:scale-90",
              !isPreset ? "scale-110 border-mist-100" : "border-ink-600 hover:scale-105",
            )}
            title={t("style.custom")}
          >
            <input
              type="color"
              value={config.accent}
              onChange={(e) => setConfig({ accent: e.target.value })}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span
              className="pointer-events-none absolute inset-1 rounded-full"
              style={{ background: `conic-gradient(#f43f5e,#f59e0b,#10b981,#0ea5e9,#a855f7,#f43f5e)` }}
            />
          </label>
        </div>
      </PanelSection>

      <PanelSection icon={<Paintbrush className="h-4 w-4" />} title={t("style.bg")}>
        <Segmented
          value={config.bg}
          onChange={(bg) => setConfig({ bg })}
          options={BG_IDS.map((id) => ({ value: id, label: t(`bg.${id}`) }))}
        />
      </PanelSection>
    </div>
  );
}

/* ---------- تب برند ---------- */
export function BrandPanel({
  config,
  setConfig,
  onLogoFile,
}: {
  config: CardConfig;
  setConfig: SetConfig;
  onLogoFile: (f: File | null) => void;
}) {
  const { t, lang } = useI18n();
  return (
    <div className="space-y-6">
      <PanelSection icon={<UserRound className="h-4 w-4" />} title={t("brand.title")}>
        <div className="space-y-3">
          <Field label={t("brand.name")}>
            <TextInput
              dir="auto"
              value={config.brandName}
              onChange={(e) => setConfig({ brandName: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("brand.handle")}>
              <TextInput
                dir="ltr"
                mono
                value={config.brandHandle}
                onChange={(e) => setConfig({ brandHandle: e.target.value })}
              />
            </Field>
            <Field label={t("brand.domain")}>
              <TextInput
                dir="ltr"
                mono
                value={config.brandDomain}
                onChange={(e) => setConfig({ brandDomain: e.target.value })}
              />
            </Field>
          </div>
          <Field label={t("brand.verified")}>
            <div className="grid grid-cols-4 gap-2">
              {VERIFIED_IDS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setConfig({ verified: v })}
                  className={cx(
                    "flex flex-col items-center gap-1.5 rounded-xl border py-2.5 transition-all active:scale-95",
                    config.verified === v
                      ? "border-brand-500/60 bg-brand-500/10"
                      : "border-ink-700 bg-ink-900 hover:border-ink-600",
                  )}
                >
                  <VerifiedSeal
                    color={v === "none" ? "#33445a" : v === "brand" ? config.accent : v === "blue" ? "#3d9df2" : "#f0b429"}
                    size={18}
                  />
                  <span
                    className={cx(
                      "text-[11px] font-semibold",
                      config.verified === v ? "text-mist-100" : "text-mist-500",
                    )}
                  >
                    {t(`ver.${v}`)}
                  </span>
                </button>
              ))}
            </div>
          </Field>
        </div>
      </PanelSection>

      <PanelSection
        icon={<ImagePlus className="h-4 w-4" />}
        title={t("brand.logo")}
        trailing={
          config.logoData ? (
            <button
              type="button"
              onClick={() => {
                onLogoFile(null);
                setConfig({ logoData: null });
              }}
              className="text-xs font-bold text-rosex-400 transition hover:underline"
            >
              {t("brand.logoRemove")}
            </button>
          ) : undefined
        }
      >
        <div className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 p-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-600 bg-ink-800">
            {config.logoData ? (
              <img src={config.logoData} alt="logo" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="h-5 w-5 text-mist-500" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-mist-300">
              {config.logoData ? t("brand.logoImgStatus") : t("brand.logoTextStatus")}
            </p>
            <label className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-ink-600 bg-ink-800 px-3 py-1.5 text-[12px] font-bold text-mist-200 transition hover:border-brand-500/50 hover:text-brand-300 active:scale-95">
              <ImagePlus className="h-3.5 w-3.5" />
              {t("brand.logoPick")}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  onLogoFile(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </PanelSection>

      <PanelSection
        icon={<Hash className="h-4 w-4" />}
        title={t("brand.stats")}
        trailing={<ToggleSwitch on={config.showStats} onChange={(v) => setConfig({ showStats: v })} />}
      >
        {config.showStats && (
          <div className="grid grid-cols-3 gap-3">
            <Field label={t("brand.comments")}>
              <div className="relative">
                <MessagesSquare className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
                <TextInput
                  dir="ltr"
                  mono
                  className="ps-9"
                  value={config.stats.comments}
                  onChange={(e) => setConfig({ stats: { ...config.stats, comments: e.target.value } })}
                />
              </div>
            </Field>
            <Field label={t("brand.retweets")}>
              <div className="relative">
                <Repeat2 className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
                <TextInput
                  dir="ltr"
                  mono
                  className="ps-9"
                  value={config.stats.retweets}
                  onChange={(e) => setConfig({ stats: { ...config.stats, retweets: e.target.value } })}
                />
              </div>
            </Field>
            <Field label={t("brand.likes")}>
              <div className="relative">
                <Heart className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rosex-400" />
                <TextInput
                  dir="ltr"
                  mono
                  className="ps-9"
                  value={config.stats.likes}
                  onChange={(e) => setConfig({ stats: { ...config.stats, likes: e.target.value } })}
                />
              </div>
            </Field>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Segmented
            value={config.headerAlign}
            onChange={(headerAlign) => setConfig({ headerAlign })}
            options={[
              { value: "right", label: <AlignRight className="h-4 w-4" />, title: t("content.dir.rtl") },
              { value: "left", label: <AlignLeft className="h-4 w-4" />, title: t("content.dir.ltr") },
            ]}
          />
          <span className="flex items-center justify-center rounded-xl border border-ink-700 bg-ink-900 text-[11px] text-mist-500">
            <Grid3x3 className="ms-2 h-3.5 w-3.5" />
            {lang === "fa" ? "چینش هدر کارت" : "Card header layout"}
          </span>
        </div>
      </PanelSection>
    </div>
  );
}
