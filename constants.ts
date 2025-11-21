import { Project, Skill } from './types';

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "FaceVerify Social",
    description: "A secure social media web application featuring biometric face verification login using OpenCV and Multi-Factor Authentication (MFA).",
    tags: ["Java", "OpenCV", "REST APIs", "MFA", "SQL"],
    imageUrl: "https://picsum.photos/600/400?random=10", // Placeholder
    link: "#"
  }
];

export const SKILLS: Skill[] = [
  { name: "Java (Core/OOP)", level: 90, category: 'Backend' },
  { name: "SQL / Database", level: 85, category: 'Backend' },
  { name: "HTML / CSS", level: 88, category: 'Frontend' },
  { name: "JavaScript", level: 80, category: 'Frontend' },
  { name: "RESTful APIs", level: 85, category: 'Backend' },
  { name: "Azure Fundamentals", level: 75, category: 'Tools' },
  { name: "Data Structures", level: 80, category: 'Backend' },
];

export const INITIAL_CHAT_MESSAGE = "Hello! I'm the AI assistant for Venkata Sai Hanuman. Ask me about my Java projects, face verification security, or my MCA background!";