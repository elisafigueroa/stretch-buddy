export const routines = [
  {
    id: 'morning-reset',
    name: 'Morning Reset',
    description: 'A quick 5-minute routine to energize your body and mind',
    duration: 5,
    difficulty: 'beginner',
    stretches: [
      {
        id: 'neck-roll',
        duration: 30,
        instructions: 'Gently roll your neck in circles, both clockwise and counterclockwise'
      },
      {
        id: 'chest-opener',
        duration: 30,
        instructions: 'Interlace fingers behind back, lift arms and open chest'
      },
      {
        id: 'cat-cow',
        duration: 30,
        instructions: 'Alternate between arching and rounding your back'
      },
      {
        id: 'shoulder-rolls',
        duration: 30,
        instructions: 'Roll shoulders forward and backward'
      }
    ],
    restBetween: 10,
    tags: ['energizing', 'short', 'desk-friendly']
  },
  {
    id: 'desk-reset',
    name: 'Desk Reset',
    description: 'Release tension from sitting at your desk',
    duration: 8,
    difficulty: 'beginner',
    stretches: [
      {
        id: 'wrist-flexor',
        duration: 30,
        instructions: 'Extend arm, pull fingers back gently'
      },
      {
        id: 'seated-twist',
        duration: 30,
        instructions: 'Twist torso while seated, hold each side'
      },
      {
        id: 'forward-fold',
        duration: 30,
        instructions: 'Fold forward from hips, let arms hang'
      },
      {
        id: 'hip-flexor',
        duration: 30,
        instructions: 'Lunge position, stretch front of hip'
      }
    ],
    restBetween: 10,
    tags: ['desk-friendly', 'posture', 'quick']
  },
  {
    id: 'bedtime-flow',
    name: 'Bedtime Flow',
    description: 'Gentle stretches to prepare for sleep',
    duration: 10,
    difficulty: 'beginner',
    stretches: [
      {
        id: 'childs-pose',
        duration: 60,
        instructions: 'Kneel and fold forward, arms extended'
      },
      {
        id: 'seated-forward-fold',
        duration: 60,
        instructions: 'Sit with legs extended, fold forward'
      },
      {
        id: 'supine-twist',
        duration: 60,
        instructions: 'Lie on back, twist knees to each side'
      },
      {
        id: 'happy-baby',
        duration: 60,
        instructions: 'Lie on back, hold feet, rock gently'
      }
    ],
    restBetween: 15,
    tags: ['relaxing', 'evening', 'flexibility']
  }
];

export const getRoutineById = (id) => {
  return routines.find(routine => routine.id === id);
};

export const getRoutinesByTag = (tag) => {
  return routines.filter(routine => routine.tags.includes(tag));
};

export const getRoutinesByDifficulty = (difficulty) => {
  return routines.filter(routine => routine.difficulty === difficulty);
}; 