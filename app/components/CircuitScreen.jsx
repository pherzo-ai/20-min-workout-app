'use client';

import { ROUNDS_PER_CIRCUIT, RECOVERY_ROUNDS, WORK_DURATION, REST_DURATION } from "../lib/workoutData";

export default function CircuitScreen({ circuit, isRecovery, onStart, onBack }) {
  const rounds = isRecovery ? RECOVERY_ROUNDS : ROUNDS_PER_CIRCUIT;
  const totalSets = circuit.exercises.length * rounds;
  const totalWorkSeconds = totalSets * WORK_DURATION + (totalSets - 1) * REST_DURATION;
  const totalMinutes = Math.floor(totalWorkSeconds / 60);
  const totalSeconds = totalWorkSeconds % 60;

  return (
    <div className="screen circuit-screen">
      <button className="btn-back" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div className="circuit-screen-header">
        <h1 className="circuit-screen-title">{circuit.name}</h1>
        <p className="circuit-screen-meta">
          {rounds} round{rounds !== 1 ? "s" : ""} &bull; ~{totalMinutes}m {totalSeconds > 0 ? `${totalSeconds}s` : ""}
        </p>
      </div>

      <div className="circuit-screen-info">
        <div className="info-pill">
          <span className="info-label">Work</span>
          <span className="info-value">{WORK_DURATION}s</span>
        </div>
        <div className="info-pill">
          <span className="info-label">Rest</span>
          <span className="info-value">{REST_DURATION}s</span>
        </div>
        <div className="info-pill">
          <span className="info-label">Rounds</span>
          <span className="info-value">{rounds}x</span>
        </div>
      </div>

      <div className="circuit-screen-exercises">
        <h2 className="exercises-heading">Exercises</h2>
        <ol className="exercises-ol">
          {circuit.exercises.map((ex, i) => (
            <li key={i} className="exercises-ol-item">
              <span className="exercises-ol-number">{i + 1}</span>
              <span className="exercises-ol-name">{ex}</span>
              <span className="exercises-ol-duration">{WORK_DURATION}s</span>
            </li>
          ))}
        </ol>
        {rounds > 1 && <p className="repeat-note">Repeat the above {rounds} times</p>}
      </div>

      <button className="btn btn-primary btn-large circuit-go-btn" onClick={onStart}>
        Start Circuit
      </button>
    </div>
  );
}
