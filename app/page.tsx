"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { character, setting } from "@/data/prompts";

function SlotMachine({
  items,
  placeholder,
  running,
  settleSignal,
  durationMs = 1600,
}: {
  items: string[];
  placeholder: string;
  running: boolean;
  settleSignal: number;
  durationMs?: number;
}) {
  const len = items.length;

  const ROW_PX = 32; // Tailwind h-8
  const VISIBLE_ROWS = 3;
  const WINDOW_PX = ROW_PX * VISIBLE_ROWS;
  const centerRowIndex = 1; // middle of 3 rows

  const reelRef = useRef<HTMLDivElement | null>(null);

  // ✅ render-driving value: state
  const [offsetY, setOffsetY] = useState(0);
  // ✅ mutable bookkeeping, never read in JSX
  const offsetRef = useRef(0);

  // Long reel so we can spin multiple loops
  const reelItems = useMemo(() => {
    const repeats = 20;
    const out: string[] = [];
    for (let r = 0; r < repeats; r++) out.push(...items);
    return out;
  }, [items]);

  useEffect(() => {
    if (!running) return;
    if (len === 0) return;

    const reel = reelRef.current;
    if (!reel) return;

    const target = Math.floor(Math.random() * len);
    const extraLoops = 4 + Math.floor(Math.random() * 4); // 4–7 loops
    const finalIndex = extraLoops * len + target;

    const startY = offsetRef.current;
    const endY = -(finalIndex * ROW_PX) + centerRowIndex * ROW_PX;

    // Cancel any running animations
    reel.getAnimations().forEach((a) => a.cancel());

    reel.classList.add("reel-blur");

    const anim = reel.animate(
      [
        { transform: `translateY(${startY}px)`, filter: "blur(8px)" },
        { transform: `translateY(${endY}px)`, filter: "blur(0px)" },
      ],
      {
        duration: durationMs,
        easing: "cubic-bezier(0.12, 0.85, 0.18, 1)",
      },
    );

    anim.onfinish = () => {
      // Snap & commit
      reel.style.transform = `translateY(${endY}px)`;
      reel.style.filter = "blur(0px)";
      reel.classList.remove("reel-blur");

      // tiny “lock-in” pop
      reel.animate(
        [
          { transform: `translateY(${endY}px) scale(1)` },
          { transform: `translateY(${endY}px) scale(1.03)` },
          { transform: `translateY(${endY}px) scale(1)` },
        ],
        { duration: 180, easing: "ease-out" },
      );

      offsetRef.current = endY;
      setOffsetY(endY);
    };

    anim.oncancel = () => {
      reel.classList.remove("reel-blur");
    };
  }, [settleSignal, running, durationMs, len, ROW_PX, centerRowIndex]);

  // ✅ no extra state needed: placeholder is shown until first roll
  const showPlaceholder = !running && settleSignal === 0;
  const hasSpun = settleSignal > 0;

  return (
    <div className="w-full">
      <div
        className="relative mx-auto w-full overflow-hidden"
        style={{ height: WINDOW_PX }}
      >
        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90" />

        {/* Dim top + bottom, highlight center row */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div style={{ height: ROW_PX }} className="bg-black/65" />
          <div
            style={{ height: ROW_PX }}
            className="bg-white/5 shadow-[inset_0_0_24px_rgba(255,255,255,0.14)]"
          />
          <div style={{ height: ROW_PX }} className="bg-black/65" />
        </div>

        <div className="absolute inset-0 flex items-start justify-center">
          {/* ✅ Only render the reel after the first spin */}
          {hasSpun && (
            <div
              ref={reelRef}
              className="will-change-transform"
              style={{ transform: `translateY(${offsetY}px)` }}
            >
              {reelItems.map((text, i) => (
                <div
                  key={`${text}-${i}`}
                  className="reel-row h-8 w-[min(100%,32rem)] select-none truncate text-center text-xl font-semibold tracking-wide text-white"
                >
                  {text}
                </div>
              ))}
            </div>
          )}

          {/* Placeholder (only before first roll) */}
          {showPlaceholder && (
            <div
              className="absolute left-0 right-0 mx-auto z-20 flex items-center justify-center text-xl font-semibold tracking-wide text-white/80"
              style={{ top: ROW_PX, height: ROW_PX }}
            >
              {placeholder}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .reel-row {
          opacity: 0.35;
          filter: saturate(0.55);
          transition:
            opacity 200ms ease,
            filter 200ms ease;
        }
        .reel-blur .reel-row {
          opacity: 0.22;
          filter: blur(6px) saturate(0.35);
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  const [spinning, setSpinning] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  const onGenerate = () => {
    setSpinKey((k) => k + 1);
    setSpinning(true);
    window.setTimeout(() => setSpinning(false), 1600);
  };

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto w-full md:px-[5%]">
        <h1 className="text-center text-3xl font-semibold tracking-tight">
          Your concept for concept art is
        </h1>

        <div className="mt-10 grid grid-cols-1 items-center gap-6 md:grid-cols-3">
          <SlotMachine
            items={character}
            placeholder="Character"
            running={spinning}
            settleSignal={spinKey}
          />

          <div className="text-center text-base text-white/70">
            imagined as a
          </div>

          <SlotMachine
            items={setting}
            placeholder="Setting"
            running={spinning}
            settleSignal={spinKey}
          />
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={onGenerate}
            disabled={spinning}
            className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm transition active:scale-[0.99] disabled:opacity-40"
          >
            {spinning ? "Generating..." : "Generate concept"}
          </button>
        </div>
      </div>
    </main>
  );
}
