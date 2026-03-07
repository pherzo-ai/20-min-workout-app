import { ROUNDS_PER_CIRCUIT } from "../workoutData";

export default function Dashboard({ circuits, completedCircuits, activeCircuit, onSelectCircuit }) {
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
          const isLocked = !isCompleted && activeCircuit !== circuit.id && index > 0 && !completedCircuits.includes(circuits[index - 1]?.id);

          return (
            <div
              key={circuit.id}
              className={`circuit-card ${isCompleted ? "circuit-card--completed" : ""} ${isCurrent ? "circuit-card--active" : ""}`}
              onClick={() => !isCompleted && onSelectCircuit(circuit.id)}
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
                    <span className="exercise-name">{ex}</span>
                  </li>
                ))}
              </ul>
              {!isCompleted && (
                <button
                  className="btn btn-primary circuit-start-btn"
                  onClick={(e) => { e.stopPropagation(); onSelectCircuit(circuit.id); }}
                >
                  Start Circuit
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
