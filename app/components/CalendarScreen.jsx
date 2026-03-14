'use client';

import { useState } from "react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const days = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrev - i, current: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true });
  }
  const fill = 42 - days.length;
  for (let i = 1; i <= fill; i++) {
    days.push({ day: i, current: false });
  }
  return days;
}

export default function CalendarScreen({ workoutHistory, recoveryHistory = [] }) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const grid = getCalendarGrid(viewYear, viewMonth);
  const todayStr = now.toISOString().slice(0, 10);
  const workoutSet = new Set(workoutHistory);
  const recoverySet = new Set(recoveryHistory);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const monthWorkouts = workoutHistory.filter(d => {
    const [y, m] = d.split("-").map(Number);
    return y === viewYear && m - 1 === viewMonth;
  }).length;

  const monthRecovery = recoveryHistory.filter(d => {
    const [y, m] = d.split("-").map(Number);
    return y === viewYear && m - 1 === viewMonth;
  }).length;

  const totalAll = workoutHistory.length + recoveryHistory.length;

  return (
    <div className="screen calendar-screen">
      <div className="calendar-header">
        <h1 className="calendar-title">Workout History</h1>
        <p className="calendar-subtitle">
          {totalAll === 0
            ? "Complete your first workout to start tracking!"
            : `${workoutHistory.length} workout${workoutHistory.length === 1 ? "" : "s"} · ${recoveryHistory.length} recovery`}
        </p>
      </div>

      <div className="calendar-card">
        <div className="calendar-nav">
          <button className="calendar-nav-btn" onClick={prevMonth} aria-label="Previous month">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="calendar-month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
          <button className="calendar-nav-btn" onClick={nextMonth} aria-label="Next month">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="calendar-day-names">
          {DAY_NAMES.map(d => <div key={d} className="cal-day-name">{d}</div>)}
        </div>

        <div className="calendar-grid">
          {grid.map((cell, idx) => {
            const dateStr = cell.current
              ? `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`
              : null;
            const isToday = dateStr === todayStr;
            const isWorkout = dateStr && workoutSet.has(dateStr);
            const isRecovery = dateStr && recoverySet.has(dateStr);
            return (
              <div
                key={idx}
                className={[
                  "cal-day",
                  !cell.current ? "cal-day--other" : "",
                  isToday ? "cal-day--today" : "",
                  isWorkout ? "cal-day--workout" : "",
                  isRecovery && !isWorkout ? "cal-day--recovery" : "",
                ].filter(Boolean).join(" ")}
              >
                {cell.day}
                {isWorkout && <div className="cal-day-dot" />}
                {isRecovery && <div className="cal-day-dot cal-day-dot--recovery" />}
              </div>
            );
          })}
        </div>

        {(monthWorkouts > 0 || monthRecovery > 0) && (
          <div className="calendar-month-count">
            {monthWorkouts > 0 && `${monthWorkouts} workout${monthWorkouts !== 1 ? "s" : ""}`}
            {monthWorkouts > 0 && monthRecovery > 0 && " · "}
            {monthRecovery > 0 && `${monthRecovery} recovery`}
            {" this month"}
          </div>
        )}

        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-dot" />
            <span>Workout</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot legend-dot--recovery" />
            <span>Recovery</span>
          </div>
        </div>
      </div>

      {totalAll > 0 && (
        <div className="calendar-stats">
          <div className="cal-stat">
            <div className="cal-stat-value">{workoutHistory.length}</div>
            <div className="cal-stat-label">Workouts</div>
          </div>
          <div className="cal-stat-divider" />
          <div className="cal-stat">
            <div className="cal-stat-value cal-stat-value--recovery">{recoveryHistory.length}</div>
            <div className="cal-stat-label">Recovery</div>
          </div>
          <div className="cal-stat-divider" />
          <div className="cal-stat">
            <div className="cal-stat-value">
              {(() => {
                const allDates = [...new Set([...workoutHistory, ...recoveryHistory])];
                if (allDates.length < 2) return allDates.length;
                const sorted = allDates.sort();
                let streak = 1;
                let max = 1;
                for (let i = 1; i < sorted.length; i++) {
                  const diff = (new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000;
                  if (diff === 1) { streak++; max = Math.max(max, streak); }
                  else streak = 1;
                }
                return max;
              })()}
            </div>
            <div className="cal-stat-label">Best Streak</div>
          </div>
        </div>
      )}
    </div>
  );
}
