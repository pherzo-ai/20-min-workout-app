'use client';

export default function WorkoutComplete({ onRestart }) {
  return (
    <div className="screen complete-screen">
      <div className="complete-content">
        <div className="complete-icon">🏆</div>
        <h1 className="complete-title">Workout Complete!</h1>
        <p className="complete-subtitle">
          You crushed all 3 circuits. Great work!
        </p>
        <div className="complete-stats">
          <div className="stat-item">
            <span className="stat-value">3</span>
            <span className="stat-label">Circuits</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">24</span>
            <span className="stat-label">Sets</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">~20</span>
            <span className="stat-label">Minutes</span>
          </div>
        </div>
        <button className="btn btn-primary btn-large" onClick={onRestart}>
          Start Over
        </button>
      </div>
    </div>
  );
}
