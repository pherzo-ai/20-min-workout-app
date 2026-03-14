'use client';

import { useState } from "react";
import { workoutPlans, recoveryPlans } from "../lib/workoutData";

export default function SettingsScreen({ activePlanId, onSelectPlan }) {
  const [tab, setTab] = useState(() =>
    recoveryPlans.some(p => p.id === activePlanId) ? "recovery" : "work"
  );

  const plans = tab === "work" ? workoutPlans : recoveryPlans;

  return (
    <div className="screen settings-screen">
      <div className="settings-header">
        <h1 className="settings-title">Workout Plans</h1>
        <p className="settings-subtitle">
          {tab === "work"
            ? "All plans deliver a full-body workout. Switching plans resets your current progress."
            : "Recovery circuits use 35s holds with no rest between stretches."}
        </p>
      </div>

      <div className="plan-tabs">
        <button
          className={`plan-tab ${tab === "work" ? "plan-tab--active" : ""}`}
          onClick={() => setTab("work")}
        >
          Work
        </button>
        <button
          className={`plan-tab ${tab === "recovery" ? "plan-tab--active plan-tab--recovery" : ""}`}
          onClick={() => setTab("recovery")}
        >
          Recovery
        </button>
      </div>

      <div className="plan-list">
        {plans.map(plan => {
          const isActive = plan.id === activePlanId;
          return (
            <div
              key={plan.id}
              className={`plan-card ${isActive ? "plan-card--active" : ""} ${plan.type === "recovery" ? "plan-card--recovery" : ""}`}
              onClick={() => !isActive && onSelectPlan(plan.id)}
            >
              <div className="plan-card-top">
                <div className="plan-card-title-row">
                  <h2 className="plan-card-name">{plan.name}</h2>
                  {isActive && <span className="plan-active-badge">{plan.type === "recovery" ? "Active" : "Active"}</span>}
                </div>
                <p className="plan-card-desc">{plan.description}</p>
                <div className="plan-equipment">
                  {plan.equipment.map(eq => (
                    <span key={eq} className="equipment-tag">{eq}</span>
                  ))}
                  {plan.type === "recovery" && (
                    <span className="equipment-tag equipment-tag--recovery">1 Round · No Rest</span>
                  )}
                </div>
              </div>

              <div className="plan-circuits">
                {plan.circuits.map((circuit, i) => (
                  <div key={i} className="plan-circuit-row">
                    <span className="plan-circuit-name">{circuit.name}</span>
                    <span className="plan-circuit-exercises">
                      {circuit.exercises.join(" · ")}
                    </span>
                  </div>
                ))}
              </div>

              {!isActive && (
                <button
                  className="btn btn-secondary plan-select-btn"
                  onClick={e => { e.stopPropagation(); onSelectPlan(plan.id); }}
                >
                  Select Plan
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
