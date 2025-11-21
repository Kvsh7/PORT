export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Frontend' | 'Backend' | 'Design' | 'Tools';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum SectionId {
  HERO = 'hero',
  ABOUT = 'about',
  SKILLS = 'skills',
  PROCESS = 'process',
  PROJECTS = 'projects',
  CONTACT = 'contact'
}