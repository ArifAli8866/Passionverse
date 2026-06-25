import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export const HOBBIES = [
  { id: "programming", name: "💻 Programming", category: "Technology" },
  { id: "ai", name: "🤖 AI", category: "Technology" },
  { id: "cybersecurity", name: "🔐 Cybersecurity", category: "Technology" },
  { id: "robotics", name: "🦾 Robotics", category: "Technology" },
  { id: "cricket", name: "🏏 Cricket", category: "Sports" },
  { id: "football", name: "⚽ Football", category: "Sports" },
  { id: "fitness", name: "💪 Fitness", category: "Sports" },
  { id: "photography", name: "📷 Photography", category: "Creative" },
  { id: "videography", name: "🎥 Videography", category: "Creative" },
  { id: "writing", name: "✍️ Writing", category: "Creative" },
  { id: "reading", name: "📚 Reading", category: "Creative" },
  { id: "art", name: "🎨 Art", category: "Creative" },
  { id: "painting", name: "🖌️ Painting", category: "Creative" },
  { id: "music", name: "🎵 Music", category: "Creative" },
  { id: "singing", name: "🎤 Singing", category: "Creative" },
  { id: "cooking", name: "🍳 Cooking", category: "Lifestyle" },
  { id: "traveling", name: "✈️ Traveling", category: "Lifestyle" },
  { id: "entrepreneurship", name: "💼 Entrepreneurship", category: "Career" },
  { id: "gaming", name: "🎮 Gaming", category: "Entertainment" },
  { id: "science", name: "🔬 Science", category: "Education" },
] as const;

export const MOCK_USERS = [
  {
    id: "user1",
    fullName: "Alex Morgan",
    username: "alexmorgan",
    avatar: "",
    bio: "Full-stack developer & AI enthusiast. Building the future one line at a time.",
    location: "San Francisco, CA",
    website: "https://alexmorgan.dev",
    hobbies: ["programming", "ai", "robotics"],
    followers: 1234,
    following: 567,
    posts: 89,
    coverColor: "from-blue-500 to-indigo-600",
  },
  {
    id: "user2",
    fullName: "Priya Sharma",
    username: "priyasharma",
    avatar: "",
    bio: "Photographer | Traveler | Storyteller. Capturing moments around the world.",
    location: "Mumbai, India",
    website: "https://priyasharma.photo",
    hobbies: ["photography", "traveling", "writing"],
    followers: 2891,
    following: 432,
    posts: 156,
    coverColor: "from-purple-500 to-pink-600",
  },
  {
    id: "user3",
    fullName: "James Wilson",
    username: "jameswilson",
    avatar: "",
    bio: "Fitness coach & nutrition expert. Helping people transform their lives.",
    location: "London, UK",
    website: "https://jameswilson.fit",
    hobbies: ["fitness", "cooking", "reading"],
    followers: 5678,
    following: 234,
    posts: 312,
    coverColor: "from-green-500 to-emerald-600",
  },
  {
    id: "user4",
    fullName: "Sophie Chen",
    username: "sophiechen",
    avatar: "",
    bio: "Musician & composer. Creating melodies that touch the soul.",
    location: "Tokyo, Japan",
    website: "https://sophiechen.music",
    hobbies: ["music", "singing", "art"],
    followers: 3456,
    following: 789,
    posts: 234,
    coverColor: "from-orange-500 to-red-600",
  },
  {
    id: "user5",
    fullName: "Marcus Johnson",
    username: "marcusj",
    avatar: "",
    bio: "Entrepreneur & startup advisor. Turning ideas into successful businesses.",
    location: "New York, NY",
    website: "https://marcusj.io",
    hobbies: ["entrepreneurship", "gaming", "science"],
    followers: 4321,
    following: 654,
    posts: 178,
    coverColor: "from-cyan-500 to-blue-600",
  },
  {
    id: "user6",
    fullName: "Emma Williams",
    username: "emmawrites",
    avatar: "",
    bio: "Novelist & poet. Words are my paint, pages are my canvas.",
    location: "Melbourne, Australia",
    website: "https://emmawrites.com",
    hobbies: ["writing", "reading", "art"],
    followers: 2109,
    following: 345,
    posts: 445,
    coverColor: "from-rose-500 to-purple-600",
  },
];

export const MOCK_POSTS = [
  {
    id: "post1",
    userId: "user1",
    type: "image",
    content: "Just finished building a neural network from scratch! The results are incredible. #AI #MachineLearning",
    image: "",
    caption: "Neural Network Visualization",
    likes: 234,
    comments: 45,
    shares: 12,
    saves: 67,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user: MOCK_USERS[0],
  },
  {
    id: "post2",
    userId: "user2",
    type: "image",
    content: "Golden hour at the beach. Nature never ceases to amaze me. 📸",
    image: "",
    caption: "Golden Hour Beach",
    likes: 567,
    comments: 89,
    shares: 34,
    saves: 123,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    user: MOCK_USERS[1],
  },
  {
    id: "post3",
    userId: "user3",
    type: "text",
    content: "💪 **Consistency > Intensity**\n\nDon't wait for motivation. Build discipline.\n\nHere's my 5 tips for staying consistent:\n1. Start small\n2. Track progress\n3. Find an accountability partner\n4. Celebrate small wins\n5. Never miss twice\n\nWhich tip resonates most with you?",
    image: "",
    caption: "",
    likes: 890,
    comments: 156,
    shares: 78,
    saves: 345,
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    user: MOCK_USERS[2],
  },
  {
    id: "post4",
    userId: "user4",
    type: "image",
    content: "New song coming soon! Here's a sneak peek from the studio session. 🎵",
    image: "",
    caption: "Studio Session",
    likes: 445,
    comments: 67,
    shares: 23,
    saves: 89,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    user: MOCK_USERS[3],
  },
  {
    id: "post5",
    userId: "user5",
    type: "project",
    content: "Excited to launch my new startup! We're building the future of remote work collaboration.",
    image: "",
    caption: "Launch Day!",
    projectTitle: "RemoteSync Pro",
    projectDescription: "All-in-one remote work collaboration platform with AI-powered task management.",
    githubLink: "https://github.com/marcusj/remotesync",
    demoLink: "https://remotesync.pro",
    likes: 678,
    comments: 123,
    shares: 56,
    saves: 234,
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    user: MOCK_USERS[4],
  },
  {
    id: "post6",
    userId: "user6",
    type: "text",
    content: "Just finished reading 'The Alchemist' for the third time. Every read reveals something new. 📚\n\n\"When you want something, all the universe conspires in helping you to achieve it.\"\n\nWhat book has changed your life?",
    image: "",
    caption: "",
    likes: 345,
    comments: 89,
    shares: 45,
    saves: 178,
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    user: MOCK_USERS[5],
  },
  {
    id: "post7",
    userId: "user1",
    type: "text",
    content: "Hot take: TypeScript is not just JavaScript with types. It's a paradigm shift in how we think about code safety and developer experience.\n\nChange my mind. 🧵",
    image: "",
    caption: "",
    likes: 456,
    comments: 234,
    shares: 67,
    saves: 89,
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    user: MOCK_USERS[0],
  },
  {
    id: "post8",
    userId: "user2",
    type: "image",
    content: "Street photography from Tokyo. The contrast between tradition and modernity is fascinating.",
    image: "",
    caption: "Tokyo Streets",
    likes: 789,
    comments: 112,
    shares: 45,
    saves: 267,
    createdAt: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    user: MOCK_USERS[1],
  },
  {
    id: "post9",
    userId: "user3",
    type: "project",
    content: "Launched my fitness app! Track workouts, nutrition, and progress all in one place.",
    projectTitle: "FitTrack Pro",
    projectDescription: "AI-powered fitness tracking app with personalized workout plans.",
    githubLink: "https://github.com/jameswilson/fittrack",
    demoLink: "https://fittrack.pro",
    likes: 567,
    comments: 89,
    shares: 34,
    saves: 156,
    createdAt: new Date(Date.now() - 1000 * 60 * 1080).toISOString(),
    user: MOCK_USERS[2],
  },
];

export const MOCK_CHATS = [
  {
    id: "chat1",
    participants: ["currentUser", "user2"],
    lastMessage: {
      content: "That photo is absolutely stunning!",
      senderId: "currentUser",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    user: MOCK_USERS[1],
    unread: 0,
  },
  {
    id: "chat2",
    participants: ["currentUser", "user3"],
    lastMessage: {
      content: "Thanks for the fitness tips! They really helped.",
      senderId: "currentUser",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    user: MOCK_USERS[2],
    unread: 2,
  },
  {
    id: "chat3",
    participants: ["currentUser", "user1"],
    lastMessage: {
      content: "Check out my new project on GitHub!",
      senderId: "user1",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    user: MOCK_USERS[0],
    unread: 0,
  },
  {
    id: "chat4",
    participants: ["currentUser", "user4"],
    lastMessage: {
      content: "Would love to collaborate on a project!",
      senderId: "currentUser",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    user: MOCK_USERS[3],
    unread: 1,
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif1",
    type: "like",
    message: "liked your post",
    userId: "user2",
    user: MOCK_USERS[1],
    postId: "post1",
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: "notif2",
    type: "comment",
    message: "commented on your post",
    userId: "user3",
    user: MOCK_USERS[2],
    postId: "post1",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
  },
  {
    id: "notif3",
    type: "follow",
    message: "started following you",
    userId: "user4",
    user: MOCK_USERS[3],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: "notif4",
    type: "reply",
    message: "replied to your comment",
    userId: "user5",
    user: MOCK_USERS[4],
    postId: "post3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: true,
  },
  {
    id: "notif5",
    type: "like",
    message: "liked your project",
    userId: "user6",
    user: MOCK_USERS[5],
    postId: "post5",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: true,
  },
  {
    id: "notif6",
    type: "message",
    message: "sent you a message",
    userId: "user1",
    user: MOCK_USERS[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    read: true,
  },
];
