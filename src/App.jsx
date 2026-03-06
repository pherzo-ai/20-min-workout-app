import { useState } from "react";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import CircuitScreen from "./components/CircuitScreen";
import TimerScreen from "./components/TimerScreen";
import WorkoutComplete from "./components/WorkoutComplete";
import { circuits } from "./workoutData";
import "./App.css";

// Views: "landing" | "dashboard" | "circuit-detail" | "timer" | "complete"

export default function App() {
  const [view, setView] = useState("landing");
  const [completedCircuits, setCompletedCircuits] = useState([]);
  const [activeCircuitId, setActiveCircuitId] = useState(circuits[0].id);

  const activeCircuit = circuits.find((c) => c.id === activeCircuitId);

  const handleStartWorkout = () => {
    setView("dashboard");
  };

  const handleSelectCircuit = (circuitId) => {
    setActiveCircuitId(circuitId);
    setView("circuit-detail");
  };

  const handleStartCircuit = () => {
    setView("timer");
  };

  const handleCircuitComplete = () => {
    const updated = [...completedCircuits, activeCircuitId];
    setCompletedCircuits(updated);

    if (updated.length === circuits.length) {
      setView("complete");
    } else {
      // Find next incomplete circuit
      const nextCircuit = circuits.find((c) => !updated.includes(c.id));
      if (nextCircuit) setActiveCircuitId(nextCircuit.id);
      setView("dashboard");
    }
  };

  const handleRestart = () => {
    setCompletedCircuits([]);
    setActiveCircuitId(circuits[0].id);
    setView("landing");
  };

  const handleBackToDashboard = () => {
    setView("dashboard");
  };

  const handleBackToCircuitDetail = () => {
    setView("circuit-detail");
  };

  return (
    <div className="app">
      {view === "landing" && (
        <Landing onStart={handleStartWorkout} />
      )}
      {view === "dashboard" && (
        <Dashboard
          completedCircuits={completedCircuits}
          activeCircuit={activeCircuitId}
          onSelectCircuit={handleSelectCircuit}
        />
      )}
      {view === "circuit-detail" && activeCircuit && (
        <CircuitScreen
          circuit={activeCircuit}
          onStart={handleStartCircuit}
          onBack={handleBackToDashboard}
        />
      )}
      {view === "timer" && activeCircuit && (
        <TimerScreen
          circuit={activeCircuit}
          onComplete={handleCircuitComplete}
          onBack={handleBackToCircuitDetail}
        />
      )}
      {view === "complete" && (
        <WorkoutComplete onRestart={handleRestart} />
      )}
    </div>
  );
}
