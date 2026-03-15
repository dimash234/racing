// src/components/Simulators.jsx
import { useLanguage } from "../i18n/LanguageContext";
import SimulatorSection from "./SimulatorSection";

function CityCar() {
  const { t } = useLanguage();

  const visual = (
    <div style={{ background: "#0F172A", borderRadius: 16, overflow: "hidden", border: "1px solid #1E293B" }}>
      {/* Fake window bar */}
      <div style={{ padding: "10px 16px", background: "#1E293B", display: "flex", alignItems: "center", gap: 8 }}>
        {["#EF4444", "#F59E0B", "#22C55E"].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ flex: 1, textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#64748B" }}>City Car Driving — Session #08</div>
      </div>

      {/* Simulated HUD screen */}
      <div style={{ padding: 20, position: "relative" }}>
        {/* Top bar: speed + gear */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 700, color: "#3B82F6" }}>47</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#64748B" }}>km/h</div>
          </div>
          <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 700, color: "#22C55E" }}>3</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#64748B" }}>GEAR</div>
          </div>
          <div style={{ background: "rgba(232,197,71,0.15)", border: "1px solid rgba(232,197,71,0.3)", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: "#E8C547" }}>2/3</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#64748B" }}>Mistakes</div>
          </div>
        </div>

        {/* Scenario bar */}
        <div style={{ background: "#1E293B", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#64748B", marginBottom: 4 }}>Current Scenario</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#E2E8F0", fontWeight: 600 }}>Intersection with traffic light — right of way</div>
          <div style={{ marginTop: 10, background: "#0F172A", borderRadius: 4, height: 6, overflow: "hidden" }}>
            <div style={{ width: "62%", height: "100%", background: "#3B82F6", borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#475569" }}>Progress</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#3B82F6" }}>62%</span>
          </div>
        </div>

        {/* Road signs row */}
        <div style={{ display: "flex", gap: 8 }}>
          {["🚦", "⛔", "🚧", "🅿️", "⚠️"].map((sign) => (
            <div key={sign} style={{ flex: 1, background: "#1E293B", borderRadius: 6, padding: "8px 4px", textAlign: "center", fontSize: 18 }}>{sign}</div>
          ))}
        </div>

        <div style={{ marginTop: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#475569", textAlign: "center" }}>
          Instructor: "Check mirrors before changing lanes"
        </div>
      </div>
    </div>
  );

  return (
    <SimulatorSection
      id="citycar"
      badge={t.citycar.badge}
      title={t.citycar.title}
      description={t.citycar.description}
      highlights={t.citycar.highlights}
      sessions={t.citycar.sessions}
      sessionsLabel={t.citycar.sessions_label}
      accentColor="#3B82F6"
      bgColor="#fff"
      imageSide="right"
      visual={visual}
    />
  );
}

function BeamNG() {
  const { t } = useLanguage();

  const visual = (
    <div style={{ background: "#0F0F0F", borderRadius: 16, overflow: "hidden", border: "1px solid #1F1F1F" }}>
      {/* Window bar */}
      <div style={{ padding: "10px 16px", background: "#1A1A1A", display: "flex", alignItems: "center", gap: 8 }}>
        {["#EF4444", "#F59E0B", "#22C55E"].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ flex: 1, textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#4B5563" }}>BeamNG.Drive — Emergency Training</div>
      </div>

      <div style={{ padding: 20 }}>
        {/* Alert */}
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#FCA5A5", fontWeight: 600 }}>SCENARIO ACTIVE — Black Ice Detected</span>
        </div>

        {/* Gauges */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[
            { label: "Speed", value: "112", unit: "km/h", color: "#EF4444", fill: 75 },
            { label: "Grip", value: "23", unit: "%", color: "#F59E0B", fill: 23 },
            { label: "Steer", value: "34°", unit: "", color: "#8B5CF6", fill: 45 },
          ].map(({ label, value, unit, color, fill }) => (
            <div key={label} style={{ background: "#1A1A1A", borderRadius: 8, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700, color }}>{value}<span style={{ fontSize: 10, marginLeft: 2 }}>{unit}</span></div>
              <div style={{ marginTop: 6, background: "#0F0F0F", borderRadius: 4, height: 4, overflow: "hidden" }}>
                <div style={{ width: `${fill}%`, height: "100%", background: color, borderRadius: 4 }} />
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#4B5563", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Physics data */}
        <div style={{ background: "#1A1A1A", borderRadius: 8, padding: 14, marginBottom: 14 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#4B5563", marginBottom: 8 }}>Vehicle Dynamics</div>
          {[
            { label: "ABS", status: "ACTIVE", color: "#F59E0B" },
            { label: "Traction Control", status: "INTERVENING", color: "#EF4444" },
            { label: "ESC", status: "ACTIVE", color: "#F59E0B" },
          ].map(({ label, status, color }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #0F0F0F" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9CA3AF" }}>{label}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color, fontWeight: 700 }}>{status}</span>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#4B5563", textAlign: "center" }}>
          Instructor analysis after session completion
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );

  return (
    <SimulatorSection
      id="beamng"
      badge={t.beamng.badge}
      title={t.beamng.title}
      description={t.beamng.description}
      highlights={t.beamng.highlights}
      sessions={t.beamng.sessions}
      sessionsLabel={t.beamng.sessions_label}
      accentColor="#E8C547"
      bgColor="#F9FAFB"
      imageSide="left"
      visual={visual}
    />
  );
}

export { CityCar, BeamNG };
