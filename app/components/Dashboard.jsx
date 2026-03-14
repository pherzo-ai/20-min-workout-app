'use client';

import { useState } from "react";
import { ROUNDS_PER_CIRCUIT, RECOVERY_ROUNDS, exerciseDescriptions } from "../lib/workoutData";

const DB_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";
const WGER_BASE = "https://wger.de/media/exercise-images/";

// Values starting with "wger:" use WGER_BASE; plain strings use DB_BASE with /0.jpg appended.
const EXERCISE_IMAGES = {
  // Work exercises
  "Dumbbell Goblet Squat":              "Goblet_Squat",
  "Push Ups":                           "Pushups",
  "Dumbbell Bench Press":               "Dumbbell_Bench_Press",
  "Dumbbell Romanian Deadlift":         "Romanian_Deadlift",
  "Alternating Dumbbell Shoulder Press":"Dumbbell_Shoulder_Press",
  "Bent-Over Dumbbell Rows":            "Bent_Over_Two-Dumbbell_Row",
  "Renegade Dumbbell Rows":             "Alternating_Renegade_Row",
  "Bulgarian Split Squats":             "Split_Squats",
  "Wide Push Ups":                      "Pushups_Close_and_Wide_Hand_Positions",
  "Push Up Shoulder Tap":               "Pushups",
  "Air Squats":                         "Bodyweight_Squat",
  "Glute Bridges":                      "Single_Leg_Glute_Bridge",
  "Mountain Climbers":                  "Mountain_Climbers",
  "Plank Hold":                         "Plank",
  "Jump Squats":                        "Freehand_Jump_Squat",
  "Reverse Lunges":                     "Crossover_Reverse_Lunge",
  "Walking Lunges":                     "Bodyweight_Walking_Lunge",
  "Bear Crawl":                         "Bear_Crawl_Sled_Drags",
  "Dumbbell Shoulder Press":            "Dumbbell_Shoulder_Press",
  "Dumbbell Bicep Curls":               "Dumbbell_Bicep_Curl",
  "Dumbbell Thrusters":                 "Kettlebell_Thruster",
  "Renegade Rows":                      "Alternating_Renegade_Row",
  "Russian Twists":                     "Russian_Twist",
  "Leg Raises":                         "Front_Leg_Raises",
  "Dumbbell Deadlift":                  "Romanian_Deadlift",
  "Dumbbell Swing":                     "One-Arm_Kettlebell_Swings",
  "Plank to Downward Dog":              "Plank",
  "Side Plank Hip Dips":                "Push_Up_to_Side_Plank",
  "Dead Bug":                           "Dead_Bug",
  // Stretches – Full Body Stretch plan (free-exercise-db where name closely matches)
  "Chest Opener Stretch":               "Chest_And_Front_Of_Shoulder_Stretch",
  "Overhead Tricep Stretch":            "Overhead_Triceps",
  "Cross-Body Shoulder Stretch":        "Shoulder_Stretch",
  "Neck Side Stretch":                  "Side_Neck_Stretch",
  "Standing Hip Flexor Stretch":        "wger:1867/767631e5-10d2-46b8-b03f-cc298f96963b.png",
  "Standing Hamstring Stretch":         "Standing_Hamstring_and_Calf_Stretch",
  "Standing Quad Stretch":              "wger:1873/c0ed299b-6d87-4d90-885d-bb3b5d85f1eb.png",
  "Seated Calf Stretch":                "Seated_Calf_Stretch",
  "Cat-Cow Stretch":                    "Cat_Stretch",
  "Child's Pose":                       "Childs_Pose",
  "Seated Spinal Twist":                "Spinal_Stretch",
  // Stretches – Mobility Flow plan
  "Pigeon Pose":                        "wger:1872/df982df1-512a-4eb9-acd9-68cc1c265df6.png",
  "Figure-Four Stretch":                "wger:1869/c49187bd-9f90-4a7a-b25e-1d50e857a104.png",
  "Deep Squat Hold":                    "Sit_Squats",
  "Hip Circle Stretch":                 "Standing_Hip_Circles",
  "Lat Stretch at Wall":                "Overhead_Lat",
  "Thoracic Rotation Stretch":          "Torso_Rotation",
  "Doorway Chest Stretch":              "One_Arm_Against_Wall",
  "Supine Knee-to-Chest":               "One_Knee_To_Chest",
  "Supine Spinal Twist":                "Lying_Crossover",
  "Happy Baby Pose":                    "Lying_Bent_Leg_Groin",
};

function ExercisePreviewPlaceholder({ exercise }) {
  const n = exercise.toLowerCase();
  const isStretch = /stretch|pose|hold|thread|legs.up|needle/.test(n);
  const isCardio = /jump|rope|jacks|knees|burpee|crawl|climber/.test(n);
  const isCore = /plank|twist|crunch|bicycle|v-up|dead bug|raises|bridge/.test(n);

  return (
    <div className={`exercise-preview-placeholder ${isStretch ? "ep--stretch" : isCardio ? "ep--cardio" : isCore ? "ep--core" : "ep--strength"}`}>
      {isStretch ? (
        /* seated forward-fold figure */
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="10" r="4" />
          <path d="M12 14 Q12 24 30 28" />
          <line x1="8" y1="28" x2="38" y2="28" />
          <line x1="30" y1="28" x2="38" y2="28" />
          <line x1="8" y1="28" x2="8" y2="40" />
          <line x1="22" y1="28" x2="22" y2="40" />
        </svg>
      ) : isCardio ? (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="9" r="4" />
          <line x1="24" y1="13" x2="24" y2="27" />
          <line x1="14" y1="19" x2="34" y2="19" />
          <line x1="24" y1="27" x2="16" y2="40" />
          <line x1="24" y1="27" x2="32" y2="40" />
        </svg>
      ) : isCore ? (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="26" r="4" />
          <line x1="14" y1="28" x2="40" y2="28" />
          <line x1="40" y1="28" x2="40" y2="20" />
          <circle cx="40" cy="16" r="4" />
          <line x1="10" y1="32" x2="10" y2="40" />
          <line x1="40" y1="32" x2="40" y2="40" />
        </svg>
      ) : (
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
  const imageId = EXERCISE_IMAGES[exercise];
  const imageUrl = imageId
    ? imageId.startsWith("wger:")
      ? `${WGER_BASE}${imageId.slice(5)}`
      : `${DB_BASE}${imageId}/0.jpg`
    : null;
  const description = exerciseDescriptions[exercise] ?? "A great exercise for your full-body workout.";

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
          {imageUrl ? (
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

export default function Dashboard({ circuits, completedCircuits, activeCircuit, onSelectCircuit, isRecovery }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const rounds = isRecovery ? RECOVERY_ROUNDS : ROUNDS_PER_CIRCUIT;

  return (
    <div className="screen dashboard-screen">
      <div className="dashboard-header">
        <span className={`workout-type-tag ${isRecovery ? "workout-type-tag--recovery" : "workout-type-tag--workout"}`}>
          {isRecovery ? "Recovery" : "Workout"}
        </span>
        <h1 className="dashboard-title">Your Workout</h1>
        <p className="dashboard-subtitle">
          {isRecovery
            ? "Move through each circuit at your own pace"
            : "Complete all 3 circuits to finish your 20-minute workout"}
        </p>
      </div>

      <div className="circuit-list">
        {circuits.map((circuit) => {
          const isCompleted = completedCircuits.includes(circuit.id);
          const isCurrent = activeCircuit === circuit.id;

          return (
            <div
              key={circuit.id}
              className={`circuit-card ${isRecovery ? "circuit-card--recovery" : "circuit-card--workout"} ${isCompleted ? "circuit-card--completed" : ""} ${isCurrent ? "circuit-card--active" : ""}`}
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
                  {rounds} round{rounds !== 1 ? "s" : ""} &bull; {circuit.exercises.length} exercises
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
