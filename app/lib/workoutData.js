export const WORK_DURATION = 45;
export const REST_DURATION = 15;
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

export const circuits = workoutPlans[0].circuits;

export const exerciseDescriptions = {
  "Dumbbell Goblet Squat": "Hold a dumbbell vertically at your chest, feet shoulder-width apart. Sit back and down into a squat, keeping your chest tall and knees tracking over your toes. Drive through your heels to stand.",
  "Push Ups": "Start in a high plank with hands just outside shoulder-width. Lower your chest to the floor keeping elbows at roughly 45°, then press back up. Keep your core braced and body in a straight line throughout.",
  "Jump Rope": "Jump with both feet together (or alternate) while swinging the rope. Stay on the balls of your feet, keep jumps small, and maintain a consistent rhythm.",
  "Dumbbell Bench Press": "Lie on a bench with dumbbells held at chest height. Press straight up until arms are fully extended, then lower with control back to the start. Keep your feet flat and lower back neutral.",
  "Dumbbell Romanian Deadlift": "Stand holding dumbbells in front of your thighs. Hinge at the hips and slide the weights down your legs until you feel a deep hamstring stretch, keeping your back flat. Drive hips forward to return.",
  "Alternating Dumbbell Shoulder Press": "Hold dumbbells at shoulder height. Press one arm fully overhead, lower it, then press the other. Alternate each rep. Keep your core braced to avoid arching your lower back.",
  "Bent-Over Dumbbell Rows": "Hinge forward at the hips until your torso is nearly parallel to the floor. Pull the dumbbells up to your sides, driving your elbows back and squeezing your shoulder blades together. Lower with control.",
  "Renegade Dumbbell Rows": "Start in a high plank holding dumbbells on the floor. Row one dumbbell up to your hip while balancing on the other. Keep your hips level and avoid rotating. Alternate sides each rep.",
  "Bulgarian Split Squats": "Place your rear foot on an elevated surface behind you. Lower your back knee toward the floor, keeping your front shin vertical and chest upright. Drive through your front heel to stand.",
  "Push Up Shoulder Tap": "Perform a push-up. At the top of each rep, lift one hand and tap the opposite shoulder, then alternate. Brace your core and keep your hips from rocking side to side.",
  "Air Squats": "Stand with feet shoulder-width apart. Sit back and down until your thighs reach parallel (or below), keeping your chest up. Drive through your heels to stand, squeezing your glutes at the top.",
  "Jumping Jacks": "Start with feet together and arms at your sides. Jump your feet out wide while raising both arms overhead, then jump back to start. Keep a steady, controlled rhythm.",
  "Glute Bridges": "Lie on your back with knees bent and feet flat. Drive your hips toward the ceiling, squeezing your glutes hard at the top. Hold briefly, then lower with control.",
  "Burpees": "From standing, drop your hands to the floor, jump feet back to a plank, perform a push-up, jump feet to your hands, then explode up with a jump and arms overhead. Move fast but keep your plank tight.",
  "Mountain Climbers": "Hold a high plank position. Drive one knee toward your chest, then quickly switch legs as if running. Keep your hips level and core engaged throughout.",
  "High Knees": "Run in place, driving your knees up to hip height with each step. Pump your arms and stay light on the balls of your feet. Focus on speed and height.",
  "Plank Hold": "Hold a forearm plank (or high plank) with your body in a straight line from head to heels. Squeeze your glutes and brace your core. Breathe steadily and don't let your hips sag or rise.",
  "Jump Squats": "Lower into a squat, then explode upward as high as you can. Land softly with bent knees and immediately sink into the next squat. Keep your chest up and land quietly.",
  "Wide Push Ups": "Perform a push-up with hands placed wider than shoulder-width. The wider grip shifts more emphasis to your chest. Keep elbows at about 45° and body straight.",
  "Reverse Lunges": "Stand tall. Step one foot directly backward and lower your back knee toward the floor without touching it. Push off your front foot to return. Alternate legs each rep.",
  "Bear Crawl": "Start on all fours with knees hovering just off the ground. Move forward by stepping your right hand and left foot simultaneously, then left hand and right foot. Keep your back flat and hips low.",
  "Walking Lunges": "Step forward and lower your back knee toward the floor, then bring your rear foot forward to step into the next lunge. Continue alternating legs and keep your torso upright throughout.",
  "Dumbbell Shoulder Press": "Stand or sit with dumbbells at shoulder height, palms facing forward. Press both dumbbells overhead until arms are fully extended. Lower with control. Keep your core tight.",
  "Dumbbell Bicep Curls": "Stand with dumbbells at your sides, palms facing forward. Curl both up to your shoulders, keeping elbows pinned to your sides. Lower slowly with control.",
  "Dumbbell Thrusters": "Hold dumbbells at shoulder height. Squat down, then as you drive up through your legs, press the dumbbells overhead in one explosive motion. Return dumbbells to shoulders as you descend.",
  "Renegade Rows": "Same as Renegade Dumbbell Rows — high plank on dumbbells, row one side at a time while keeping hips level and braced.",
  "Russian Twists": "Sit with knees bent, feet off the floor, and torso leaned back slightly. Rotate your torso and touch the floor on each side. Optionally hold a weight. Keep your lower back from rounding.",
  "Leg Raises": "Lie flat on your back, legs straight. Raise your legs to 90°, then lower them slowly toward the floor without letting them touch. Keep your lower back pressed into the ground throughout.",
  "Bicycle Crunches": "Lie on your back with hands behind your head. Bring your elbow toward the opposite knee as you extend the other leg, then switch in a cycling motion. Focus on rotation, not pulling your neck.",
  "Dumbbell Deadlift": "Stand with dumbbells in front of your thighs. Hinge at the hips with a flat back, lowering the weights to mid-shin level. Drive through your heels and thrust your hips forward to stand tall.",
  "Dumbbell Swing": "Stand with feet shoulder-width apart, dumbbell held with both hands between your legs. Hinge at the hips and swing the weight forward to shoulder height using hip drive, not your arms. Control the swing back down.",
  "V-Ups": "Lie flat with arms extended overhead. Simultaneously lift your straight legs and your upper body, reaching your hands toward your feet to form a V shape. Lower back down with control.",
  "Plank to Downward Dog": "Start in a high plank. Push your hips up and back into a downward dog (inverted V). Return to plank. Each transition counts as one rep. Breathe steadily.",
  "Side Plank Hip Dips": "Hold a side plank on your forearm. Lower your hip toward the floor, then raise it back above the line. This works your obliques and hip abductors. Keep the movement controlled.",
  "Dead Bug": "Lie on your back with arms extended toward the ceiling and knees bent at 90°. Lower your right arm and left leg simultaneously toward the floor, keeping your lower back pressed down. Return and alternate.",
};
