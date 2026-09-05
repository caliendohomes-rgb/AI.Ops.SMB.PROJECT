import { useState, useEffect, useRef } from "react";

// ── Design tokens ────────────────────────────────────────────────
const C = {
  ink: "#0B1220",
  deep: "#0F1C35",
  navy: "#142240",
  slate: "#1E3358",
  horizon: "#2A4A7A",
  ocean: "#1A6FA8",
  foam: "#4DA8DA",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  goldDim: "rgba(201,168,76,0.15)",
  goldBorder: "rgba(201,168,76,0.3)",
  text: "#E8E4DC",
  textMid: "#9BAFC8",
  textDim: "#4A6080",
  green: "#2ECC8A",
  greenDim: "rgba(46,204,138,0.12)",
  red: "#E05555",
  redDim: "rgba(224,85,85,0.12)",
  amber: "#E8A020",
  amberDim: "rgba(232,160,32,0.12)",
  glass: "rgba(255,255,255,0.035)",
  glassBorder: "rgba(255,255,255,0.07)",
};

// ── Mock data ────────────────────────────────────────────────────
const MOCK_BRIEFS = [
  { id: 1, guest: "Thompson Party", vessel: "Sea Serenity", date: "2026-05-22", type: "Sunset Cruise", guests: 8, status: "sent", weather: "☀️ Clear", sentAt: "2 hrs ago" },
  { id: 2, guest: "Harrison Wedding", vessel: "Blue Horizon", date: "2026-05-24", type: "Private Event", guests: 22, status: "scheduled", weather: "🌤️ Partly cloudy", sentAt: "Sends in 18h" },
  { id: 3, guest: "Chen Family", vessel: "Sea Serenity", date: "2026-05-25", type: "Half-Day Charter", guests: 6, status: "sent", weather: "⛅ Variable", sentAt: "Yesterday" },
  { id: 4, guest: "Rosenberg Corp", vessel: "Pacific Dream", date: "2026-05-28", type: "Corporate Charter", guests: 14, status: "draft", weather: "☀️ Clear", sentAt: "Pending review" },
  { id: 5, guest: "Martinez Group", vessel: "Blue Horizon", date: "2026-06-01", type: "Fishing Trip", guests: 4, status: "scheduled", weather: "🌊 Bft 4", sentAt: "Sends in 4d" },
];

const MOCK_VESSELS = [
  { id: 1, name: "Sea Serenity", type: "48ft Catamaran", capacity: 12, briefs: 24, active: true },
  { id: 2, name: "Blue Horizon", type: "62ft Motor Yacht", capacity: 28, briefs: 18, active: true },
  { id: 3, name: "Pacific Dream", type: "38ft Sailboat", capacity: 8, briefs: 11, active: true },
];

const NAV = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "pipeline", label: "Automation", icon: "⟳" },
  { id: "briefs", label: "Briefs", icon: "✦" },
  { id: "fareharbor", label: "FareHarbor", icon: "⚡" },
  { id: "brand", label: "Brand Kit", icon: "◉" },
  { id: "upgrade", label: "Pro Plan", icon: "⬡" },
];

// ── Helpers ──────────────────────────────────────────────────────
const css = (obj) => Object.entries(obj).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';');

function Badge({ status }) {
  const map = {
    sent: { color: C.green, bg: C.greenDim, label: "Sent" },
    scheduled: { color: C.ocean, bg: "rgba(26,111,168,0.12)", label: "Scheduled" },
    draft: { color: C.amber, bg: C.amberDim, label: "Draft" },
    error: { color: C.red, bg: C.redDim, label: "Error" },
  };
  const s = map[status] || map.draft;
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 11,
      fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
      color: s.color, background: s.bg, border: `1px solid ${s.color}33`,
      fontFamily: "monospace",
    }}>{s.label}</span>
  );
}

function Stat({ label, value, sub, accent, trend }) {
  return (
    <div style={{
      background: C.glass, border: `1px solid ${C.glassBorder}`,
      borderRadius: 14, padding: "22px 24px", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${accent || C.gold}, transparent)`,
      }} />
      <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 800, color: accent || C.goldLight, fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.textMid, marginTop: 8 }}>{sub}</div>}
      {trend && <div style={{ fontSize: 12, color: C.green, marginTop: 6 }}>↑ {trend}</div>}
    </div>
  );
}

function PipelineStep({ num, title, desc, status, connector }) {
  const colors = { active: C.green, pending: C.gold, locked: C.textDim };
  const col = colors[status];
  return (
    <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48, flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: status === "active" ? C.greenDim : status === "pending" ? C.goldDim : "rgba(255,255,255,0.04)",
          border: `2px solid ${col}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: col, fontFamily: "monospace",
          boxShadow: status === "active" ? `0 0 16px ${C.green}44` : "none",
        }}>{status === "active" ? "✓" : num}</div>
        {connector && <div style={{ width: 2, flex: 1, minHeight: 24, background: `linear-gradient(${col}, ${C.textDim}44)`, margin: "4px 0" }} />}
      </div>
      <div style={{ paddingLeft: 16, paddingBottom: connector ? 28 : 0, paddingTop: 4, flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: status === "locked" ? C.textDim : C.text, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: C.textDim, lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}

// ── Sections ─────────────────────────────────────────────────────

function Overview({ setTab }) {
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, color: C.text, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 6 }}>
          Good morning, <span style={{ color: C.goldLight }}>Blue Horizon Charters</span>
        </h2>
        <p style={{ color: C.textMid, fontSize: 14 }}>3 charters this week · 2 briefs scheduled to auto-send · FareHarbor connected</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <Stat label="Briefs Sent" value="47" sub="This month" trend="12 vs last month" accent={C.green} />
        <Stat label="Auto-Sent" value="91%" sub="Fully automated" accent={C.ocean} />
        <Stat label="Open Rate" value="94%" sub="Industry avg: 68%" trend="Guest satisfaction ↑" accent={C.goldLight} />
        <Stat label="MRR Saved" value="~18h" sub="Staff hours / month" accent={C.foam} />
      </div>

      {/* Upcoming pipeline */}
      <div style={{
        background: C.glass, border: `1px solid ${C.glassBorder}`,
        borderRadius: 16, overflow: "hidden", marginBottom: 24,
      }}>
        <div style={{
          padding: "16px 24px", borderBottom: `1px solid ${C.glassBorder}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontSize: 13, color: C.textMid, letterSpacing: "0.08em", textTransform: "uppercase" }}>Upcoming Charters</div>
          <button onClick={() => setTab("briefs")} style={{ fontSize: 12, color: C.gold, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>View all →</button>
        </div>
        <div>
          {MOCK_BRIEFS.slice(0, 4).map((b, i) => (
            <div key={b.id} style={{
              display: "grid", gridTemplateColumns: "1fr 120px 100px 110px 100px",
              gap: 16, padding: "14px 24px", alignItems: "center",
              borderBottom: i < 3 ? `1px solid ${C.glassBorder}` : "none",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{b.guest}</div>
                <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>{b.vessel} · {b.type}</div>
              </div>
              <div style={{ fontSize: 13, color: C.textMid }}>{b.date}</div>
              <div style={{ fontSize: 13, color: C.textMid }}>{b.guests} guests</div>
              <div style={{ fontSize: 13, color: C.textMid }}>{b.weather}</div>
              <Badge status={b.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Wedge progress */}
      <div style={{
        background: `linear-gradient(135deg, ${C.goldDim}, rgba(26,111,168,0.08))`,
        border: `1px solid ${C.goldBorder}`,
        borderRadius: 16, padding: "24px 28px",
        display: "flex", alignItems: "center", gap: 28,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Founding Operator Plan · Month 3 of 6</div>
          <div style={{ fontSize: 20, color: C.text, fontWeight: 700, marginBottom: 8 }}>$447 credited toward Managed AI Onboarding</div>
          <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6 }}>
            At month 6, your $894 in Pro payments apply directly toward the full Managed AI setup fee. 3 months remaining on your founding rate.
          </div>
          <div style={{ marginTop: 16, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: "50%", height: "100%", background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`, borderRadius: 3 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: C.textDim }}>
            <span>$0</span><span style={{ color: C.gold }}>$447 now</span><span>$894 at Month 6</span>
          </div>
        </div>
        <button onClick={() => setTab("upgrade")} style={{
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
          color: C.ink, fontWeight: 700, border: "none", borderRadius: 10,
          padding: "14px 24px", cursor: "pointer", fontSize: 13,
          fontFamily: "'Playfair Display', Georgia, serif", whiteSpace: "nowrap",
          boxShadow: `0 4px 24px ${C.gold}44`,
        }}>View Upgrade Path →</button>
      </div>
    </div>
  );
}

function Pipeline() {
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(-1);

  async function simulate() {
    setSimulating(true);
    setSimStep(0);
    for (let i = 1; i <= 5; i++) {
      await new Promise(r => setTimeout(r, 900));
      setSimStep(i);
    }
    setSimulating(false);
  }

  const steps = [
    { title: "FareHarbor booking confirmed", desc: "Webhook fires instantly when a new booking is created or payment captured in FareHarbor.", status: "active" },
    { title: "Booking data extracted", desc: "Guest name, party size, vessel, date, time, trip type, and special requests are parsed from the FareHarbor payload.", status: "active" },
    { title: "Live weather fetched", desc: "Open-Meteo forecast pulled for departure marina. Wind, conditions, and precipitation probability assessed. Elevated conditions flagged.", status: "active" },
    { title: "Claude generates brief", desc: "Your brand tone, logo, vessel details, and weather data are assembled into a prompt. Claude writes a personalized guest email in seconds.", status: "active" },
    { title: "Human review window (optional)", desc: "If review mode is on, brief enters a 2-hour approval queue before sending. Approve, edit, or override in the dashboard.", status: "active" },
    { title: "Email delivered to guest", desc: "Brief sent from your business email address. Open tracking enabled. Copy logged to your dashboard.", status: "active" },
    { title: "Post-trip sequence queued", desc: "Follow-up and review request scheduled for 24h after charter end time.", status: "active" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 26, color: C.text, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 6 }}>Automation Pipeline</h2>
          <p style={{ color: C.textMid, fontSize: 14 }}>From FareHarbor booking to guest inbox — zero manual effort</p>
        </div>
        <button onClick={simulate} disabled={simulating} style={{
          background: simulating ? C.glass : `linear-gradient(135deg, ${C.ocean}, ${C.foam})`,
          color: C.text, border: `1px solid ${simulating ? C.glassBorder : C.ocean}`,
          borderRadius: 10, padding: "12px 20px", cursor: simulating ? "default" : "pointer",
          fontSize: 13, fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ display: "inline-block", animation: simulating ? "spin 1s linear infinite" : "none" }}>⟳</span>
          {simulating ? "Running simulation..." : "Simulate booking →"}
        </button>
      </div>

      {simStep >= 0 && (
        <div style={{
          background: C.greenDim, border: `1px solid ${C.green}44`,
          borderRadius: 12, padding: "14px 20px", marginBottom: 24, fontSize: 13, color: C.green,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ display: "inline-block", animation: simulating ? "spin 0.8s linear infinite" : "none" }}>⟳</span>
          {simStep < steps.length
            ? `Step ${simStep}: ${steps[simStep - 1]?.title || "Starting..."}`
            : "✓ Complete — guest brief delivered in 4.2 seconds"}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{
          background: C.glass, border: `1px solid ${C.glassBorder}`,
          borderRadius: 16, padding: "28px 24px",
        }}>
          <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>Pipeline Steps</div>
          {steps.map((s, i) => (
            <PipelineStep
              key={i} num={i + 1}
              title={s.title} desc={s.desc}
              status={simStep > i ? "active" : simStep === i ? "pending" : s.status}
              connector={i < steps.length - 1}
            />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Timing card */}
          <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 16, padding: "24px" }}>
            <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Timing Configuration</div>
            {[
              { label: "Pre-trip brief sends", value: "Immediately on booking", note: "Configurable: instant or delayed" },
              { label: "Weather refresh", value: "48h before departure", note: "Re-sends if forecast changes significantly" },
              { label: "Day-before reminder", value: "24h before departure", note: "Dock location + final checklist" },
              { label: "Post-trip follow-up", value: "24h after charter end", note: "Thank you + review request" },
              { label: "Review nudge", value: "+72h if no review", note: "One-time gentle reminder" },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${C.glassBorder}` }}>
                <div>
                  <div style={{ fontSize: 13, color: C.text }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{r.note}</div>
                </div>
                <div style={{ fontSize: 12, color: C.gold, textAlign: "right", maxWidth: 140 }}>{r.value}</div>
              </div>
            ))}
          </div>

          {/* Review mode toggle */}
          <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 16, padding: "24px" }}>
            <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Send Controls</div>
            {[
              { label: "Instant send mode", desc: "Brief sends the moment booking confirms", on: true },
              { label: "2-hour review window", desc: "Pause for human approval before sending", on: false },
              { label: "Weather advisory override", desc: "Alert me when Bft 6+ detected", on: true },
              { label: "Post-trip automation", desc: "Follow-up and review sequences", on: true },
            ].map(t => (
              <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 13, color: C.text }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{t.desc}</div>
                </div>
                <div style={{
                  width: 44, height: 24, borderRadius: 12,
                  background: t.on ? C.ocean : "rgba(255,255,255,0.1)",
                  position: "relative", cursor: "pointer",
                  border: `1px solid ${t.on ? C.ocean : C.glassBorder}`,
                  transition: "all 0.2s",
                }}>
                  <div style={{
                    position: "absolute", top: 3, left: t.on ? 22 : 3,
                    width: 16, height: 16, borderRadius: "50%",
                    background: t.on ? "#fff" : C.textDim,
                    transition: "all 0.2s",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Briefs() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? MOCK_BRIEFS : MOCK_BRIEFS.filter(b => b.status === filter);

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 26, color: C.text, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 6 }}>Guest Briefs</h2>
          <p style={{ color: C.textMid, fontSize: 14 }}>All generated and sent guest communications</p>
        </div>
        <button style={{
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
          color: C.ink, border: "none", borderRadius: 10,
          padding: "12px 20px", cursor: "pointer", fontSize: 13,
          fontWeight: 700, fontFamily: "inherit",
        }}>+ Manual Brief</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "sent", "scheduled", "draft"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            background: filter === f ? C.ocean : C.glass,
            color: filter === f ? C.text : C.textDim,
            fontFamily: "monospace", transition: "all 0.2s",
          }}>{f}</button>
        ))}
      </div>

      <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 130px 100px 120px 110px 80px",
          gap: 16, padding: "12px 24px",
          borderBottom: `1px solid ${C.glassBorder}`,
          fontSize: 11, color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {["Guest / Vessel", "Date", "Guests", "Weather", "Status", ""].map(h => <div key={h}>{h}</div>)}
        </div>
        {filtered.map((b, i) => (
          <div key={b.id} style={{
            display: "grid", gridTemplateColumns: "1fr 130px 100px 120px 110px 80px",
            gap: 16, padding: "16px 24px", alignItems: "center",
            borderBottom: i < filtered.length - 1 ? `1px solid ${C.glassBorder}` : "none",
            transition: "background 0.15s", cursor: "pointer",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div>
              <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{b.guest}</div>
              <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>{b.vessel} · {b.type}</div>
            </div>
            <div style={{ fontSize: 13, color: C.textMid }}>{b.date}</div>
            <div style={{ fontSize: 13, color: C.textMid }}>{b.guests} pax</div>
            <div style={{ fontSize: 13, color: C.textMid }}>{b.weather}</div>
            <Badge status={b.status} />
            <div style={{ fontSize: 12, color: C.textDim }}>{b.sentAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FareHarborSetup() {
  const [connected, setConnected] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [shortname, setShortname] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [tested, setTested] = useState(false);

  async function connect() {
    setConnecting(true);
    await new Promise(r => setTimeout(r, 2000));
    setConnected(true);
    setConnecting(false);
  }

  async function test() {
    setTested(false);
    await new Promise(r => setTimeout(r, 1200));
    setTested(true);
  }

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, color: C.text, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 6 }}>FareHarbor Integration</h2>
        <p style={{ color: C.textMid, fontSize: 14 }}>Connect your booking system to enable fully automated brief delivery</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Setup steps */}
        <div>
          <div style={{
            background: connected ? C.greenDim : C.goldDim,
            border: `1px solid ${connected ? C.green + "44" : C.goldBorder}`,
            borderRadius: 14, padding: "16px 20px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ fontSize: 20 }}>{connected ? "✅" : "⚡"}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: connected ? C.green : C.gold }}>
                {connected ? "FareHarbor Connected" : "Not Yet Connected"}
              </div>
              <div style={{ fontSize: 12, color: C.textDim }}>
                {connected ? "Webhook active · Receiving bookings" : "Follow the steps below to connect"}
              </div>
            </div>
          </div>

          <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 16, padding: "24px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Setup Instructions</div>
            {[
              { step: "1", title: "Request API access from FareHarbor", desc: "Email FareHarbor support and ask for your API key and company shortname. Mention you're integrating with Charter Brief." },
              { step: "2", title: "Copy your webhook URL", desc: "Paste the URL below into your FareHarbor support ticket so they can configure the booking.created webhook on their end." },
              { step: "3", title: "Enter credentials below", desc: "Once FareHarbor responds with your API key and shortname, enter them in the connection form." },
              { step: "4", title: "Send a test booking", desc: "Create a test booking in FareHarbor. Charter Brief will receive it and generate a draft brief for your review." },
            ].map((s, i) => (
              <PipelineStep key={i} num={s.step} title={s.title} desc={s.desc} status="active" connector={i < 3} />
            ))}
          </div>

          {/* Webhook URL */}
          <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Your Webhook URL</div>
            <div style={{
              background: "rgba(0,0,0,0.3)", border: `1px solid ${C.glassBorder}`,
              borderRadius: 8, padding: "12px 16px", fontFamily: "monospace",
              fontSize: 12, color: C.foam, letterSpacing: "0.02em",
              wordBreak: "break-all",
            }}>
              https://api.charterbrief.com/webhook/fh/acct_bh_9f3k2x
            </div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 8 }}>Include this URL in your FareHarbor support ticket</div>
          </div>
        </div>

        {/* Connection form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 16, padding: "24px" }}>
            <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>API Credentials</div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: C.textMid, marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>FareHarbor API Key</label>
              <input value={apiKey} onChange={e => setApiKey(e.target.value)}
                placeholder="fh_live_xxxxxxxxxxxxxxxxxxxx"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10,
                  background: "rgba(0,0,0,0.3)", border: `1px solid ${C.glassBorder}`,
                  color: C.text, fontSize: 13, fontFamily: "monospace",
                  outline: "none", boxSizing: "border-box",
                }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: C.textMid, marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Company Shortname</label>
              <input value={shortname} onChange={e => setShortname(e.target.value)}
                placeholder="bluehorizoncharters"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10,
                  background: "rgba(0,0,0,0.3)", border: `1px solid ${C.glassBorder}`,
                  color: C.text, fontSize: 13, fontFamily: "monospace",
                  outline: "none", boxSizing: "border-box",
                }} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={test} style={{
                flex: 1, padding: "13px", borderRadius: 10,
                background: "transparent", border: `1px solid ${C.glassBorder}`,
                color: C.textMid, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600,
              }}>
                {tested ? "✓ Test passed" : "Test connection"}
              </button>
              <button onClick={connect} disabled={connecting || connected} style={{
                flex: 1, padding: "13px", borderRadius: 10,
                background: connected ? C.greenDim : `linear-gradient(135deg, ${C.ocean}, ${C.foam})`,
                border: `1px solid ${connected ? C.green + "44" : "transparent"}`,
                color: connected ? C.green : C.text,
                cursor: connecting || connected ? "default" : "pointer",
                fontSize: 13, fontFamily: "inherit", fontWeight: 700,
              }}>
                {connecting ? "Connecting..." : connected ? "✓ Connected" : "Activate"}
              </button>
            </div>
          </div>

          {/* Vessels sync */}
          <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 16, padding: "24px" }}>
            <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Synced Vessels</div>
            {MOCK_VESSELS.map(v => (
              <div key={v.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 0", borderBottom: `1px solid ${C.glassBorder}`,
              }}>
                <div>
                  <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{v.name}</div>
                  <div style={{ fontSize: 12, color: C.textDim }}>{v.type} · Capacity {v.capacity}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: C.green }}>{v.briefs} briefs sent</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>Active</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandKit() {
  const [tone, setTone] = useState("luxury");
  const [logo, setLogo] = useState(null);
  const [accent, setAccent] = useState("#C9A84C");
  const fileRef = useRef();

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, color: C.text, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 6 }}>Brand Kit</h2>
        <p style={{ color: C.textMid, fontSize: 14 }}>Every generated brief reflects your identity — not a template</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Logo upload */}
          <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 16, padding: "24px" }}>
            <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Logo</div>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${C.glassBorder}`, borderRadius: 12,
                padding: "36px", textAlign: "center", cursor: "pointer",
                transition: "all 0.2s", background: "rgba(0,0,0,0.2)",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.glassBorder}
            >
              {logo ? (
                <div style={{ fontSize: 13, color: C.green }}>✓ {logo.name}</div>
              ) : (
                <>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>◉</div>
                  <div style={{ fontSize: 13, color: C.textMid }}>Drop your logo here</div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>PNG or SVG · Displayed in email header</div>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".png,.svg,.jpg" style={{ display: "none" }}
              onChange={e => setLogo(e.target.files[0])} />
          </div>

          {/* Brand color */}
          <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 16, padding: "24px" }}>
            <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Brand Accent Color</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input type="color" value={accent} onChange={e => setAccent(e.target.value)}
                style={{ width: 56, height: 48, borderRadius: 8, border: `1px solid ${C.glassBorder}`, cursor: "pointer", background: "none" }} />
              <div>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{accent}</div>
                <div style={{ fontSize: 12, color: C.textDim }}>Used in email header and CTA button</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {["#C9A84C", "#1A6FA8", "#2ECC8A", "#E05555", "#8B5CF6", "#0F172A"].map(c => (
                <div key={c} onClick={() => setAccent(c)} style={{
                  width: 28, height: 28, borderRadius: 6, background: c, cursor: "pointer",
                  border: accent === c ? "2px solid white" : "2px solid transparent",
                  transition: "transform 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              ))}
            </div>
          </div>

          {/* Tone */}
          <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 16, padding: "24px" }}>
            <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Brand Voice</div>
            <textarea
              placeholder="Describe your brand tone in your own words. E.g: 'We're a premium yacht charter with 20 years on the water. We're warm but not casual — guests are called by name, safety is taken seriously, and every communication should feel like it came from an experienced captain who genuinely cares about their experience.'"
              style={{
                width: "100%", height: 120, padding: "14px 16px",
                background: "rgba(0,0,0,0.3)", border: `1px solid ${C.glassBorder}`,
                borderRadius: 10, color: C.text, fontSize: 13, lineHeight: 1.6,
                resize: "vertical", outline: "none", fontFamily: "Georgia, serif",
                boxSizing: "border-box",
              }} />
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 8 }}>The more specific you are, the more your briefs will sound like you</div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.glassBorder}`, fontSize: 12, color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Email Preview
            </div>
            <div style={{ background: "#f8f6f2", padding: "32px 28px", fontFamily: "Georgia, serif" }}>
              {/* Email header */}
              <div style={{
                background: accent, borderRadius: "8px 8px 0 0",
                padding: "20px 24px", marginBottom: 0,
              }}>
                <div style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
                  {logo ? "🖼 [Your Logo]" : "Blue Horizon Charters"}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
                  Charter Guest Communication
                </div>
              </div>
              <div style={{
                background: "#fff", borderRadius: "0 0 8px 8px",
                padding: "24px", border: `1px solid ${accent}33`, borderTop: "none",
              }}>
                <div style={{ fontSize: 15, color: "#1a1a1a", lineHeight: 1.7, marginBottom: 16 }}>
                  Dear Thompson Party,
                </div>
                <div style={{ fontSize: 14, color: "#333", lineHeight: 1.8, marginBottom: 16 }}>
                  We're delighted to welcome you aboard <em>Sea Serenity</em> this Saturday for your sunset cruise. The forecast looks beautiful — clear skies, light southwesterly breeze at Beaufort 2, and a high of 78°F. Perfect conditions for an evening on the water.
                </div>
                <div style={{
                  background: accent + "15", borderLeft: `3px solid ${accent}`,
                  padding: "12px 16px", borderRadius: "0 6px 6px 0", marginBottom: 16,
                }}>
                  <div style={{ fontSize: 13, fontWeight: "bold", color: "#1a1a1a", marginBottom: 6 }}>What to bring</div>
                  <div style={{ fontSize: 13, color: "#333", lineHeight: 1.7 }}>Light layer · Sun protection · Non-marking shoes · Camera</div>
                </div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                  We look forward to an unforgettable evening. Any questions, reach us at [PHONE].
                </div>
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #eee", fontSize: 12, color: "#999" }}>
                  Blue Horizon Charters · Marina del Rey, CA
                </div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 12, textAlign: "center" }}>
            Preview updates live as you adjust your brand settings
          </div>
        </div>
      </div>
    </div>
  );
}

function UpgradePlan() {
  const months = 3;
  const paid = months * 149;
  const setupFee = 2500;
  const remaining = setupFee - paid;
  const progress = paid / setupFee;

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, color: C.text, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 6 }}>Your Upgrade Path</h2>
        <p style={{ color: C.textMid, fontSize: 14 }}>Pro payments credit directly toward full Managed AI onboarding</p>
      </div>

      {/* Credit tracker */}
      <div style={{
        background: `linear-gradient(135deg, rgba(15,28,53,0.9), rgba(20,34,64,0.9))`,
        border: `1px solid ${C.goldBorder}`,
        borderRadius: 20, padding: "36px 40px", marginBottom: 28,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight}, ${C.gold})`,
        }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40, marginBottom: 32 }}>
          {[
            { label: "Months Active", value: `${months}`, sub: "of 6 founding rate months" },
            { label: "Credited to Onboarding", value: `$${paid.toLocaleString()}`, sub: `$${remaining.toLocaleString()} remaining to credit` },
            { label: "Current Rate", value: "$149/mo", sub: "Founding operator rate · Locks until month 6" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.goldLight, fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: C.textMid, marginTop: 6 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
          <div style={{
            width: `${progress * 100}%`, height: "100%",
            background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
            borderRadius: 4, transition: "width 1s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textDim }}>
          <span>Month 1 — $149 credited</span>
          <span style={{ color: C.gold }}>Now — ${paid} credited</span>
          <span>Month 6 — $894 credited</span>
        </div>
      </div>

      {/* Two paths */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Path A */}
        <div style={{
          background: C.glass, border: `1px solid ${C.glassBorder}`,
          borderRadius: 16, padding: "28px", position: "relative",
        }}>
          <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Stay on Pro</div>
          <div style={{ fontSize: 26, color: C.text, fontWeight: 800, marginBottom: 4, fontFamily: "'Playfair Display', Georgia, serif" }}>$299<span style={{ fontSize: 14, fontWeight: 400, color: C.textDim }}>/mo</span></div>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 20 }}>After month 6 — standard rate</div>
          {["Unlimited auto-send", "FareHarbor sync", "Full brand kit", "Post-trip sequences", "Multi-vessel", "Email support"].map(f => (
            <div key={f} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 13, color: C.textMid, alignItems: "center" }}>
              <span style={{ color: C.ocean, fontSize: 11 }}>✦</span> {f}
            </div>
          ))}
        </div>

        {/* Path B — Managed AI */}
        <div style={{
          background: `linear-gradient(135deg, ${C.goldDim}, rgba(26,111,168,0.08))`,
          border: `1px solid ${C.goldBorder}`,
          borderRadius: 16, padding: "28px", position: "relative",
        }}>
          <div style={{
            position: "absolute", top: -1, right: 20,
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            color: C.ink, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
            padding: "4px 12px", borderRadius: "0 0 8px 8px", textTransform: "uppercase",
          }}>Recommended</div>
          <div style={{ fontSize: 12, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Upgrade to Managed AI</div>
          <div style={{ fontSize: 26, color: C.goldLight, fontWeight: 800, marginBottom: 4, fontFamily: "'Playfair Display', Georgia, serif" }}>
            $1,606 <span style={{ fontSize: 14, fontWeight: 400, color: C.textDim }}>remaining</span>
          </div>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 6 }}>After your $894 credit is applied to the $2,500 setup fee</div>
          <div style={{ fontSize: 12, color: C.gold, marginBottom: 20 }}>Then $1,000/mo managed retainer</div>
          {[
            "Everything in Pro",
            "Full Claude workflow audit",
            "QuickBooks + HubSpot AI config",
            "Staff training & onboarding",
            "Monthly optimization calls",
            "Dedicated account manager",
            "New Anthropic features auto-deployed",
            "DocuSign waiver automation",
          ].map(f => (
            <div key={f} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 13, color: C.text, alignItems: "center" }}>
              <span style={{ color: C.gold, fontSize: 11 }}>✦</span> {f}
            </div>
          ))}
          <button style={{
            width: "100%", marginTop: 8, padding: "14px",
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            color: C.ink, fontWeight: 700, border: "none", borderRadius: 10,
            cursor: "pointer", fontSize: 14, fontFamily: "'Playfair Display', Georgia, serif",
            boxShadow: `0 4px 24px ${C.gold}44`,
          }}>Book Onboarding Call →</button>
        </div>
      </div>

      {/* What managed AI gets you */}
      <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 16, padding: "28px" }}>
        <div style={{ fontSize: 12, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>What Managed AI Adds Beyond Charter Brief</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          {[
            { icon: "📊", title: "QuickBooks Workflows", desc: "Automated reconciliation, invoice generation, and monthly financial summaries — all AI-managed." },
            { icon: "📱", title: "HubSpot CRM Automation", desc: "Lead follow-up sequences, review request routing, and seasonal marketing campaigns." },
            { icon: "📋", title: "DocuSign Waiver Routing", desc: "Waivers automatically sent, tracked, and archived when bookings are confirmed." },
            { icon: "📅", title: "Crew Scheduling Intelligence", desc: "Claude monitors bookings and flags scheduling conflicts before they become problems." },
            { icon: "📈", title: "Monthly Performance Reports", desc: "AI-generated ops summary every month — what's working, what needs attention." },
            { icon: "🔔", title: "Proactive Monitoring", desc: "We watch your workflows so you don't have to. Issues flagged before guests notice." },
          ].map(f => (
            <div key={f.title} style={{ padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 14, color: C.text, fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── App shell ────────────────────────────────────────────────────
export default function CharterBriefPro() {
  const [tab, setTab] = useState("overview");

  const sections = { overview: Overview, pipeline: Pipeline, briefs: Briefs, fareharbor: FareHarborSetup, brand: BrandKit, upgrade: UpgradePlan };
  const Section = sections[tab];

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: C.ink, color: C.text,
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: C.deep,
        borderRight: `1px solid ${C.glassBorder}`,
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "28px 24px 20px", borderBottom: `1px solid ${C.glassBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, color: C.ink, fontWeight: "bold",
              boxShadow: `0 0 16px ${C.gold}44`,
            }}>⚓</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'Playfair Display', Georgia, serif" }}>Charter Brief</div>
              <div style={{ fontSize: 10, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pro</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, marginBottom: 4,
              background: tab === n.id ? `rgba(201,168,76,0.12)` : "transparent",
              border: tab === n.id ? `1px solid ${C.goldBorder}` : "1px solid transparent",
              color: tab === n.id ? C.goldLight : C.textDim,
              cursor: "pointer", textAlign: "left", fontSize: 13,
              fontFamily: "inherit", fontWeight: tab === n.id ? 700 : 400,
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { if (tab !== n.id) e.currentTarget.style.color = C.textMid; }}
              onMouseLeave={e => { if (tab !== n.id) e.currentTarget.style.color = C.textDim; }}
            >
              <span style={{ fontSize: 15, width: 18, textAlign: "center" }}>{n.icon}</span>
              {n.label}
              {n.id === "fareharbor" && <span style={{
                marginLeft: "auto", fontSize: 9, padding: "2px 6px", borderRadius: 10,
                background: C.greenDim, color: C.green, fontWeight: 700, letterSpacing: "0.06em",
              }}>ON</span>}
              {n.id === "upgrade" && <span style={{
                marginLeft: "auto", fontSize: 9, padding: "2px 6px", borderRadius: 10,
                background: C.goldDim, color: C.gold, fontWeight: 700, letterSpacing: "0.06em",
              }}>3/6</span>}
            </button>
          ))}
        </nav>

        {/* Account */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.glassBorder}` }}>
          <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>Blue Horizon Charters</div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>captain@bluehorizon.com</div>
          <div style={{
            marginTop: 10, padding: "6px 10px", borderRadius: 8,
            background: C.goldDim, border: `1px solid ${C.goldBorder}`,
            fontSize: 11, color: C.gold, fontWeight: 600, textAlign: "center",
          }}>Founding Operator · Month 3</div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "40px 48px", overflowY: "auto", minWidth: 0 }}>
        <Section setTab={setTab} />
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=DM+Sans:wght@400;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:${C.glassBorder}; border-radius:3px; }
        ::placeholder { color:${C.textDim} !important; }
        input, textarea, select { color-scheme:dark; }
      `}</style>
    </div>
  );
}
