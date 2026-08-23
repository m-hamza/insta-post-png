import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { CardConfig } from "../lib/config";
import { RATIOS } from "../lib/config";
import CardCanvas from "./CardCanvas";

/**
 * پیش‌نمایش زنده: نود کارت در ابعاد بومی (مثلاً 1080×1920) رندر می‌شود
 * و فقط با CSS scale داخل قاب جا می‌شود — یعنی خروجی دقیقاً همان چیزی است که می‌بینید.
 */
export default function PreviewStage({
  config,
  stageRef,
  className = "",
}: {
  config: CardConfig;
  stageRef: RefObject<HTMLDivElement>;
  className?: string;
}) {
  const { w, h } = RATIOS[config.ratio];
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.16);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => {
      const s = Math.min(el.clientWidth / w, el.clientHeight / h);
      setScale(Math.max(0.02, s));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h]);

  return (
    <div
      ref={boxRef}
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
    >
      <div
        style={{
          width: Math.round(w * scale),
          height: Math.round(h * scale),
          position: "relative",
          transition: "width 300ms ease, height 300ms ease",
          filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))",
        }}
      >
        <div
          ref={stageRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: w,
            height: h,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <CardCanvas config={config} />
        </div>
      </div>
    </div>
  );
}
