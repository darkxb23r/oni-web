// The frame around the tabs: the masthead with the condition, the alert banner, the key hints along the bottom, and
// the toasts.
import { oni, useV } from "../engine";
import { hms, num } from "../lib/util";

/** The KPI strip: condition, fleet reach, findings, operator and clock. The condition is coloured by class, not by
 *  the hex oni.condition() returns, so it follows the web tokens. */
export function Masthead({ width }: { width: number }) {
  useV((s) => s.mast);
  const [cond] = oni.condition();
  const total = oni.stations.length, online = oni.stations.filter((s) => s.online).length, unseen = oni.unseen;
  const assets = oni.stations.filter((s) => s.online).reduce((a, s) => a + (num(s.data.status?.players) ?? 0), 0);
  return (
    <div className="masthead">
      <span className={`cond ${cond.toLowerCase()}`}><i aria-hidden="true" />Condition {cond}</span>
      <span className="stat"><small>Stations</small><b className={online === 0 ? "bad" : online < total ? "part" : ""}>{online}<span>/{total}</span></b></span>
      <span className="stat opt"><small>Assets</small><b>{assets}</b></span>
      {unseen ? <span className="stat alert" title="Superintendent findings (F8)"><small>Findings</small><b>⚑ {unseen}</b></span> : null}
      <span className="sp" />
      {width >= 1150 ? <span className="classified">TOP SECRET</span> : null}
      <span className="r">
        <span><small>Operator</small><b>{oni.by.toUpperCase()}</b></span>
        <span><b>{hms(new Date())}</b></span>
      </span>
    </div>
  );
}

export function Banner() {
  useV((s) => s.ui);
  const b = oni.banner;
  if (!b) return null;
  return (
    <div className={`banner ${b.warn ? "warn" : ""} ${Date.now() % 2000 < 1000 ? "dim" : ""}`} onClick={() => { oni.banner = null; useV.setState((s) => ({ ui: s.ui + 1 })); }}>
      {b.text}
    </div>
  );
}

const KEYS: Record<string, [string, string][]> = {
  assets: [["t", "Tell"], ["k", "Kick"], ["b", "Ban"], ["m", "Mute"], ["j", "Team"], ["v", "VPN allow"], ["y", "Copy ID"]],
  blacklist: [["n", "New ban"], ["u", "Unban"], ["a", "VPN allow"], ["r", "VPN revoke"]],
  forge: [["i", "Install"], ["l", "Load now"], ["a", "Ack"], ["s", "Sort"], ["w", "Window"], ["n", "More"], ["/", "Search"], ["k", "Key"], ["y", "Copy ID"]],
  intercepts: [["/", "Type"], ["End", "Follow"]],
  console: [["/", "Type"], ["↑↓", "History"]],
  operations: [], health: [],
};

export function Footer() {
  useV((s) => s.ui);
  const keys: [string, string][] = [...KEYS[oni.tab], ["F1–F7", "Tabs"], ["g", "Go to"], ["^B", "Broadcast"], ["^R", "Refresh"], ["x", "Redact"], ["?", "Help"]];
  return (
    <div className="footer">
      {keys.map(([k, v]) => <span key={k + v}><span className="k">{k}</span>{v}</span>)}
      <span className="sp" />
      <span><span className="k">^P</span>Command palette</span>
    </div>
  );
}

export function Toasts() {
  useV((s) => s.toasts);
  return (
    <div className="toasts">
      {oni.toasts.map((t) => (
        <div key={t.id} className={`toast ${t.severity}`} onClick={() => { oni.toasts = oni.toasts.filter((x) => x !== t); useV.setState((s) => ({ toasts: s.toasts + 1 })); }}>
          {t.title ? <div className="t">{t.title}</div> : null}
          <div>{t.text}</div>
        </div>
      ))}
    </div>
  );
}
