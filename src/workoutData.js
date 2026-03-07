export const WORK_DURATION = 45; // seconds
export const REST_DURATION = 15; // seconds
export const ROUNDS_PER_CIRCUIT = 2;

export const workoutPlans = [
  {
    id: "plan-dumbbell",
    name: "Dumbbell Full Body",
    description: "Classic full-body workout with dumbbells and jump rope intervals.",
    equipment: ["Dumbbells", "Jump Rope"],
    circuits: [
      {
        id: 1,
        name: "Circuit 1",
        exercises: ["Dumbbell Goblet Squat", "Push Ups", "Jump Rope", "Dumbbell Bench Press"],
        labels: ["Squats", "Pushups", "Jumprope", "Presses"],
      },
      {
        id: 2,
        name: "Circuit 2",
        exercises: ["Dumbbell Romanian Deadlift", "Alternating Dumbbell Shoulder Press", "Bent-Over Dumbbell Rows", "Jump Rope"],
        labels: ["Deadlifts", "Presses", "Rows", "Jumprope"],
      },
      {
        id: 3,
        name: "Circuit 3",
        exercises: ["Renegade Dumbbell Rows", "Bulgarian Split Squats", "Push Up Shoulder Tap", "Jump Rope"],
        labels: ["Rows", "Squats", "Taps", "Jumprope"],
      },
    ],
  },
  {
    id: "plan-bodyweight",
    name: "Bodyweight Only",
    description: "Zero equipment needed. Pure bodyweight movements for a full-body burn.",
    equipment: ["None"],
    circuits: [
      {
        id: 1,
        name: "Circuit 1",
        exercises: ["Air Squats", "Push Ups", "Jumping Jacks", "Glute Bridges"],
        labels: ["Squats", "Pushups", "Jacks", "Bridges"],
      },
      {
        id: 2,
        name: "Circuit 2",
        exercises: ["Burpees", "Mountain Climbers", "High Knees", "Plank Hold"],
        labels: ["Burpees", "Climbers", "High Knees", "Plank"],
      },
      {
        id: 3,
        name: "Circuit 3",
        exercises: ["Jump Squats", "Wide Push Ups", "Reverse Lunges", "Bear Crawl"],
        labels: ["Jump Sq.", "Wide Ups", "Lunges", "Crawl"],
      },
    ],
  },
  {
    id: "plan-upper-lower",
    name: "Upper / Lower Split",
    description: "Dedicated upper and lower body circuits with a full-body finisher.",
    equipment: ["Dumbbells", "Jump Rope"],
    circuits: [
      {
        id: 1,
        name: "Lower Body",
        exercises: ["Dumbbell Goblet Squat", "Dumbbell Romanian Deadlift", "Walking Lunges", "Jump Rope"],
        labels: ["Squats", "Deadlifts", "Lunges", "Jumprope"],
      },
      {
        id: 2,
        name: "Upper Body",
        exercises: ["Dumbbell Bench Press", "Bent-Over Dumbbell Rows", "Dumbbell Shoulder Press", "Dumbbell Bicep Curls"],
        labels: ["Press", "Rows", "Shoulder", "Curls"],
      },
      {
        id: 3,
        name: "Full Body Finisher",
        exercises: ["Dumbbell Thrusters", "Renegade Rows", "Burpees", "Jump Rope"],
        labels: ["Thrusters", "Rows", "Burpees", "Jumprope"],
      },
    ],
  },
  {
    id: "plan-core",
    name: "Core & Cardio",
    description: "Core stability, anti-rotation strength, and cardio intervals.",
    equipment: ["Dumbbells", "Mat", "Jump Rope"],
    circuits: [
      {
        id: 1,
        name: "Circuit 1",
        exercises: ["Jump Rope", "Russian Twists", "Mountain Climbers", "Leg Raises"],
        labels: ["Jumprope", "Twists", "Climbers", "Leg Raises"],
      },
      {
        id: 2,
        name: "Circuit 2",
        exercises: ["Dumbbell Deadlift", "Bicycle Crunches", "Dumbbell Swing", "V-Ups"],
        labels: ["Deadlifts", "Bicycle", "Swings", "V-Ups"],
      },
      {
        id: 3,
        name: "Circuit 3",
        exercises: ["Jump Rope", "Plank to Downward Dog", "Side Plank Hip Dips", "Dead Bug"],
        labels: ["Jumprope", "Dog Plank", "Side Plank", "Dead Bug"],
      },
    ],
  },
];

// Default circuits (plan 1) — kept for backward compatibility
export const circuits = workoutPlans[0].circuits;
