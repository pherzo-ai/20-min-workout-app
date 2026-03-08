import { useState, useEffect } from "react";
import { ROUNDS_PER_CIRCUIT, exerciseDescriptions } from "../workoutData";

// Strip equipment prefixes so the wger search finds a better match
function toSearchTerm(name) {
  return name
    .replace(/^(dumbbell|barbell|kettlebell|alternating\s+dumbbell|bent-over\s+dumbbell|renegade\s+dumbbell)\s+/i, "")
    .trim();
}

function ExercisePreviewPlaceholder({ exercise }) {
  const n = exercise.toLowerCase();
  const isCardio = /jump|rope|jacks|knees|burpee|crawl|climber/.test(n);
  const isCore = /plank|twist|crunch|bicycle|v-up|dead bug|raises|bridge/.test(n);

  return (
    <div className={`exercise-preview-placeholder ${isCardio ? "ep--cardio" : isCore ? "ep--core" : "ep--strength"}`}>
      {isCardio ? (
        /* Running figure */
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="9" r="4" />
          <line x1="24" y1="13" x2="24" y2="27" />
          <line x1="14" y1="19" x2="34" y2="19" />
          <line x1="24" y1="27" x2="16" y2="40" />
          <line x1="24" y1="27" x2="32" y2="40" />
        </svg>
      ) : isCore ? (
        /* Plank figure */
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="26" r="4" />
          <line x1="14" y1="28" x2="40" y2="28" />
          <line x1="40" y1="28" x2="40" y2="20" />
          <circle cx="40" cy="16" r="4" />
          <line x1="10" y1="32" x2="10" y2="40" />
          <line x1="40" y1="32" x2="40" y2="40" />
        </svg>
      ) : (
        /* Dumbbell */
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="20" width="8" height="8" rx="2" />
          <rect x="38" y="20" width="8" height="8" rx="2" />
          <rect x="8" y="16" width="7" height="16" rx="2" />
          <rect x="33" y="16" width="7" height="16" rx="2" />
          <line x1="15" y1="24" x2="33" y2="24" />
        </svg>
      )}
    </div>
  );
}

function ExerciseModal({ exercise, onClose }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const description = exerciseDescriptions[exercise] ?? "A great exercise for your full-body workout.";

  useEffect(() => {
    let cancelled = false;

    async function fetchImage() {
      try {
        const term = toSearchTerm(exercise);
        // wger's text-search endpoint — does icontains matching and returns
        // image URLs directly in a single call, avoiding the exact-match
        // problem of the REST filter endpoint.
        const res = await fetch(
          `https://wger.de/en/exercise/search/?term=${encodeURIComponent(term)}&format=json&language=english`
        );
        if (cancelled || !res.ok) return;
        const data = await res.json();
        if (!data.suggestions?.length) return;

        // Prefer a suggestion whose name contains the first word of the term
        const firstWord = term.split(" ")[0].toLowerCase();
        const best =
          data.suggestions.find(s =>
            s.value.toLowerCase().includes(firstWord)
          ) ?? data.suggestions[0];

        if (best?.data?.image) {
          setImageUrl(best.data.image);
        }
      } catch {
        // Network unavailable or CORS blocked — placeholder will show
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchImage();
    return () => { cancelled = true; };
  }, [exercise]);

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

        <div className="exercise-preview">
          {loading ? (
            <div className="exercise-preview-loading">
              <div className="exercise-preview-spinner" />
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={exercise} className="exercise-preview-img" />
          ) : (
            <ExercisePreviewPlaceholder exercise={exercise} />
          )}
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
        {circuits.map((circuit) => {
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
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
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
