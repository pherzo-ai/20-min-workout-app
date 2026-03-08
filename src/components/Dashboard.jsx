import { useState } from "react";
import { ROUNDS_PER_CIRCUIT, exerciseDescriptions } from "../workoutData";

function ExerciseModal({ exercise, onClose }) {
  const description = exerciseDescriptions[exercise] ?? "A great exercise to include in your full-body workout.";
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{exercise}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <p className="modal-body">{description}</p>
      </div>
    </div>
  );
}

export default function Dashboard({ circuits, completedCircuits, activeCircuit, onSelectCircuit }) {
  const [selectedExercise, setSelectedExercise] = useState(null);

  return (
    <div className="screen dashboard-screen">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Your Workout</h1>
        <p className="dashboard-subtitle">
          Complete all 3 circuits to finish your 20-minute workout
        </p>
      </div>

      <div className="circuit-list">
        {circuits.map((circuit, index) => {
          const isCompleted = completedCircuits.includes(circuit.id);
          const isCurrent = activeCircuit === circuit.id;

          return (
            <div
              key={circuit.id}
              className={`circuit-card ${isCompleted ? "circuit-card--completed" : ""} ${isCurrent ? "circuit-card--active" : ""}`}
            >
              <div className="circuit-card-header">
                <div className="circuit-card-title-row">
                  <h2 className="circuit-card-name">{circuit.name}</h2>
                  {isCompleted && (
                    <div className="circuit-check" title="Completed">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="circuit-card-meta">
                  {ROUNDS_PER_CIRCUIT} rounds &bull; {circuit.exercises.length} exercises
                </p>
              </div>
              <ul className="exercise-list">
                {circuit.exercises.map((ex, i) => (
                  <li key={i} className="exercise-item">
                    <span className="exercise-number">{i + 1}</span>
                    <button
                      className="exercise-name exercise-name--btn"
                      onClick={() => setSelectedExercise(ex)}
                    >
                      {ex}
                      <svg className="exercise-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              {!isCompleted && (
                <button
                  className="btn btn-primary circuit-start-btn"
                  onClick={() => onSelectCircuit(circuit.id)}
                >
                  Start Circuit
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedExercise && (
        <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      )}
    </div>
  );
}
