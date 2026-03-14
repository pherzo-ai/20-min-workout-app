'use client';

export default function Landing({ onStart }) {
  return (
    <div className="screen landing-screen">
      <div className="landing-content">
        <div className="landing-icon">💪</div>
        <h1 className="landing-title">20-Minute Workout</h1>
        <p className="landing-subtitle">
          3 circuits &bull; 4 exercises each &bull; 2 rounds per circuit
        </p>
        <div className="landing-details">
          <div className="detail-pill">
            <span className="detail-label">Work</span>
            <span className="detail-value">35s</span>
          </div>
          <div className="detail-pill">
            <span className="detail-label">Rest</span>
            <span className="detail-value">15s</span>
          </div>
        </div>
        <button className="btn btn-primary btn-large" onClick={onStart}>
          Start Workout
        </button>
      </div>
    </div>
  );
}
