'use client';

import { useState, useEffect } from "react";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import CircuitScreen from "./components/CircuitScreen";
import TimerScreen from "./components/TimerScreen";
import WorkoutComplete from "./components/WorkoutComplete";
import BottomNav from "./components/BottomNav";
import CalendarScreen from "./components/CalendarScreen";
import SettingsScreen from "./components/SettingsScreen";
import { workoutPlans } from "./lib/workoutData";

function loadStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

export default function Home() {
  const [view, setView] = useState("landing");
  const [activePlanId, setActivePlanId] = useState(() => loadStorage("activePlanId", workoutPlans[0].id));
  const [completedCircuits, setCompletedCircuits] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState(() => loadStorage("workoutHistory", []));
  const [mounted, setMounted] = useState(false);

  const activePlan = workoutPlans.find(p => p.id === activePlanId) ?? workoutPlans[0];
  const circuits = activePlan.circuits;
  const [activeCircuitId, setActiveCircuitId] = useState(circuits[0].id);
  const activeCircuit = circuits.find(c => c.id === activeCircuitId) ?? circuits[0];

  useEffect(() => {
    setMounted(true);
    const storedPlanId = loadStorage("activePlanId", workoutPlans[0].id);
    const storedHistory = loadStorage("workoutHistory", []);
    setActivePlanId(storedPlanId);
    setWorkoutHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("activePlanId", JSON.stringify(activePlanId));
    }
  }, [activePlanId, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory));
    }
  }, [workoutHistory, mounted]);

  const handleStartWorkout = () => setView("dashboard");

  const handleSelectCircuit = (circuitId) => {
    setActiveCircuitId(circuitId);
    setView("circuit-detail");
  };

  const handleStartCircuit = () => setView("timer");

  const handleCircuitComplete = () => {
    const updated = [...completedCircuits, activeCircuitId];
    setCompletedCircuits(updated);
    if (updated.length === circuits.length) {
      const today = new Date().toISOString().slice(0, 10);
      setWorkoutHistory(prev => prev.includes(today) ? prev : [...prev, today]);
      setView("complete");
    } else {
      const nextCircuit = circuits.find(c => !updated.includes(c.id));
      if (nextCircuit) setActiveCircuitId(nextCircuit.id);
      setView("dashboard");
    }
  };

  const handleRestart = () => {
    setCompletedCircuits([]);
    setActiveCircuitId(circuits[0].id);
    setView("landing");
  };

  const handleSelectPlan = (planId) => {
    setActivePlanId(planId);
    const plan = workoutPlans.find(p => p.id === planId);
    setActiveCircuitId(plan.circuits[0].id);
    setCompletedCircuits([]);
  };

  const handleNavTab = (tab) => {
    if (tab === "workout") {
      if (completedCircuits.length === circuits.length) {
        setCompletedCircuits([]);
        setActiveCircuitId(circuits[0].id);
      }
      setView("dashboard");
    } else {
      setView(tab);
    }
  };

  const showNav = ["dashboard", "calendar", "settings"].includes(view);
  const activeTab = view === "calendar" ? "calendar" : view === "settings" ? "settings" : null;

  return (
    <div className={`app ${showNav ? "app--with-nav" : ""}`}>
      {view === "landing" && <Landing onStart={handleStartWorkout} />}
      {view === "dashboard" && (
        <Dashboard
          circuits={circuits}
          completedCircuits={completedCircuits}
          activeCircuit={activeCircuitId}
          onSelectCircuit={handleSelectCircuit}
        />
      )}
      {view === "circuit-detail" && activeCircuit && (
        <CircuitScreen
          circuit={activeCircuit}
          onStart={handleStartCircuit}
          onBack={() => setView("dashboard")}
        />
      )}
      {view === "timer" && activeCircuit && (
        <TimerScreen
          circuit={activeCircuit}
          onComplete={handleCircuitComplete}
          onBack={() => setView("circuit-detail")}
        />
      )}
      {view === "complete" && <WorkoutComplete onRestart={handleRestart} />}
      {view === "calendar" && <CalendarScreen workoutHistory={workoutHistory} />}
      {view === "settings" && (
        <SettingsScreen activePlanId={activePlanId} onSelectPlan={handleSelectPlan} />
      )}
      {showNav && <BottomNav activeTab={activeTab} onTabChange={handleNavTab} />}
    </div>
  );
}
