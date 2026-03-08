import { useState, useEffect } from "react";
import { ROUNDS_PER_CIRCUIT, exerciseDescriptions } from "../workoutData";

// Maps our exercise names to wger's naming convention for reliable search
const WGER_SEARCH_TERMS = {
  "Dumbbell Goblet Squat":              "Goblet squat",
  "Push Ups":                           "Push-up",
  "Wide Push Ups":                      "Push-up",
  "Push Up Shoulder Tap":               "Push-up",
  "Jump Rope":                          "Jump rope",
  "Dumbbell Bench Press":               "Bench Press",
  "Dumbbell Romanian Deadlift":         "Romanian deadlift",
  "Alternating Dumbbell Shoulder Press":"Shoulder Press",
  "Dumbbell Shoulder Press":            "Shoulder Press",
  "Bent-Over Dumbbell Rows":            "Bent-over row",
  "Renegade Dumbbell Rows":             "Bent-over row",
  "Renegade Rows":                      "Bent-over row",
  "Bulgarian Split Squats":             "Bulgarian split squat",
  "Air Squats":                         "Squat",
  "Jumping Jacks":                      "Jumping Jacks",
  "Glute Bridges":                      "Glute bridge",
  "Burpees":                            "Burpee",
  "Mountain Climbers":                  "Mountain Climber",
  "High Knees":                         "High Knees",
  "Plank Hold":                         "Plank",
  "Jump Squats":                        "Jump squat",
  "Reverse Lunges":                     "Lunge",
  "Walking Lunges":                     "Lunge",
  "Bear Crawl":                         "Bear crawl",
  "Dumbbell Bicep Curls":               "Bicep curl",
  "Dumbbell Thrusters":                 "Thruster",
  "Russian Twists":                     "Russian Twist",
  "Leg Raises":                         "Leg Raise",
  "Bicycle Crunches":                   "Bicycle crunch",
  "Dumbbell Deadlift":                  "Deadlift",
  "Dumbbell Swing":                     "Kettlebell swing",
  "V-Ups":                              "V-Up",
  "Plank to Downward Dog":              "Plank",
  "Side Plank Hip Dips":                "Side plank",
  "Dead Bug":                           "Dead bug",
};

function toSearchTerm(name) {
  return (
    WGER_SEARCH_TERMS[name] ??
    name
      .replace(/^(dumbbell|barbell|kettlebell|alternating\s+dumbbell\s+|bent-over\s+dumbbell\s+|renegade\s+dumbbell\s+)\s*/i, "")
      .trim()
  );
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

        // Step 1: find exercise translation using the CORS-safe REST API.
        // The name filter can silently return all exercises when it doesn't
        // match, so we validate the result ourselves before trusting it.
        const res = await fetch(
          `https://wger.de/api/v2/exercise/?format=json&language=2&status=2&limit=10&name=${encodeURIComponent(term)}`
        );
        if (cancelled || !res.ok) return;
        const data = await res.json();
        if (!data.results?.length) return;

        // Only accept a result whose name actually contains a keyword from
        // our search term.  This prevents the case where the name filter is
        // ignored and we accidentally display the first exercise in the DB
        // for every modal.
        const keywords = term
          .toLowerCase()
          .replace(/[-/]/g, " ")
          .split(/\s+/)
          .filter(w => w.length > 2);

        const match = data.results.find(r => {
          const rName = (r.name ?? "").toLowerCase().replace(/[-/]/g, " ");
          return keywords.some(kw => rName.includes(kw));
        });
        if (!match) return;

        // Step 2: fetch the main image for the matched exercise base.
        const baseId = match.exercise_base;
        if (!baseId) return;

        const imgRes = await fetch(
          `https://wger.de/api/v2/exerciseimage/?format=json&exercise_base=${baseId}&is_main=true`
        );
        if (cancelled || !imgRes.ok) return;
        const imgData = await imgRes.json();
        if (imgData.results?.length) {
          setImageUrl(imgData.results[0].image);
        }
      } catch {
        // Network error — placeholder will show
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
