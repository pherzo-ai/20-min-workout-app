import { useState, useRef, useEffect } from "react";
import { WORK_DURATION, REST_DURATION, ROUNDS_PER_CIRCUIT } from "../workoutData";

function buildSequence(exercises) {
  const sequence = [];
  for (let round = 1; round <= ROUNDS_PER_CIRCUIT; round++) {
    exercises.forEach((ex, idx) => {
      sequence.push({ type: "work", exercise: ex, round, exerciseIndex: idx });
      const isLast = round === ROUNDS_PER_CIRCUIT && idx === exercises.length - 1;
      if (!isLast) {
        sequence.push({ type: "rest", exercise: ex, nextExercise: exercises[idx + 1] || exercises[0], round, exerciseIndex: idx });
      }
    });
  }
  return sequence;
}

function CircularProgress({ progress, phase }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;
  return (
    <svg className="timer-ring" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--ring-track)" strokeWidth="12" />
      <circle
        cx="100" cy="100" r={radius}
        fill="none"
        stroke={phase === "work" ? "var(--ring-work)" : "var(--ring-rest)"}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke 0.3s" }}
        transform="rotate(-90 100 100)"
      />
    </svg>
  );
}

export default function TimerScreen({ circuit, onComplete, onBack }) {
  const sequence = useRef(buildSequence(circuit.exercises));
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [displayTime, setDisplayTime] = useState(null);
  const [progress, setProgress] = useState(1);

  // All mutable timing state lives in refs so the RAF loop always sees current values
  const rafRef = useRef(null);
  const stepIndexRef = useRef(0);
  const stepStartRef = useRef(null);
  const stepDurationRef = useRef(null);
  const pausedElapsedRef = useRef(0);
  const isPausedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // tickRef holds the RAF callback — defined as a ref so it always reads latest values
  const tickRef = useRef(null);
  tickRef.current = () => {
    if (isPausedRef.current) return;
    const elapsed = performance.now() - stepStartRef.current;
    const remaining = Math.max(0, stepDurationRef.current - elapsed);
    setDisplayTime(Math.ceil(remaining / 1000));
    setProgress(remaining / stepDurationRef.current);
    if (remaining <= 0) {
      const nextIndex = stepIndexRef.current + 1;
      if (nextIndex >= sequence.current.length) {
        setIsRunning(false);
        onCompleteRef.current();
        return;
      }
      // Brief pause between steps for visual clarity, then auto-start next
      setTimeout(() => startStep(nextIndex), 300);
      return;
    }
    rafRef.current = requestAnimationFrame(() => tickRef.current());
  };

  const cancelRaf = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const startStep = (index) => {
    const step = sequence.current[index];
    const durationMs = (step.type === "work" ? WORK_DURATION : REST_DURATION) * 1000;
    stepIndexRef.current = index;
    stepDurationRef.current = durationMs;
    stepStartRef.current = performance.now();
    pausedElapsedRef.current = 0;
    isPausedRef.current = false;
    setStepIndex(index);
    setProgress(1);
    setDisplayTime(step.type === "work" ? WORK_DURATION : REST_DURATION);
    cancelRaf();
    rafRef.current = requestAnimationFrame(() => tickRef.current());
  };

  const handleStart = () => {
    setIsRunning(true);
    startStep(0);
  };

  const handlePauseResume = () => {
    if (!isPausedRef.current) {
      isPausedRef.current = true;
      pausedElapsedRef.current = performance.now() - stepStartRef.current;
      cancelRaf();
      setIsPaused(true);
    } else {
      isPausedRef.current = false;
      stepStartRef.current = performance.now() - pausedElapsedRef.current;
      setIsPaused(false);
      rafRef.current = requestAnimationFrame(() => tickRef.current());
    }
  };

  const handleSkip = () => {
    cancelRaf();
    isPausedRef.current = false;
    const nextIndex = stepIndexRef.current + 1;
    if (nextIndex >= sequence.current.length) {
      setIsRunning(false);
      onCompleteRef.current();
      return;
    }
    setIsPaused(false);
    startStep(nextIndex);
  };

  useEffect(() => () => cancelRaf(), []);

  const currentStep = sequence.current[stepIndex];
  const phase = currentStep?.type || "work";
  const duration = phase === "work" ? WORK_DURATION : REST_DURATION;

  const workSteps = sequence.current.filter((s) => s.type === "work");
  const completedSets = workSteps.filter((_, i) => {
    const si = sequence.current.indexOf(workSteps[i]);
    return si < stepIndex;
  }).length;

  const nextStep = sequence.current[stepIndex + 1];

  return (
    <div className={`screen timer-screen timer-screen--${phase}`}>
      <button className="btn-back" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div className="timer-header">
        <h2 className="timer-circuit-name">{circuit.name}</h2>
        {isRunning && (
          <div className="timer-set-counter">
            Set {completedSets + 1} of {workSteps.length}
          </div>
        )}
      </div>

      {isRunning && (
        <div className="round-badges">
          {Array.from({ length: ROUNDS_PER_CIRCUIT }, (_, i) => {
            const roundNum = i + 1;
            const isCurrentRound = currentStep?.round === roundNum;
            const isPastRound = currentStep && currentStep.round > roundNum;
            return (
              <div
                key={i}
                className={`round-badge ${isPastRound ? "round-badge--done" : ""} ${isCurrentRound ? "round-badge--active" : ""}`}
              >
                Round {roundNum}
              </div>
            );
          })}
        </div>
      )}

      <div className="timer-body">
        {!isRunning ? (
          <div className="timer-idle">
            <div className="timer-idle-text">Ready?</div>
            <div className="timer-idle-sub">Your timer will start automatically</div>
          </div>
        ) : (
          <>
            <div className="timer-ring-container">
              <CircularProgress progress={progress} phase={phase} />
              <div className="timer-ring-inner">
                <div className={`timer-phase-label timer-phase-label--${phase}`}>
                  {phase === "work" ? "WORK" : "REST"}
                </div>
                <div className="timer-countdown">{displayTime ?? duration}</div>
                <div className="timer-unit">seconds</div>
              </div>
            </div>

            <div className="timer-exercise">
              {phase === "work" ? (
                <>
                  <div className="timer-exercise-name">{currentStep?.exercise}</div>
                  <div className="timer-round-tag">Round {currentStep?.round}</div>
                </>
              ) : (
                <div className="timer-rest-info">
                  <span className="timer-rest-label">Up next:</span>
                  <span className="timer-rest-next">{nextStep?.exercise}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isRunning && (
        <div className="exercise-progress">
          {circuit.exercises.map((ex, i) => (
            <div key={i} className="exercise-dot-group">
              <div className="exercise-dot-label">{circuit.labels?.[i] ?? ex.split(" ").slice(-1)[0]}</div>
              <div className="exercise-dot-row">
                {Array.from({ length: ROUNDS_PER_CIRCUIT }, (_, r) => {
                  const rNum = r + 1;
                  let dotState = "pending";
                  if (rNum < (currentStep?.round ?? 1)) dotState = "done";
                  else if (rNum === (currentStep?.round ?? 1)) {
                    if (phase === "work") {
                      if (currentStep.exerciseIndex > i) dotState = "done";
                      else if (currentStep.exerciseIndex === i) dotState = "active";
                    } else {
                      // during rest: the exercise at exerciseIndex just finished
                      if (currentStep.exerciseIndex >= i) dotState = "done";
                    }
                  }
                  return <div key={r} className={`exercise-dot exercise-dot--${dotState}`} />;
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="timer-controls">
        {!isRunning ? (
          <button className="btn btn-primary btn-large" onClick={handleStart}>
            Begin
          </button>
        ) : (
          <div className="timer-buttons">
            <button className="btn btn-ghost" onClick={handlePauseResume}>
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button className="btn btn-secondary" onClick={handleSkip}>
              Skip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
