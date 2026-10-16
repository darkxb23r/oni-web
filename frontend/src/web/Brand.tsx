import { useEffect, useRef, useState } from "react";

// The animated ONI-RCON mark and wordmark, from the Claude Design "ONI-RCON Header Logo". Recoloured with the Graphite
// tokens (its amber is the accent, its off-white --color-text) and set in the display face; the motion is in web.css.
const WORD = "ONI-RCON";
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const pick = (pool: string) => pool[Math.floor(Math.random() * pool.length)];

/** The seal: a dashed dial around the half-lit ONI triangle. ponytail: one fixed clip id, as the header and the
 *  sign-in card never render together. */
export function Mark({ size = 34 }: { size?: number }) {
  return <svg className="oni-mark" width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <defs><clipPath id="oni-tri"><polygon points="32,9 53,46 11,46" /></clipPath></defs>
    <circle className="line draw" cx="32" cy="32" r="30" strokeWidth="1.6" pathLength="100" strokeDasharray="100" />
    <g className="lock"><circle className="line" cx="32" cy="32" r="33.6" strokeOpacity=".55" strokeWidth="1" strokeDasharray="9 43.6" strokeDashoffset="-2" transform="rotate(-45 32 32)" /></g>
    <g className="dial"><circle className="line" cx="32" cy="32" r="24.5" strokeOpacity=".6" strokeWidth="4.5" strokeDasharray="0.7 1.35" /></g>
    <g className="dial back"><circle className="sig" cx="32" cy="32" r="27.6" strokeWidth="1.2" strokeDasharray="6 150" strokeLinecap="round" /></g>
    <g className="show">
      <polygon className="ink line" points="32,9 53,46 11,46" strokeWidth="1.6" />
      <polygon className="solid flip" points="32,9 53,46 32,46" />
      <g clipPath="url(#oni-tri)">
        <circle className="sig ping" cx="32" cy="35" r="7.5" strokeWidth=".8" />
        <rect className="dot scan" x="8" y="9" width="48" height="1.4" />
      </g>
      <circle className="ink line" cx="32" cy="35" r="7.5" strokeWidth="1.4" />
      {[[32, 9], [53, 46], [11, 46]].map(([x, y], i) =>
        <circle key={i} className="dot vtx" cx={x} cy={y} r="1.5" style={{ animationDelay: `${2 + i * 1.2}s` }} />)}
      <circle className="dot pulse" cx="32" cy="35" r="2.6" />
    </g>
  </svg>;
}

/** The mark and the wordmark. The word decodes in on mount and on hover, and one letter glitches every few seconds. */
export function Brand() {
  const [text, setText] = useState(WORD);
  const run = useRef<number | undefined>(undefined); // the decode, while it plays
  const scramble = () => {
    clearInterval(run.current);
    if (still()) return;
    let f = 0;
    run.current = window.setInterval(() => {
      const lock = Math.floor(++f / 2);
      setText([...WORD].map((c, i) => c === "-" || i < lock ? c : pick("01ABCDEFGHKLMNPRSTXZ#/<>")).join(""));
      if (lock >= WORD.length) { clearInterval(run.current); run.current = undefined; }
    }, 45);
  };
  useEffect(() => {
    scramble();
    let glitch: number | undefined;
    const idle = setInterval(() => {
      if (still() || run.current) return;
      const at = [0, 1, 2, 4, 5, 6, 7][Math.floor(Math.random() * 7)];
      let n = 0;
      clearInterval(glitch);
      glitch = window.setInterval(() => {
        const a = [...WORD];
        if (++n < 5) a[at] = pick("01#/<>X");
        else clearInterval(glitch);
        setText(a.join(""));
      }, 55);
    }, 5200);
    return () => { clearInterval(idle); clearInterval(glitch); clearInterval(run.current); };
  }, []);
  // The real word holds the width (and is what a screen reader gets), so the scramble never shifts what follows.
  return <><Mark /><b className="oni-word" onMouseEnter={scramble}>{WORD}<span aria-hidden="true">{text}</span></b></>;
}
