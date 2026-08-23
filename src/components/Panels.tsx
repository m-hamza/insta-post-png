import { useRef } from "react";
import type { CardConfig, FontId, SizeId, TemplateId, VerifiedId } from "../lib/config";
import { ACCENT_PRESETS, BGS, FONTS, IDEAS, SIZES, TEMPLATES } from "../lib/config";
import { faDigits, hexA } from "../lib/utils";
import { VerifiedSeal } from "./CardCanvas";
import { cx, Field, PanelSection, Segmented, TextInput, ToggleSwitch } from "./ui";
import {
  AlignLeft,
  AlignRight,
  Check,
  ImagePlus,
  LayoutTemplate,
  MessageCircle,
  Palette,
  PenLine,
  Sparkles,
  Trash2,
  Type,
  User,
  Wallpaper,
} from "lucide-react";

export type Patch = (p: Partial<CardConfig>) => void;
export type Notify = (kind: "success" | "error" | "info", text: string) => void;

function checkColorOn(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return "#fff";
  const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.62 ? "#0a0f16" : "#ffffff";
}

/* ================= گالری قالب‌ها ================= */

function Bar({ w, c }: { w: string; c: string }) {
  return <div style={{ height: 6, borderRadius: 4, width: w, background: c }} />;
}

function TemplateThumb({ id, accent }: { id: TemplateId; accent: string }) {
  const ink = "#26374a";
  const soft = "#1b2735";
  if (id === "tweet")
    return (
      <div className="flex h-full flex-col justify-between rounded-lg border border-ink-600 bg-ink-800 p-2">
        <div className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: accent }} />
          <div className="flex-1 space-y-1">
            <Bar w="70%" c={ink} />
            <Bar w="45%" c={soft} />
          </div>
        </div>
        <div className="space-y-1">
          <Bar w="100%" c={ink} />
          <Bar w="86%" c={ink} />
          <Bar w="52%" c={accent} />
        </div>
        <div className="flex gap-1.5 border-t border-ink-600 pt-1.5">
          <Bar w="16%" c={soft} />
          <Bar w="16%" c={soft} />
          <Bar w="16%" c={soft} />
        </div>
      </div>
    );
  if (id === "hook")
    return (
      <div
        className="relative flex h-full flex-col justify-center gap-1.5 overflow-hidden rounded-lg border border-ink-600 p-2"
        style={{ background: `linear-gradient(150deg, #101722, ${hexA(accent, 0.16)})` }}
      >
        <span className="absolute -top-2.5 left-0 font-display text-2xl leading-none" style={{ color: hexA(accent, 0.5) }}>
          «
        </span>
        <Bar w="92%" c={ink} />
        <Bar w="76%" c={ink} />
        <Bar w="55%" c={accent} />
        <div className="mt-1 flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
          <Bar w="34%" c={soft} />
        </div>
      </div>
    );
  if (id === "problem")
    return (
      <div className="flex h-full flex-col justify-center gap-1.5 rounded-lg border border-ink-600 bg-ink-800 p-2">
        <div className="space-y-1 rounded-md border border-rosex-400/50 bg-rosex-400/10 p-1.5">
          <Bar w="70%" c="#5d3a44" />
          <Bar w="50%" c="#4a2e37" />
        </div>
        <span className="mx-auto block h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
        <div className="space-y-1 rounded-md border p-1.5" style={{ borderColor: hexA(accent, 0.5), background: hexA(accent, 0.1) }}>
          <Bar w="76%" c={ink} />
          <Bar w="54%" c={ink} />
        </div>
      </div>
    );
  return (
    <div className="flex h-full flex-col gap-1.5 rounded-lg border border-ink-600 bg-[#0a0f1c] p-2">
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
      </div>
      <Bar w="60%" c="#33445a" />
      <Bar w="84%" c={ink} />
      <Bar w="48%" c={accent} />
      <Bar w="70%" c={ink} />
      <Bar w="40%" c="#33445a" />
    </div>
  );
}

export function TemplateGallery({ config, patch }: { config: CardConfig; patch: Patch }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {(Object.keys(TEMPLATES) as TemplateId[]).map((id) => {
        const active = config.template === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => patch({ template: id })}
            className={cx(
              "group relative rounded-xl border bg-ink-900 p-2 text-right transition-all duration-200 active:scale-95",
              active
                ? "border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/25"
                : "border-ink-700 hover:border-ink-600 hover:bg-ink-850",
            )}
          >
            <div className="h-[72px] lg:h-[84px]">
              <TemplateThumb id={id} accent={config.accent} />
            </div>
            <div className={cx("mt-1.5 text-center text-[10.5px] font-bold", active ? "text-brand-300" : "text-mist-400")}>
              {TEMPLATES[id].short}
            </div>
            {active && (
              <span className="absolute top-1.5 left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-ink-950">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ================= پنل محتوا ================= */

export function ContentPanel({ config, patch, notify }: { config: CardConfig; patch: Patch; notify: Notify }) {
  return (
    <div className="space-y-6">
      <PanelSection icon={<LayoutTemplate className="h-4 w-4" />} title="قالب کارت">
        <TemplateGallery config={config} patch={patch} />
        <p className="flex items-start gap-1.5 text-[11.5px] leading-5 text-mist-500">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-goldx-400" />
          {TEMPLATES[config.template].hint}
        </p>
      </PanelSection>

      <PanelSection
        icon={<PenLine className="h-4 w-4" />}
        title="متن کارت"
        trailing={
          <span className="font-code text-[11px] text-mist-500" dir="ltr">
            {faDigits(config.content.length)} / ۵۰۰
          </span>
        }
      >
        <textarea
          value={config.content}
          dir={config.textDir}
          maxLength={500}
          onChange={(e) => patch({ content: e.target.value })}
          rows={7}
          placeholder="متن کارت را اینجا بنویس…"
          className="min-h-[150px] w-full resize-y rounded-xl border border-ink-700 bg-ink-900 p-4 text-base leading-8 text-mist-100 outline-none transition-colors placeholder:text-mist-500/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        <p className="text-[11.5px] leading-5 text-mist-500">
          دور هر عبارت <span className="font-code text-brand-300" dir="ltr">*ستاره*</span> بگذاری، با رنگ شاخص هایلایت
          می‌شود.
        </p>
      </PanelSection>

      <PanelSection icon={<Sparkles className="h-4 w-4" />} title="ایده‌های آماده">
        <div className="flex flex-wrap gap-2">
          {IDEAS[config.template].map((idea, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                patch({ content: idea });
                notify("info", "متن نمونه جایگزین شد");
              }}
              className="max-w-full truncate rounded-full border border-ink-600 bg-ink-800 px-3.5 py-2 text-xs font-semibold text-mist-300 transition-all hover:border-brand-500/50 hover:text-brand-300 active:scale-95"
            >
              {idea.split("\n")[0].slice(0, 34)}…
            </button>
          ))}
        </div>
      </PanelSection>
    </div>
  );
}

/* ================= پنل ظاهر ================= */

export function StylePanel({ config, patch }: { config: CardConfig; patch: Patch }) {
  return (
    <div className="space-y-6">
      <PanelSection
        icon={<Palette className="h-4 w-4" />}
        title="رنگ شاخص"
        trailing={<span className="font-code text-[11px] text-mist-500" dir="ltr">{config.accent}</span>}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          {ACCENT_PRESETS.map((c) => {
            const active = config.accent.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                aria-label={`رنگ ${c}`}
                onClick={() => patch({ accent: c })}
                className={cx(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-90",
                  active ? "scale-110 border-mist-100" : "border-transparent hover:scale-105",
                )}
                style={{ background: c, boxShadow: active ? `0 0 0 4px ${hexA(c, 0.25)}` : undefined }}
              >
                {active && <Check className="h-4.5 w-4.5" strokeWidth={3.2} style={{ color: checkColorOn(c) }} />}
              </button>
            );
          })}
          <label
            className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-ink-600 transition hover:border-brand-500/60"
            style={{
              background: "conic-gradient(from 40deg, #f43f5e, #f59e0b, #a3e635, #10b981, #38bdf8, #a78bfa, #f43f5e)",
            }}
            title="رنگ دلخواه"
          >
            <input
              type="color"
              value={config.accent}
              onChange={(e) => patch({ accent: e.target.value })}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </div>
      </PanelSection>

      <PanelSection icon={<Wallpaper className="h-4 w-4" />} title="پس‌زمینه‌ی قاب">
        <Segmented value={config.bg} onChange={(bg) => patch({ bg })} options={BGS} />
      </PanelSection>

      <PanelSection icon={<Type className="h-4 w-4" />} title="فونت متن">
        <div className="grid grid-cols-1 gap-2">
          {(Object.keys(FONTS) as FontId[]).map((id) => {
            const active = config.font === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => patch({ font: id })}
                className={cx(
                  "flex items-center justify-between rounded-xl border px-4 py-3 text-right transition-all duration-200 active:scale-[0.98]",
                  active ? "border-brand-500 bg-brand-500/5" : "border-ink-700 bg-ink-900 hover:border-ink-600",
                )}
              >
                <span className="text-[15px] text-mist-200" style={{ fontFamily: FONTS[id].stack }}>
                  {FONTS[id].sample}
                </span>
                <span className="flex items-center gap-2">
                  <span className={cx("text-xs font-bold", active ? "text-brand-300" : "text-mist-500")}>
                    {FONTS[id].label}
                  </span>
                  {active && <Check className="h-4 w-4 text-brand-400" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      </PanelSection>

      <div className="grid grid-cols-1 gap-4">
        <PanelSection icon={<Type className="h-4 w-4" />} title="اندازه‌ی متن">
          <Segmented value={config.size} onChange={(size) => patch({ size: size as SizeId })} options={SIZES} />
        </PanelSection>

        <PanelSection icon={<AlignRight className="h-4 w-4" />} title="جهت متن">
          <Segmented
            value={config.textDir}
            onChange={(textDir) => patch({ textDir })}
            options={[
              { value: "rtl", label: <span className="flex items-center gap-1.5"><AlignRight className="h-4 w-4" /> راست‌چین</span> },
              { value: "ltr", label: <span className="flex items-center gap-1.5"><AlignLeft className="h-4 w-4" /> چپ‌چین</span> },
            ]}
          />
        </PanelSection>

        {config.template === "tweet" && (
          <PanelSection icon={<LayoutTemplate className="h-4 w-4" />} title="چینش هدر کارت">
            <Segmented
              value={config.headerAlign}
              onChange={(headerAlign) => patch({ headerAlign })}
              options={[
                { value: "right", label: "راست" },
                { value: "left", label: "چپ" },
              ]}
            />
          </PanelSection>
        )}
      </div>
    </div>
  );
}

/* ================= پنل برند ================= */

const VERIFIED_OPTIONS: { value: VerifiedId; label: string; color?: string }[] = [
  { value: "none", label: "بدون تیک" },
  { value: "brand", label: "هم‌رنگ برند" },
  { value: "blue", label: "آبی" },
  { value: "gold", label: "طلایی" },
];

export function BrandPanel({
  config,
  patch,
  onLogoFile,
  onRemoveLogo,
}: {
  config: CardConfig;
  patch: Patch;
  onLogoFile: (f: File) => void;
  onRemoveLogo: () => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-6">
      <PanelSection icon={<User className="h-4 w-4" />} title="هویت برند">
        <div className="space-y-3">
          <Field label="نام برند / نمایش">
            <TextInput
              value={config.brandName}
              onChange={(e) => patch({ brandName: e.target.value })}
              placeholder="مثلاً: استارتیچ | Starteach"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="آیدی / نام کاربری">
              <TextInput
                dir="ltr"
                mono
                value={config.brandHandle}
                onChange={(e) => patch({ brandHandle: e.target.value })}
                placeholder="@handle"
                className="text-left"
              />
            </Field>
            <Field label="دامنه / فوتر">
              <TextInput
                dir="ltr"
                mono
                value={config.brandDomain}
                onChange={(e) => patch({ brandDomain: e.target.value })}
                placeholder="example.com"
                className="text-left"
              />
            </Field>
          </div>
        </div>
      </PanelSection>

      <PanelSection icon={<Check className="h-4 w-4" />} title="تیک تأیید">
        <div className="grid grid-cols-4 gap-2">
          {VERIFIED_OPTIONS.map((opt) => {
            const active = config.verified === opt.value;
            const color = opt.value === "brand" ? config.accent : opt.color ?? "#8298ae";
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => patch({ verified: opt.value })}
                className={cx(
                  "flex flex-col items-center gap-1.5 rounded-xl border py-3 transition-all duration-200 active:scale-95",
                  active ? "border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20" : "border-ink-700 bg-ink-900 hover:border-ink-600",
                )}
              >
                {opt.value === "none" ? (
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#5d7189" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="m6 6 12 12" strokeLinecap="round" />
                  </svg>
                ) : (
                  <VerifiedSeal color={color} size={22} />
                )}
                <span className={cx("text-[10px] font-bold", active ? "text-brand-300" : "text-mist-400")}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </PanelSection>

      <PanelSection icon={<ImagePlus className="h-4 w-4" />} title="لوگوی برند">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onLogoFile(f);
            e.target.value = "";
          }}
        />
        {config.logoData ? (
          <div className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 p-3">
            <img
              src={config.logoData}
              alt="لوگوی برند"
              className="h-14 w-14 rounded-xl border border-ink-600 object-cover"
            />
            <div className="flex-1">
              <p className="text-xs font-bold text-mist-200">لوگوی تصویر فعال است</p>
              <p className="mt-0.5 text-[11px] text-mist-500">به‌صورت خودکار فشرده و ذخیره شد</p>
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-[11px] font-bold text-mist-300 transition hover:border-brand-500/50 hover:text-brand-300 active:scale-95"
            >
              تغییر
            </button>
            <button
              type="button"
              onClick={onRemoveLogo}
              aria-label="حذف لوگو"
              className="rounded-lg border border-ink-600 bg-ink-800 p-2 text-rosex-400 transition hover:border-rosex-400/50 active:scale-95"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-ink-600 text-mist-400 transition-all hover:border-brand-500/60 hover:text-brand-300 active:scale-[0.99]"
          >
            <ImagePlus className="h-5 w-5 text-brand-400" />
            <span className="text-xs font-bold">انتخاب لوگو (PNG / JPG)</span>
            <span className="text-[10.5px] text-mist-500">به‌جای حروف اختصاری روی کارت نمایش داده می‌شود</span>
          </button>
        )}
      </PanelSection>

      <PanelSection
        icon={<MessageCircle className="h-4 w-4" />}
        title="آمار شبکه‌های اجتماعی"
        trailing={<ToggleSwitch on={config.showStats} onChange={(v) => patch({ showStats: v })} label="نمایش" />}
      >
        <div
          className={cx(
            "grid grid-cols-3 gap-2.5 transition-opacity",
            !config.showStats && "pointer-events-none opacity-40",
          )}
        >
          {(
            [
              ["comments", "کامنت"],
              ["retweets", "بازنشر"],
              ["likes", "لایک"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              <TextInput
                dir="ltr"
                mono
                value={config.stats[key]}
                onChange={(e) => patch({ stats: { ...config.stats, [key]: e.target.value } })}
                className="text-left"
              />
            </Field>
          ))}
        </div>
        <p className="text-[11px] text-mist-500">آمار فقط در قالب «توییت شیشه‌ای» نمایش داده می‌شود.</p>
      </PanelSection>
    </div>
  );
}
