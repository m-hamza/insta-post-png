import type { InputHTMLAttributes, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useI18n } from "../lib/i18n";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ---------- عنوان بخش ---------- */
export function PanelSection({
  icon,
  title,
  trailing,
  children,
}: {
  icon: ReactNode;
  title: string;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[13px] font-extrabold text-mist-300">
          <span className="text-brand-400">{icon}</span>
          {title}
        </h2>
        {trailing}
      </div>
      {children}
    </section>
  );
}

/* ---------- فیلد و ورودی ---------- */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label className="text-xs font-semibold text-mist-400">{label}</label>
        {hint}
      </div>
      {children}
    </div>
  );
}

export function TextInput({
  mono = false,
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }) {
  return (
    <input
      {...rest}
      className={cx(
        "h-11 w-full rounded-xl border border-ink-700 bg-ink-900 px-3.5 text-base text-mist-100 outline-none transition-colors placeholder:text-mist-500/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
        mono && "font-code text-[15px]",
        className,
      )}
    />
  );
}

/* ---------- سوییچ ---------- */
export function ToggleSwitch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  const { rtl } = useI18n();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex items-center gap-2.5 outline-none"
    >
      <span
        className={cx(
          "relative block h-[26px] w-[46px] rounded-full border transition-colors duration-300",
          on ? "border-brand-500 bg-brand-500/90" : "border-ink-600 bg-ink-700",
        )}
      >
        <span
          className="absolute top-[2px] start-[2px] block h-[20px] w-[20px] rounded-full bg-mist-100 shadow transition-transform duration-300"
          style={{ transform: on ? `translateX(${rtl ? -20 : 20}px)` : "translateX(0)" }}
        />
      </span>
      {label && <span className="text-xs font-semibold text-mist-300">{label}</span>}
    </button>
  );
}

/* ---------- کنترل قطعه‌ای با نشانگر لغزان ---------- */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode; title?: string }[];
}) {
  const { rtl } = useI18n();
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const n = options.length;
  return (
      <div
        className="relative grid rounded-xl border border-ink-700 bg-ink-900 p-1"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >      <span
        aria-hidden
        className="absolute top-1 bottom-1 rounded-lg bg-ink-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-transform duration-300 ease-out"
        style={{
          width: `calc((100% - 8px) / ${n})`,
          insetInlineStart: 4,
          transform: `translateX(${(rtl ? -idx : idx) * 100}%)`,
        }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.title}
          onClick={() => onChange(o.value)}
          className={cx(
            "relative z-10 flex h-9 items-center justify-center gap-1.5 rounded-lg text-[13px] font-bold transition-colors duration-200",
            o.value === value ? "text-brand-300" : "text-mist-500 hover:text-mist-300",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- شیت تایید (پایین موبایل / وسط دسکتاپ) ---------- */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="pointer-events-none fixed inset-0 z-[95] flex items-end justify-center lg:items-center">
            <motion.div
              className="pointer-events-auto w-full border-t border-ink-700 bg-ink-850 p-5 shadow-2xl lg:max-w-md lg:rounded-2xl lg:border"
              style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 90, opacity: 0 }}
              transition={{ type: "spring", damping: 27, stiffness: 340 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-xl text-mist-100">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-mist-400 transition hover:bg-ink-700 hover:text-mist-100"
                  aria-label={t("sheet.close")}
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------- توست ---------- */
export interface ToastItem {
  id: number;
  kind: "success" | "error" | "info";
  key: string;
}

export function Toasts({ items }: { items: ToastItem[] }) {
  const { t } = useI18n();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-[110] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {items.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: "spring", damping: 24, stiffness: 380 }}
            className="flex max-w-full items-center gap-2.5 rounded-xl border border-ink-600 bg-ink-800/95 px-4 py-2.5 text-[13px] font-semibold text-mist-100 shadow-xl backdrop-blur"
          >
            {toast.kind === "success" && <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-brand-400" />}
            {toast.kind === "error" && <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rosex-400" />}
            {toast.kind === "info" && <Info className="h-4.5 w-4.5 shrink-0 text-skyx-400" />}
            <span className="truncate">{t(toast.key)}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
