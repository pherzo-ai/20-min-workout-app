'use client';

import { workoutPlans } from "../lib/workoutData";

export default function SettingsScreen({ activePlanId, onSelectPlan }) {
  return (
    <div className="screen settings-screen">
      <div className="settings-header">
        <h1 className="settings-title">Workout Plans</h1>
        <p className="settings-subtitle">
          All plans deliver a full-body workout. Switching plans resets your current progress.
        </p>
      </div>

      <div className="plan-list">
        {workoutPlans.map(plan => {
          const isActive = plan.id === activePlanId;
          return (
            <div
              key={plan.id}
              className={`plan-card ${isActive ? "plan-card--active" : ""}`}
              onClick={() => !isActive && onSelectPlan(plan.id)}
            >
              <div className="plan-card-top">
                <div className="plan-card-title-row">
                  <h2 className="plan-card-name">{plan.name}</h2>
                  {isActive && <span className="plan-active-badge">Active</span>}
                </div>
                <p className="plan-card-desc">{plan.description}</p>
                <div className="plan-equipment">
                  {plan.equipment.map(eq => (
                    <span key={eq} className="equipment-tag">{eq}</span>
                  ))}
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
