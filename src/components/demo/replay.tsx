import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  evidenceActions,
  evidenceMessages,
  evidenceStats,
  type EvidenceActionCard,
  type EvidenceMessage,
} from "./data";

const WINDOW_SIZE = 3;
const MIN_TURN = evidenceMessages[0]?.turn ?? 1;
const MAX_TURN = evidenceStats.turns;

const SPEED_PRESETS = [
  { label: "½×", ms: 1560 },
  { label: "1×",  ms: 780  },
  { label: "2×",  ms: 390  },
  { label: "4×",  ms: 195  },
] as const;

const LANES = evidenceStats.agents.map((agent) => agent.name);
const ACTION_BY_TURN = new Map(evidenceActions.map((item) => [item.turn, item.cards]));

interface AgentStyle extends CSSProperties {
  "--agent"?: string;
}

// ── Theme tokens ──────────────────────────────────────────────────────────────

const DARK = {
  showBgLayers:      true  as boolean,
  wrapperBg:         "bg-[#080908]",
  wrapperBorder:     "border-white/12",
  cardBg:            "bg-black/45",
  cardBorder:        "border-white/12",
  cardDivider:       "border-white/[0.07]",
  panelBg:           "bg-black/50",
  panelBorder:       "border-white/12",
  panelHeaderBg:     "bg-linear-to-r from-[#e8ff9c]/10 to-white/3",
  panelHeaderBorder: "border-white/10",
  fg:                "text-white",
  fgMid:             "text-white/60",
  fgLow:             "text-white/50",
  fgMuted:           "text-white/42",
  fgFaint:           "text-white/40",
  fgDim:             "text-white/35",
  accent:            "#e8ff9c",
  accentText:        "text-[#e8ff9c]",
  accentBorder:      "border-[#e8ff9c]/20",
  chipBorder:        "border-white/12",
  chipBg:            "bg-white/6",
  chipText:          "text-white/70",
  agentFg:           "text-white/55",
  trackRail:         "bg-white/8",
  progressBg:        "bg-white/8",
  playhead:          "bg-white shadow-[0_0_10px_white]",
  btnPrimaryBg:      "bg-[#e8ff9c] hover:bg-white",
  btnPrimaryFg:      "text-[#080908]",
  btnSecondary:      "border border-white/15 bg-white/8 text-white hover:bg-white/12",
  speedActive:       "bg-[#e8ff9c] font-bold text-[#080908]",
  speedInactive:     "border border-white/12 text-white/45 hover:border-white/25 hover:text-white/80",
  scrubberLabel:     "text-white/40",
  needsBg:           "bg-white/5.5",
  needsBorder:       "border-white/12",
  needsFg:           "text-white",
  needsBody:         "text-white/58",
  actionOkBg:        "bg-white/[0.07]",
  actionFg:          "text-white",
  actionTagBorder:   "border-white/12",
  actionTagText:     "text-white/68",
  actionBody:        "text-white/66",
  actionCode:        "text-white/42",
  turnFg:            "text-white/42",
  msgTime:           "text-white/38",
  msgKindBorder:     "border-[#e8ff9c]/20",
  msgKindText:       "text-[#e8ff9c]",
  liveDot:           "bg-[#67ff8f] shadow-[0_0_15px_#67ff8f]",
};

type Tokens = typeof DARK;

const LIGHT: Tokens = {
  showBgLayers:      false,
  wrapperBg:         "bg-[#f0f4ed]",
  wrapperBorder:     "border-black/8",
  cardBg:            "bg-white/85",
  cardBorder:        "border-black/8",
  cardDivider:       "border-black/[0.07]",
  panelBg:           "bg-white/75",
  panelBorder:       "border-black/8",
  panelHeaderBg:     "bg-linear-to-r from-[#437200]/8 to-black/[0.02]",
  panelHeaderBorder: "border-black/6",
  fg:                "text-[#0d110d]",
  fgMid:             "text-[#0d110d]/60",
  fgLow:             "text-[#0d110d]/50",
  fgMuted:           "text-[#0d110d]/42",
  fgFaint:           "text-[#0d110d]/40",
  fgDim:             "text-[#0d110d]/35",
  accent:            "#437200",
  accentText:        "text-[#437200]",
  accentBorder:      "border-[#437200]/25",
  chipBorder:        "border-black/10",
  chipBg:            "bg-black/[0.04]",
  chipText:          "text-[#0d110d]/70",
  agentFg:           "text-[#0d110d]/55",
  trackRail:         "bg-black/8",
  progressBg:        "bg-black/8",
  playhead:          "bg-[#0d110d] shadow-[0_0_8px_rgba(13,17,13,0.35)]",
  btnPrimaryBg:      "bg-[#e8ff9c] hover:bg-[#d0f060]",
  btnPrimaryFg:      "text-[#080908]",
  btnSecondary:      "border border-black/12 bg-black/5 text-[#0d110d] hover:bg-black/8",
  speedActive:       "bg-[#e8ff9c] font-bold text-[#080908]",
  speedInactive:     "border border-black/10 text-[#0d110d]/45 hover:border-black/20 hover:text-[#0d110d]/80",
  scrubberLabel:     "text-[#0d110d]/40",
  needsBg:           "bg-black/[0.03]",
  needsBorder:       "border-black/8",
  needsFg:           "text-[#0d110d]",
  needsBody:         "text-[#0d110d]/58",
  actionOkBg:        "bg-black/[0.04]",
  actionFg:          "text-[#0d110d]",
  actionTagBorder:   "border-black/10",
  actionTagText:     "text-[#0d110d]/68",
  actionBody:        "text-[#0d110d]/66",
  actionCode:        "text-[#0d110d]/42",
  turnFg:            "text-[#0d110d]/42",
  msgTime:           "text-[#0d110d]/38",
  msgKindBorder:     "border-[#437200]/25",
  msgKindText:       "text-[#437200]",
  liveDot:           "bg-[#2d7a0e] shadow-[0_0_10px_rgba(45,122,14,0.5)]",
};

// ── Hook ──────────────────────────────────────────────────────────────────────

function useTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof document === "undefined") return "dark";
    return (document.documentElement.getAttribute("data-theme") as "dark" | "light") ?? "dark";
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute("data-theme") as "dark" | "light";
      setTheme(t ?? "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function agentTone(agent: string) {
  return evidenceStats.agents.find((item) => item.name === agent)?.color ?? "#ffffff";
}

function clampTurn(turn: number) {
  return Math.max(MIN_TURN, Math.min(MAX_TURN, turn));
}

function turnPercent(turn: number) {
  return ((turn - MIN_TURN) / Math.max(1, MAX_TURN - MIN_TURN)) * 100;
}

function visibleWindow<T extends { turn: number }>(items: T[], turn: number, size = WINDOW_SIZE) {
  const visible = items.filter((item) => item.turn <= turn);
  return visible.slice(Math.max(0, visible.length - size));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SummaryPanel({ tk }: { tk: Tokens }) {
  return (
    <div className="grid gap-2 md:grid-cols-[0.9fr_0.9fr_1.25fr]">
      <div className={`rounded-2xl border ${tk.cardBorder} ${tk.cardBg} p-3 backdrop-blur`}>
        <p className={`text-[10px] uppercase tracking-[0.24em] ${tk.accentText}`}>Auto-executed actions</p>
        <p className={`mt-1 text-3xl tracking-[-0.06em] ${tk.fg}`}>{evidenceStats.toolActions}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {evidenceStats.chips.slice(0, 5).map((chip) => (
            <span key={chip.label} className={`break-all rounded-full border ${tk.chipBorder} ${tk.chipBg} px-2 py-1 font-mono text-[10px] ${tk.chipText}`}>
              {chip.label} <b style={{ color: tk.accent }}>{chip.count}</b>
            </span>
          ))}
        </div>
      </div>

      <div className={`rounded-2xl border ${tk.cardBorder} ${tk.cardBg} p-3 backdrop-blur`}>
        <p className={`text-[10px] uppercase tracking-[0.24em] ${tk.accentText}`}>Data Genie feedback</p>
        <p className={`mt-1 text-3xl tracking-[-0.06em] ${tk.fg}`}>{evidenceStats.dataFeedbackTurns}</p>
        <p className={`mt-2 text-xs leading-5 ${tk.fgLow}`}>
          {evidenceStats.failedActions} failed aliases · {evidenceStats.reflexPromotions} reflex promotions · {evidenceStats.verifiedArtifacts} verified artifacts.
        </p>
      </div>

      <div className={`rounded-2xl border ${tk.cardBorder} ${tk.cardBg} p-3 backdrop-blur`}>
        <p className={`text-[10px] uppercase tracking-[0.24em] ${tk.accentText}`}>Genies</p>
        <div className="mt-2 space-y-1.5">
          {evidenceStats.agents.map((agent) => (
            <div key={agent.name} className={`grid grid-cols-[3.2rem_2.1rem_1fr] items-center gap-2 border-t ${tk.cardDivider} pt-1.5 text-[11px]`}>
              <b style={{ color: agent.color }}>{agent.name}</b>
              <strong className={tk.fg}>{agent.turns}</strong>
              <span className={`min-w-0 ${tk.fgMuted}`}>{agent.summary}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NeedsPanel({ tk }: { tk: Tokens }) {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {evidenceStats.needs.map((need) => (
        <article key={need.id} className={`rounded-2xl border ${tk.needsBorder} ${tk.needsBg} p-3 backdrop-blur`}>
          <div className="flex items-start justify-between gap-2">
            <b className={`font-mono text-[11px] ${tk.needsFg}`}>{need.id}</b>
            <span className={`rounded-full border ${tk.accentBorder} px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${tk.accentText}`}>{need.priority}</span>
          </div>
          <p className={`mt-2 line-clamp-3 text-xs leading-5 ${tk.needsBody}`}>{need.proposal}</p>
        </article>
      ))}
    </div>
  );
}

function Timeline({ turn, setTurn, tk }: { turn: number; setTurn: (turn: number) => void; tk: Tokens }) {
  const dotsByLane = useMemo(() => {
    const sampled = evidenceMessages.filter(
      (m) => m.turn === MIN_TURN || m.turn === MAX_TURN || m.turn % 4 === 0
    );
    return LANES.map((lane) =>
      sampled
        .filter((m) => m.agent === lane)
        .map((m) => ({ turn: m.turn, color: m.color }))
    );
  }, []);

  const handleTrackClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    setTurn(Math.round(MIN_TURN + pct * (MAX_TURN - MIN_TURN)));
  };

  return (
    <div className={`rounded-2xl border ${tk.cardBorder} ${tk.cardBg} p-4 backdrop-blur`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className={`text-[10px] uppercase tracking-[0.24em] ${tk.accentText}`}>Timeline</p>
        <span className={`font-mono text-[10px] ${tk.fgFaint}`}>
          turn <span className={tk.fgMid}>{turn}</span> / {MAX_TURN}
        </span>
      </div>

      <div className="flex gap-3">
        <div className="flex shrink-0 flex-col justify-around py-px" style={{ width: 44 }}>
          {LANES.map((lane, i) => (
            <div key={lane} className="flex items-center gap-1.5">
              <span className="size-1.5 shrink-0 rounded-full" style={{ background: evidenceStats.agents[i]?.color }} />
              <span className={`font-mono text-[10px] ${tk.agentFg}`}>{lane}</span>
            </div>
          ))}
        </div>

        <div className="relative flex flex-1 cursor-pointer flex-col gap-2" onClick={handleTrackClick}>
          <div
            className={`pointer-events-none absolute inset-y-0 z-10 w-px ${tk.playhead} transition-[left] duration-300`}
            style={{ left: `${turnPercent(turn)}%` }}
          />

          {LANES.map((lane, laneIndex) => (
            <div key={lane} className="relative flex h-5 items-center">
              <div className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 ${tk.trackRail}`} />
              <div
                className="absolute left-0 top-1/2 h-px -translate-y-1/2 transition-[width] duration-300"
                style={{
                  width: `${turnPercent(turn)}%`,
                  background: evidenceStats.agents[laneIndex]?.color,
                  opacity: 0.35,
                }}
              />
              {dotsByLane[laneIndex]?.map((dot) => (
                <button
                  key={dot.turn}
                  aria-label={`Jump to turn ${dot.turn}`}
                  title={`Turn ${dot.turn} · ${lane}`}
                  onClick={(e) => { e.stopPropagation(); setTurn(dot.turn); }}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 hover:scale-150"
                  style={{
                    left: `${turnPercent(dot.turn)}%`,
                    width: dot.turn === turn ? 9 : 5,
                    height: dot.turn === turn ? 9 : 5,
                    background: dot.color,
                    opacity: dot.turn <= turn ? 1 : 0.2,
                    boxShadow: dot.turn <= turn ? `0 0 7px ${dot.color}` : "none",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-3 overflow-hidden rounded-full ${tk.progressBg}`} style={{ height: 2 }}>
        <div
          className="h-full rounded-full bg-[#e8ff9c] transition-[width] duration-300"
          style={{ width: `${turnPercent(turn)}%` }}
        />
      </div>
    </div>
  );
}

function MessageCard({ message, tk }: { message: EvidenceMessage; tk: Tokens }) {
  return (
    <article className="flex min-w-0 items-start gap-2.5" style={{ "--agent": message.color } as AgentStyle}>
      <div
        className="grid size-8 shrink-0 place-items-center rounded-xl text-sm font-black text-[#080908] shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_10px_28px_rgba(0,0,0,0.3)]"
        style={{ background: message.color }}
      >
        {message.avatar}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <b className="text-xs" style={{ color: message.color }}>{message.agent}</b>
          <span className={`rounded-full border ${tk.msgKindBorder} px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] ${tk.msgKindText}`}>{message.kind}</span>
          <time className={`font-mono text-[9px] ${tk.msgTime}`}>{message.time}</time>
        </div>
        <p
          className="line-clamp-5 rounded-[0.45rem_1.1rem_1.1rem_1.1rem] border bg-[#efeee9] p-3 text-xs leading-5 text-[#111] shadow-lg shadow-black/20 md:text-[13px]"
          style={{ borderColor: message.color, boxShadow: `inset 4px 0 0 ${message.color}` }}
        >
          {message.body}
        </p>
      </div>
    </article>
  );
}

function ActionCard({ card, tk }: { card: EvidenceActionCard; tk: Tokens }) {
  const color = agentTone(card.agent);
  return (
    <div
      className={`rounded-2xl border p-3 shadow-[inset_3px_0_0_var(--agent)] ${card.ok ? tk.actionOkBg : "border-[#ff6b5f]/45 bg-[#ff6b5f]/10"}`}
      style={{ "--agent": color, borderColor: card.ok ? color : "rgba(255,107,95,.45)" } as AgentStyle}
    >
      <div className="flex items-start justify-between gap-3">
        <b className={`font-mono text-xs ${tk.actionFg}`}>{card.name || "action"}</b>
        <span className={`text-right text-[10px] ${tk.accentText}`}>{card.status || (card.ok ? "ok" : "failed")}</span>
      </div>
      <div className="my-1.5 flex flex-wrap gap-1.5">
        {[card.agent, card.machine, card.safety].filter(Boolean).map((item) => (
          <span key={item} className={`rounded-full border ${tk.actionTagBorder} px-1.5 py-0.5 text-[10px] ${tk.actionTagText}`}>{item}</span>
        ))}
      </div>
      {card.reason ? <p className={`line-clamp-2 text-xs leading-5 ${tk.actionBody}`}>{card.reason}</p> : null}
      {card.args ? <code className={`mt-1 block truncate font-mono text-[10px] ${tk.actionCode}`}>{card.args}</code> : null}
    </div>
  );
}

function ActionTurn({ turn, cards, tk }: { turn: number; cards: EvidenceActionCard[]; tk: Tokens }) {
  return (
    <section className="grid gap-2">
      <p className={`font-mono text-[10px] ${tk.turnFg}`}>turn {turn}</p>
      {cards.slice(0, 3).map((card, index) => (
        <ActionCard key={`${turn}-${card.name}-${index}`} card={card} tk={tk} />
      ))}
    </section>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────

export function Replay() {
  const [turn, setTurnState] = useState(2);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEED_PRESETS)[number]["ms"]>(SPEED_PRESETS[1].ms);

  const theme = useTheme();
  const tk = theme === "light" ? LIGHT : DARK;

  const visibleMessages = useMemo(() => visibleWindow(evidenceMessages, turn), [turn]);
  const visibleActions  = useMemo(() => visibleWindow(evidenceActions,  turn), [turn]);

  const setTurn = (nextTurn: number) => setTurnState(clampTurn(nextTurn));

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setTurnState((current) => (current >= MAX_TURN ? MIN_TURN : current + 1));
    }, speed);
    return () => window.clearInterval(timer);
  }, [playing, speed]);

  return (
    <div className={`relative overflow-hidden rounded-4xl border ${tk.wrapperBorder} ${tk.wrapperBg} p-3 shadow-2xl shadow-black/40 md:p-4`}>
      {tk.showBgLayers && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(232,255,156,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(232,255,156,.055)_1px,transparent_1px)] bg-size-[86px_86px] opacity-55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(232,255,156,.16),transparent_34%),radial-gradient(circle_at_88%_28%,rgba(87,190,255,.12),transparent_30%)]" />
        </>
      )}

      <div className="relative grid gap-3">
        <header className="flex flex-col justify-between gap-2 px-1 sm:flex-row sm:items-end">
          <h3 className={`text-3xl font-normal tracking-[-0.065em] ${tk.fg} md:text-3xl`}>Summary</h3>
          <p className={`font-mono text-[11px] leading-5 ${tk.fgLow} sm:text-right`}>
            {evidenceStats.sessionId}<br />
            {evidenceStats.turns} turns · {evidenceStats.requestedActions} requested actions
          </p>
        </header>

        <SummaryPanel tk={tk} />
        <NeedsPanel tk={tk} />
        <Timeline turn={turn} setTurn={setTurn} tk={tk} />

        <div className="grid gap-3 lg:grid-cols-2">
          <section className={`flex h-[420px] flex-col overflow-hidden rounded-3xl border ${tk.panelBorder} ${tk.panelBg} backdrop-blur`}>
            <div className={`flex shrink-0 items-center justify-between border-b ${tk.panelHeaderBorder} ${tk.panelHeaderBg} px-4 py-3`}>
              <b className={`text-sm ${tk.fg}`}>Rolling chat</b>
              <span className={`font-mono text-[11px] ${tk.fgMid}`}>
                <span className={`mr-1.5 inline-block size-2 rounded-full ${tk.liveDot}`} />
                turn {turn}
              </span>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto p-3">
              {visibleMessages.map((message) => <MessageCard key={message.turn} message={message} tk={tk} />)}
            </div>
          </section>

          <section className={`flex h-[420px] flex-col overflow-hidden rounded-3xl border ${tk.panelBorder} ${tk.panelBg} backdrop-blur`}>
            <div className={`flex shrink-0 items-center justify-between border-b ${tk.panelHeaderBorder} ${tk.panelHeaderBg} px-4 py-3`}>
              <b className={`text-sm ${tk.fg}`}>Rolling tool/action window</b>
              <span className={`font-mono text-[11px] ${tk.fgMid}`}>{turn} / {MAX_TURN}</span>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto p-3">
              {visibleActions.length
                ? visibleActions.map((action) => <ActionTurn key={action.turn} turn={action.turn} cards={action.cards} tk={tk} />)
                : <ActionTurn turn={turn} cards={ACTION_BY_TURN.get(turn) ?? []} tk={tk} />
              }
            </div>
          </section>
        </div>

        <nav className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={`rounded-full ${tk.btnPrimaryBg} px-4 py-2 text-sm font-bold ${tk.btnPrimaryFg} transition`}
              onClick={() => setPlaying((current) => !current)}
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              className={`rounded-full ${tk.btnSecondary} px-4 py-2 text-sm transition`}
              onClick={() => { setTurn(MIN_TURN); setPlaying(true); }}
            >
              Restart
            </button>
            <button
              className={`rounded-full ${tk.btnSecondary} px-4 py-2 text-sm transition`}
              onClick={() => { setTurn(MAX_TURN); setPlaying(false); }}
            >
              End
            </button>
            <div className="ml-auto flex items-center gap-1">
              <span className={`mr-1 text-[10px] uppercase tracking-[0.18em] ${tk.fgDim}`}>speed</span>
              {SPEED_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setSpeed(preset.ms)}
                  className={`rounded-full px-2.5 py-1.5 font-mono text-[10px] transition ${
                    speed === preset.ms ? tk.speedActive : tk.speedInactive
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={MIN_TURN}
              max={MAX_TURN}
              value={turn}
              onChange={(e) => setTurn(Number(e.target.value))}
              onMouseDown={() => setPlaying(false)}
              className="flex-1 cursor-pointer accent-[#e8ff9c]"
            />
            <span className={`w-20 shrink-0 text-right font-mono text-[10px] ${tk.scrubberLabel}`}>
              {turn} / {MAX_TURN}
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
}
