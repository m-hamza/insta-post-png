import type { CSSProperties } from "react";
import type { CardConfig } from "../lib/config";
import { FONTS, RATIOS, SIZE_MAP } from "../lib/config";
import { hexA, initialsOf, splitProblemSolution } from "../lib/utils";

/* ================= ابزارهای داخلی ================= */

/** *کلمه* → هایلایت رنگی */
export function Highlight({
  text,
  accent,
  weight = 800,
  glow = false,
}: {
  text: string;
  accent: string;
  weight?: number;
  glow?: boolean;
}) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.length > 2 && p.startsWith("*") && p.endsWith("*") ? (
          <span
            key={i}
            style={{
              color: accent,
              fontWeight: weight,
              ...(glow ? { textShadow: `0 0 38px ${hexA(accent, 0.5)}` } : {}),
            }}
          >
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

/** مُهر تأیید (سبک توییتر) */
export function VerifiedSeal({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.491 4.491 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      />
    </svg>
  );
}

function sealColor(config: CardConfig): string | null {
  switch (config.verified) {
    case "brand":
      return config.accent;
    case "blue":
      return "#3d9df2";
    case "gold":
      return "#f0b429";
    default:
      return null;
  }
}

function Badge({ config, size }: { config: CardConfig; size: number }) {
  const c = sealColor(config);
  if (!c) return null;
  return (
    <span style={{ display: "inline-flex", flexShrink: 0, transform: "translateY(2px)" }}>
      <VerifiedSeal color={c} size={size} />
    </span>
  );
}

/** آواتار با حلقه‌ی گرادیانی — لوگوی آپلودی یا حروف اختصاری */
export function CanvasAvatar({
  config,
  size,
  rounded = false,
}: {
  config: CardConfig;
  size: number;
  rounded?: boolean;
}) {
  const ring = size * 0.055;
  const radius = rounded ? size / 2 + ring : size * 0.3;
  return (
    <div
      style={{
        width: size + ring * 2,
        height: size + ring * 2,
        padding: ring,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${config.accent}, ${hexA(config.accent, 0.35)})`,
        boxShadow: `0 12px 34px -10px ${hexA(config.accent, 0.55)}`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: Math.max(0, radius - ring),
          background: "#0d1420",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {config.logoData ? (
          <img
            src={config.logoData}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <span
            style={{
              fontFamily: "'Lalezar', 'Vazirmatn', sans-serif",
              fontSize: size * 0.44,
              color: config.accent,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {initialsOf(config.brandName)}
          </span>
        )}
      </div>
    </div>
  );
}

/* ================= آیکون‌های آمار ================= */

const stroke = { fill: "none", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function StatGlyph({ kind, color, size }: { kind: "comment" | "repeat" | "heart"; color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...stroke} aria-hidden>
      {kind === "comment" && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
      {kind === "repeat" && (
        <>
          <path d="m17 2 4 4-4 4" />
          <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
          <path d="m7 22-4-4 4-4" />
          <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </>
      )}
      {kind === "heart" && (
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      )}
    </svg>
  );
}

/* ================= قاب و پس‌زمینه ================= */

function FrameLayers({ config }: { config: CardConfig }) {
  const acc = config.accent;
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(165deg, #121b28 0%, #0a0f16 46%, #0c1219 100%)",
        }}
      />
      {(config.bg === "glow" || config.bg === "grid") && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 92% 54% at 50% 16%, ${hexA(acc, 0.2)} , transparent 70%), radial-gradient(ellipse 60% 40% at 88% 92%, ${hexA(acc, 0.09)}, transparent 70%)`,
          }}
        />
      )}
      {config.bg === "grid" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.032) 0 2px, transparent 2px 78px), repeating-linear-gradient(90deg, rgba(255,255,255,0.032) 0 2px, transparent 2px 78px)",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.52) 100%)",
        }}
      />
    </>
  );
}

/* ================= قالب: توییت شیشه‌ای ================= */

function TweetCard({ config, frameW, frameH }: { config: CardConfig; frameW: number; frameH: number }) {
  const acc = config.accent;
  const wide = frameW > frameH;
  const cardW = wide ? Math.min(frameW - 260, 1360) : Math.min(frameW - 150, 950);
  const bodySize = SIZE_MAP.tweet[config.size];
  const hasContent = config.content.trim().length > 0;

  return (
    <div
      style={{
        width: cardW,
        background: "linear-gradient(155deg, rgba(25,36,51,0.97), rgba(12,19,29,0.96))",
        border: "2px solid rgba(255,255,255,0.1)",
        borderRadius: 56,
        boxShadow: `0 60px 130px -45px ${hexA(acc, 0.4)}, 0 30px 70px -35px rgba(0,0,0,0.85)`,
        padding: wide ? "64px 76px" : "66px 64px",
      }}
    >
      {/* هدر */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: config.headerAlign === "left" ? "row-reverse" : "row",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <CanvasAvatar config={config} size={wide ? 116 : 104} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span
                style={{
                  fontFamily: "'Vazirmatn', sans-serif",
                  fontWeight: 700,
                  fontSize: wide ? 50 : 44,
                  color: "#f1f6fa",
                  lineHeight: 1.3,
                }}
              >
                {config.brandName || "نام برند"}
              </span>
              <Badge config={config} size={wide ? 44 : 40} />
            </div>
            <div
              dir="ltr"
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: wide ? 32 : 29,
                color: "#8198ad",
                marginTop: 6,
                textAlign: config.headerAlign === "left" ? "left" : "right",
                direction: "ltr",
              }}
            >
              {config.brandHandle || "@handle"}
            </div>
          </div>
        </div>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 26,
            background: hexA(acc, 0.12),
            border: `2px solid ${hexA(acc, 0.28)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width={44} height={44} viewBox="0 0 24 24" fill={acc} aria-hidden>
            <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
          </svg>
        </div>
      </div>

      {/* بدنه */}
      <div
        style={{
          margin: "56px 0 48px",
          fontSize: hasContent ? bodySize : bodySize * 0.72,
          lineHeight: 1.95,
          fontWeight: 500,
          color: hasContent ? "#edf3f9" : "#55677c",
          whiteSpace: "pre-line",
          fontFamily: FONTS[config.font].stack,
          wordBreak: "break-word",
        }}
      >
        {hasContent ? (
          <Highlight text={config.content} accent={acc} />
        ) : (
          <span>اینجا متن کارت نوشته می‌شود…</span>
        )}
      </div>

      {/* فوتر */}
      <div
        style={{
          borderTop: "2px solid rgba(255,255,255,0.08)",
          paddingTop: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: config.showStats ? "space-between" : "flex-end",
          gap: 24,
        }}
      >
        {config.showStats && (
          <div dir="ltr" style={{ display: "flex", gap: 48, fontFamily: "'Fira Code', monospace" }}>
            {(
              [
                ["comment", config.stats.comments, "#8198ad"],
                ["repeat", config.stats.retweets, "#8198ad"],
                ["heart", config.stats.likes, "#f2788f"],
              ] as const
            ).map(([kind, value, color]) => (
              <span key={kind} style={{ display: "inline-flex", alignItems: "center", gap: 15 }}>
                <StatGlyph kind={kind} color={color} size={35} />
                <span style={{ fontSize: 32, color: "#c6d4e2", fontWeight: 600 }}>{value}</span>
              </span>
            ))}
          </div>
        )}
        <span
          dir="ltr"
          style={{ fontFamily: "'Fira Code', monospace", fontSize: 29, color: "#64748b", whiteSpace: "nowrap" }}
        >
          {config.brandDomain || "example.com"}
        </span>
      </div>
    </div>
  );
}

/* ================= قالب: قلاب ریلز ================= */

function HookCard({ config, frameW, frameH }: { config: CardConfig; frameW: number; frameH: number }) {
  const acc = config.accent;
  const wide = frameW > frameH;
  const size = SIZE_MAP.hook[config.size];
  const hasContent = config.content.trim().length > 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: wide ? "84px 130px" : "96px 84px",
      }}
    >
      {/* تزئینات */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: wide ? -120 : -50,
          insetInlineEnd: -30,
          fontFamily: "'Lalezar', sans-serif",
          fontSize: wide ? 520 : 620,
          lineHeight: 1,
          color: hexA(acc, 0.15),
          userSelect: "none",
        }}
      >
        «
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -330,
          insetInlineStart: -250,
          width: 780,
          height: 780,
          borderRadius: "50%",
          border: `3px solid ${hexA(acc, 0.18)}`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "13%",
          insetInlineStart: "-12%",
          width: "124%",
          height: 300,
          background: `linear-gradient(90deg, transparent, ${hexA(acc, 0.09)}, transparent)`,
          transform: "rotate(-13deg)",
        }}
      />

      {/* برند بالا */}
      <div
        style={{
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: 22,
          background: "rgba(9,14,21,0.6)",
          border: "2px solid rgba(255,255,255,0.1)",
          borderRadius: 999,
          padding: "14px 40px 14px 16px",
        }}
      >
        <CanvasAvatar config={config} size={78} rounded />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'Vazirmatn', sans-serif", fontWeight: 700, fontSize: 37, color: "#f1f6fa" }}>
              {config.brandName || "نام برند"}
            </span>
            <Badge config={config} size={34} />
          </div>
          <div dir="ltr" style={{ fontFamily: "'Fira Code', monospace", fontSize: 26, color: "#8198ad", textAlign: "right" }}>
            {config.brandHandle || "@handle"}
          </div>
        </div>
      </div>

      {/* تیتر وسط */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: wide ? "30px 40px" : "44px 8px",
        }}
      >
        <div
          style={{
            fontFamily: FONTS[config.font === "fira" ? "fira" : "lalezar"].stack,
            fontSize: hasContent ? size : size * 0.62,
            lineHeight: 1.66,
            color: hasContent ? "#f5f9fc" : "#55677c",
            whiteSpace: "pre-line",
            wordBreak: "break-word",
            maxWidth: "100%",
          }}
        >
          {hasContent ? (
            <Highlight text={config.content} accent={acc} weight={400} glow />
          ) : (
            <span>تیتر جنجالی ویدیو را اینجا بنویس…</span>
          )}
        </div>
      </div>

      {/* پایین */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <span
          dir="ltr"
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 29,
            color: "#9fb2c4",
            background: "rgba(255,255,255,0.05)",
            border: "2px solid rgba(255,255,255,0.1)",
            borderRadius: 999,
            padding: "15px 34px",
            whiteSpace: "nowrap",
          }}
        >
          {config.brandDomain || "example.com"}
        </span>
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: acc,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 18px 44px -12px ${hexA(acc, 0.65)}`,
            flexShrink: 0,
          }}
        >
          <svg width={40} height={40} viewBox="0 0 24 24" fill="#0a0f16" aria-hidden>
            <path d="M7 4.5v15l13-7.5z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ================= قالب: مشکل / راهکار ================= */

function SolutionPanel({
  config,
  tint,
  label,
  kind,
  text,
  size,
  horizontal,
}: {
  config: CardConfig;
  tint: string;
  label: string;
  kind: "x" | "check";
  text: string;
  size: number;
  horizontal: boolean;
}) {
  const has = text.trim().length > 0;
  return (
    <div
      style={{
        flex: horizontal ? 1 : undefined,
        width: horizontal ? "auto" : "100%",
        background: hexA(tint, 0.09),
        border: `2px solid ${hexA(tint, 0.4)}`,
        borderRadius: 44,
        padding: "44px 52px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 26 }}>
        <span
          style={{
            width: 66,
            height: 66,
            borderRadius: "50%",
            background: hexA(tint, 0.16),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width={34} height={34} viewBox="0 0 24 24" stroke={tint} {...stroke} aria-hidden>
            {kind === "x" ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <path d="M20 6 9 17l-5-5" />
            )}
          </svg>
        </span>
        <span style={{ fontFamily: "'Vazirmatn', sans-serif", fontWeight: 800, fontSize: 39, color: tint }}>
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: has ? size : size * 0.78,
          lineHeight: 1.9,
          color: has ? "#e9f0f6" : "#55677c",
          whiteSpace: "pre-line",
          wordBreak: "break-word",
          fontFamily: FONTS[config.font].stack,
          fontWeight: 500,
        }}
      >
        {has ? <Highlight text={text} accent={config.accent} /> : <span>متن این بخش خالی است…</span>}
      </div>
    </div>
  );
}

function ProblemCard({ config, frameW, frameH }: { config: CardConfig; frameW: number; frameH: number }) {
  const acc = config.accent;
  // در قاب مربعی و افقی، پنل‌ها کنار هم می‌ایستند تا در ارتفاع جا شوند
  const wide = frameW >= frameH;
  const size = SIZE_MAP.problem[config.size];
  const { problem, solution } = splitProblemSolution(config.content);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
      }}
    >
      {/* برند */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, width: "100%", maxWidth: wide ? 1500 : 920 }}>
        <CanvasAvatar config={config} size={86} rounded />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'Vazirmatn', sans-serif", fontWeight: 700, fontSize: 41, color: "#f1f6fa" }}>
              {config.brandName || "نام برند"}
            </span>
            <Badge config={config} size={36} />
          </div>
          <div dir="ltr" style={{ fontFamily: "'Fira Code', monospace", fontSize: 27, color: "#8198ad", textAlign: "right" }}>
            {config.brandHandle || "@handle"}
          </div>
        </div>
      </div>

      {/* پنل‌ها */}
      <div
        style={{
          display: "flex",
          flexDirection: wide ? "row" : "column",
          alignItems: "stretch",
          gap: 26,
          width: "100%",
          maxWidth: wide ? 1600 : 920,
        }}
      >
        <SolutionPanel
          config={config}
          tint="#f2788f"
          label="مشکل"
          kind="x"
          text={problem}
          size={size}
          horizontal={wide}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span
            style={{
              width: 94,
              height: 94,
              borderRadius: "50%",
              background: "#101722",
              border: "2px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: wide ? "rotate(90deg)" : undefined,
              boxShadow: `0 14px 36px -14px ${hexA(acc, 0.5)}`,
              flexShrink: 0,
            }}
          >
            <svg width={44} height={44} viewBox="0 0 24 24" stroke={acc} {...stroke} aria-hidden>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>
        <SolutionPanel
          config={config}
          tint={acc}
          label="راهکار"
          kind="check"
          text={solution}
          size={size}
          horizontal={wide}
        />
      </div>

      {/* دامنه */}
      <span dir="ltr" style={{ fontFamily: "'Fira Code', monospace", fontSize: 29, color: "#64748b" }}>
        {config.brandDomain || "example.com"}
      </span>
    </div>
  );
}

/* ================= قالب: نکته‌ی کد ================= */

function CodeCard({ config, frameW, frameH }: { config: CardConfig; frameW: number; frameH: number }) {
  const acc = config.accent;
  const wide = frameW > frameH;
  const size = SIZE_MAP.code[config.size];
  const termW = Math.min(frameW - (wide ? 260 : 150), wide ? 1520 : 980);
  const lines = config.content.length ? config.content.split("\n") : [];
  const file = `${(config.brandDomain || "starteach").replace(/^https?:\/\//, "").replace(/\/$/, "")}.tsx`;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 36,
      }}
    >
      {/* برچسب */}
      <span
        dir="ltr"
        style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 29,
          color: acc,
          background: hexA(acc, 0.1),
          border: `2px solid ${hexA(acc, 0.35)}`,
          borderRadius: 999,
          padding: "12px 36px",
        }}
      >
        {"// quick tip"}
      </span>

      {/* ترمینال */}
      <div
        style={{
          width: termW,
          background: "#0a0f1c",
          border: "2px solid rgba(255,255,255,0.1)",
          borderRadius: 40,
          overflow: "hidden",
          boxShadow: `0 50px 110px -40px ${hexA(acc, 0.3)}, 0 26px 60px -30px rgba(0,0,0,0.85)`,
        }}
      >
        <div
          dir="ltr"
          style={{
            height: 92,
            borderBottom: "2px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 42px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: 17 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <span key={c} style={{ width: 26, height: 26, borderRadius: "50%", background: c, display: "block" }} />
            ))}
          </div>
          <span
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "'Fira Code', monospace",
              fontSize: 28,
              color: "#64748b",
            }}
          >
            {file}
          </span>
        </div>

        <div
          dir="ltr"
          style={{
            padding: "46px 52px",
            fontFamily: "'Fira Code', 'Vazirmatn', monospace",
            fontSize: size,
            lineHeight: 2.05,
            textAlign: "left",
          }}
        >
          {lines.length === 0 ? (
            <div style={{ color: "#55677c", fontSize: size * 0.85 }}>{"// کد یا نکته را اینجا بنویس…"}</div>
          ) : (
            lines.map((line, i) => {
              const isComment = line.trim().startsWith("//");
              return (
                <div key={i} style={{ display: "flex", whiteSpace: "pre" }}>
                  <span
                    style={{
                      width: 66,
                      flexShrink: 0,
                      textAlign: "right",
                      paddingRight: 30,
                      color: "#33445a",
                      userSelect: "none",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ flex: 1, color: isComment ? "#64748b" : "#dbe6f0", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {isComment ? line : <Highlight text={line.length ? line : " "} accent={acc} weight={600} />}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* امضا */}
      <div dir="ltr" style={{ width: termW, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <CanvasAvatar config={config} size={62} rounded />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Vazirmatn', sans-serif", fontWeight: 700, fontSize: 31, color: "#f1f6fa" }}>
              {config.brandName || "نام برند"}
            </span>
            <Badge config={config} size={28} />
          </div>
        </div>
        <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 28, color: "#64748b" }}>
          {config.brandDomain || "example.com"}
        </span>
      </div>
    </div>
  );
}

/* ================= نود اصلی خروجی ================= */

export default function CardCanvas({ config }: { config: CardConfig }) {
  const { w, h } = RATIOS[config.ratio];
  const wide = w > h;

  const rootStyle: CSSProperties = {
    width: w,
    height: h,
    position: "relative",
    overflow: "hidden",
    background: "#0a0f16",
    color: "#eaf1f7",
    direction: config.textDir,
  };

  const innerPad: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: config.template === "hook" || config.template === "problem" ? "stretch" : "center",
    justifyContent: "center",
    padding: wide ? "90px 130px" : config.ratio === "1:1" ? "78px 80px" : "88px 82px",
  };

  return (
    <div style={rootStyle}>
      <FrameLayers config={config} />
      <div style={innerPad}>
        {config.template === "tweet" && <TweetCard config={config} frameW={w} frameH={h} />}
        {config.template === "hook" && <HookCard config={config} frameW={w} frameH={h} />}
        {config.template === "problem" && <ProblemCard config={config} frameW={w} frameH={h} />}
        {config.template === "code" && <CodeCard config={config} frameW={w} frameH={h} />}
      </div>
    </div>
  );
}
