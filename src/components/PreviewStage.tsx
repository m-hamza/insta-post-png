import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import type { RatioId } from "../lib/config";
import { RATIOS } from "../lib/config";
import { faDigits } from "../lib/utils";
import { useI18n } from "../lib/i18n";

/**
 * پیش‌نمایش زنده: نود کارت در ابعاد بومی (مثلاً 1080x1920) رندر می‌شود
 * و فقط برای نمایش با CSS scale در قاب جا می‌گیرد —
 * همان نود برای خروجی PNG نهایی استفاده می‌شود.
 */
export default function PreviewStage({
  ratioId,
  children,
  nodeRef,
}: {
  ratioId: RatioId;
  children: ReactNode;
  nodeRef?: RefObject<HTMLDivElement>;
}) {
  const { lang } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.2);
  const { w, h } = RATIOS[ratioId];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const availH = Math.max(320, window.innerHeight - 260);
      const maxH = Math.min(el.clientHeight || availH, availH);
      const s = Math.min((el.clientWidth - 8) / w, maxH / h);
      setScale(Math.max(0.05, Math.min(s, 0.75)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [w, h]);

  const num = (v: number) => (lang === "fa" ? faDigits(v) : String(v));

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-3 flex w-full items-center justify-between text-[11px] text-mist-500">
        <span className="flex items-center gap-1.5 font-semibold text-mist-400">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brand-400" />
          {lang === "fa" ? "پیش‌نمایش زنده" : "Live preview"}
        </span>
        <span className="font-code" dir="ltr">
          {w}×{h}
        </span>
      </div>

      <div
        ref={containerRef}
        className="flex w-full justify-center overflow-hidden rounded-xl border border-ink-800 bg-[#05080c] py-4"
        style={{ height: h * scale + 48 }}
      >
        <div
          ref={nodeRef}
          style={{
            width: w,
            height: h,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            flexShrink: 0,
          }}
        >
          {children}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-mist-500">
        <span className="font-code" dir="ltr">
          {Math.round(scale * 100)}%
        </span>
        <span>·</span>
        <span>{lang === "fa" ? `${num(w)} در ${num(h)} پیکسل — خروجی تمام‌وضوح` : `${w} by ${h} pixels — full-resolution output`}</span>
      </div>
    </div>
  );
}
