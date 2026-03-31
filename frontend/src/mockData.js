// ============================================================
//  MOCK DATA — replace each export with a real API call
//  when the backend is ready. All UI components import from
//  here so there is exactly ONE place to change.
// ============================================================

export const CURRENT_USER = {
  id: "u1",
  name: "Manya Kaushik",
  initials: "MK",
  level: 12,
  xp: 2450,
  xpToNext: 3000,
  streak: 12,
  avatarUrl: "https://i.pravatar.cc/150?img=47",
};

// ---------- MY LEARNING ----------
export const MY_RESOURCES = [
  {
    id: "r1",
    platform: "YouTube",
    platformColor: "red",
    title: "Neural Networks from Scratch — Sentdex",
    duration: "4h 20m",
    progress: 72,
    status: "in-progress",
    tags: ["Python", "ML"],
    url: "#",
  },
  {
    id: "r2",
    platform: "Udemy",
    platformColor: "purple",
    title: "The Complete ML Bootcamp — Jose Portilla",
    duration: "12h",
    progress: 55,
    status: "in-progress",
    tags: ["ML", "scikit-learn"],
    url: "#",
  },
  {
    id: "r3",
    platform: "Coursera",
    platformColor: "blue",
    title: "Deep Learning Specialisation — Andrew Ng",
    duration: "4 weeks",
    progress: 30,
    status: "in-progress",
    tags: ["Deep Learning"],
    url: "#",
  },
  {
    id: "r4",
    platform: "freeCodeCamp",
    platformColor: "green",
    title: "Responsive Web Design Certification",
    duration: "10h",
    progress: 88,
    status: "in-progress",
    tags: ["HTML", "CSS"],
    url: "#",
  },
  {
    id: "r5",
    platform: "YouTube",
    platformColor: "red",
    title: "Python for Data Science Full Course",
    duration: "6h",
    progress: 20,
    status: "in-progress",
    tags: ["Python", "Data Science"],
    url: "#",
  },
  {
    id: "r6",
    platform: "Medium",
    platformColor: "gray",
    title: "Understanding Transformers — Illustrated Guide",
    duration: "15 min read",
    progress: 100,
    status: "completed",
    tags: ["NLP", "Transformers"],
    url: "#",
  },
];

// ---------- RECOMMENDATIONS ----------
export const RECOMMENDATIONS = [
  {
    id: "rec1",
    platform: "YouTube",
    platformColor: "red",
    title: "Backpropagation Explained — 3Blue1Brown",
    duration: "18 min",
    matchScore: 98,
    reason: "Because you watched neural nets",
    tags: ["Math", "ML"],
  },
  {
    id: "rec2",
    platform: "Udemy",
    platformColor: "purple",
    title: "Scikit-learn: ML in Python",
    duration: "12h",
    matchScore: 94,
    reason: "Next step in your ML path",
    tags: ["Python", "ML"],
  },
  {
    id: "rec3",
    platform: "Coursera",
    platformColor: "blue",
    title: "Convolutional Neural Networks",
    duration: "4 weeks",
    matchScore: 91,
    reason: "Follows deep learning week 3",
    tags: ["Deep Learning", "CV"],
  },
  {
    id: "rec4",
    platform: "freeCodeCamp",
    platformColor: "green",
    title: "Data Visualisation with D3.js",
    duration: "10h",
    matchScore: 88,
    reason: "Pairs with your SQL progress",
    tags: ["D3", "JavaScript"],
  },
  {
    id: "rec5",
    platform: "YouTube",
    platformColor: "red",
    title: "Statistics for ML — StatQuest",
    duration: "45 min",
    matchScore: 86,
    reason: "Fills gap in your foundations",
    tags: ["Stats", "ML"],
  },
  {
    id: "rec6",
    platform: "Udemy",
    platformColor: "purple",
    title: "FastAPI — Build Modern APIs",
    duration: "8h",
    matchScore: 83,
    reason: "Based on your Python level",
    tags: ["Python", "APIs"],
  },
];

// ---------- FLASHCARDS ----------
export const FLASHCARD_DECKS = [
  {
    id: "deck1",
    title: "Machine Learning Fundamentals",
    cardCount: 24,
    dueCount: 4,
    masteredCount: 14,
    color: "indigo",
  },
  {
    id: "deck2",
    title: "Python Data Structures",
    cardCount: 18,
    dueCount: 2,
    masteredCount: 16,
    color: "purple",
  },
  {
    id: "deck3",
    title: "Deep Learning Concepts",
    cardCount: 30,
    dueCount: 8,
    masteredCount: 9,
    color: "blue",
  },
];

export const FLASHCARDS = [
  {
    id: "fc1",
    deckId: "deck1",
    question: "What is the vanishing gradient problem?",
    answer:
      "When gradients become extremely small in early layers during backpropagation, making weights update very slowly — learning effectively stalls in deep networks.",
    difficulty: "medium",
    source: "Udemy ML Bootcamp",
  },
  {
    id: "fc2",
    deckId: "deck1",
    question: "Define overfitting in machine learning.",
    answer:
      "When a model learns the training data too well — including noise — and fails to generalise to unseen data. Indicated by low training error but high validation error.",
    difficulty: "easy",
    source: "Coursera Deep Learning",
  },
  {
    id: "fc3",
    deckId: "deck1",
    question: "What does the FSRS algorithm stand for?",
    answer:
      "Free Spaced Repetition Scheduler. An open-source algorithm that predicts the optimal next review time for a flashcard based on prior recall performance.",
    difficulty: "hard",
    source: "SkillOS Notes",
  },
  {
    id: "fc4",
    deckId: "deck3",
    question: "What is a convolutional layer?",
    answer:
      "A layer in a CNN that applies learned filters (kernels) across input data to detect spatial patterns like edges, textures, or shapes. Produces feature maps.",
    difficulty: "medium",
    source: "Coursera CNN Week 1",
  },
];

// ---------- STUDY BUDDIES ----------
export const BUDDY_MATCHES = [
  {
    id: "b1",
    name: "Nishath Anjum",
    initials: "NA",
    avatarColor: "purple",
    goal: "ML & Deep Learning",
    hoursPerWeek: 3,
    skillLevel: "Intermediate",
    commonTags: ["Python", "ML", "Deep Learning"],
    compatScore: 94,
    status: "online",
    cohort: "same",
  },
  {
    id: "b2",
    name: "Arjun Rao",
    initials: "AR",
    avatarColor: "amber",
    goal: "Python, Data Science",
    hoursPerWeek: 5,
    skillLevel: "Intermediate",
    commonTags: ["Python", "Pandas"],
    compatScore: 88,
    status: "offline",
    cohort: null,
  },
  {
    id: "b3",
    name: "Priya Sharma",
    initials: "PS",
    avatarColor: "coral",
    goal: "Deep Learning & NLP",
    hoursPerWeek: 4,
    skillLevel: "Beginner",
    commonTags: ["ML", "NLP"],
    compatScore: 81,
    status: "online",
    cohort: null,
  },
  {
    id: "b4",
    name: "Rohan Mehta",
    initials: "RM",
    avatarColor: "teal",
    goal: "Computer Vision",
    hoursPerWeek: 6,
    skillLevel: "Advanced",
    commonTags: ["CV", "PyTorch"],
    compatScore: 76,
    status: "offline",
    cohort: null,
  },
];

// ---------- ACTIVITY HEATMAP ----------
// 0 = no activity, 1–3 = low/mid/high
export const HEATMAP_DATA = Array.from({ length: 52 * 7 }, (_, i) => {
  const r = Math.random();
  return r < 0.35 ? 0 : r < 0.60 ? 1 : r < 0.82 ? 2 : 3;
});