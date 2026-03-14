'use client';

import { useState, useRef, useEffect } from "react";
import { WORK_DURATION, REST_DURATION, ROUND_REST_DURATION, ROUNDS_PER_CIRCUIT } from "../lib/workoutData";

function tone(ctx, freq, startTime, durationSec, gainValue = 0.28) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.01);
  gain.gain.setValueAtTime(gainValue, startTime + durationSec - 0.015);
  gain.gain.linearRampToValueAtTime(0, startTime + durationSec);
  osc.start(startTime);
  osc.stop(startTime + durationSec);
}

function playWorkStart(ctx) {
  const t = ctx.currentTime;
  tone(ctx, 440, t,        0.08);
  tone(ctx, 554, t + 0.10, 0.08);
  tone(ctx, 660, t + 0.20, 0.14);
}

function playRestStart(ctx) {
  const t = ctx.currentTime;
  tone(ctx, 660, t,        0.10);
  tone(ctx, 440, t + 0.13, 0.22);
}

function playCountdownBeep(ctx) {
  tone(ctx, 880, ctx.currentTime, 0.07, 0.18);
}

function buildSequence(exercises) {
  const sequence = [];
  for (let round = 1; round <= ROUNDS_PER_CIRCUIT; round++) {
    exercises.forEach((ex, idx) => {
      sequence.push({ type: "work", exercise: ex, round, exerciseIndex: idx });
      const isLastOfCircuit = round === ROUNDS_PER_CIRCUIT && idx === exercises.length - 1;
      if (!isLastOfCircuit) {
        const isLastOfRound = idx === exercises.length - 1;
        sequence.push({ type: "rest", exercise: ex, nextExercise: exercises[idx + 1] || exercises[0], round, exerciseIndex: idx, betweenRounds: isLastOfRound });
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

  const rafRef = useRef(null);
  const stepIndexRef = useRef(0);
  const stepStartRef = useRef(null);
  const stepDurationRef = useRef(null);
  const pausedElapsedRef = useRef(0);
  const isPausedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const audioCtxRef = useRef(null);
  const lastCountdownSecRef = useRef(null);

  const tickRef = useRef(null);
  tickRef.current = () => {
    if (isPausedRef.current) return;
    const elapsed = performance.now() - stepStartRef.current;
    const remaining = Math.max(0, stepDurationRef.current - elapsed);
    const secsLeft = Math.ceil(remaining / 1000);
    setDisplayTime(secsLeft);
    setProgress(remaining / stepDurationRef.current);

    if (secsLeft <= 3 && secsLeft > 0 && secsLeft !== lastCountdownSecRef.current) {
      lastCountdownSecRef.current = secsLeft;
      const ctx = audioCtxRef.current;
      if (ctx) playCountdownBeep(ctx);
    }
    if (remaining <= 0) {
      const nextIndex = stepIndexRef.current + 1;
      if (nextIndex >= sequence.current.length) {
        setIsRunning(false);
        onCompleteRef.current();
        return;
      }
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
    const restDuration = step.betweenRounds ? ROUND_REST_DURATION : REST_DURATION;
    const stepDuration = step.type === "work" ? WORK_DURATION : restDuration;
    const durationMs = stepDuration * 1000;
    stepIndexRef.current = index;
    stepDurationRef.current = durationMs;
    stepStartRef.current = performance.now();
    pausedElapsedRef.current = 0;
    isPausedRef.current = false;
    lastCountdownSecRef.current = null;
    setStepIndex(index);
    setProgress(1);
    setDisplayTime(stepDuration);
    cancelRaf();

    const ctx = audioCtxRef.current;
    if (ctx) {
      ctx.resume().then(() => {
        if (step.type === "work") playWorkStart(ctx);
        else playRestStart(ctx);
      });
    }

    rafRef.current = requestAnimationFrame(() => tickRef.current());
  };

  const handleStart = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
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
            <button className="btn btn-primary" onClick={handlePauseResume}>
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button className="btn btn-ghost" onClick={handleSkip}>
              Skip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
