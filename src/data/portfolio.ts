export const profile = {
  name: 'Álvaro Rivas',
  role: 'Senior Software Engineer',
  location: 'Madrid, Spain',
  email: 'contact@arial.dev',
  cv: 'https://res.cloudinary.com/duemlwqqt/image/upload/v1791067842/CV%20Alvaro%20Rivas.pdf',
  github: 'https://github.com/arialdev',
  linkedin: 'https://www.linkedin.com/in/alvaro-rivas',
  blog: 'https://blog.arial.dev/',
  description: 'Senior software engineer in Madrid building scalable web applications, React microfrontends, and distributed systems. Exploring the intersection of software architecture and AI.',
} as const;

export const cvDownloadUrl = profile.cv.replace('/upload/', '/upload/fl_attachment:Alvaro-Rivas-CV/');

export interface HeroPhrase { article: 'a' | 'an'; text: string }

export const heroPhrases: readonly HeroPhrase[] = [
  { article: 'a', text: profile.role },
  { article: 'a', text: 'Microfrontends Expert' },
  { article: 'a', text: 'Module Federation Master' },
  { article: 'an', text: 'Engineering Enthusiast' },
  { article: 'a', text: 'Clean Design Lover' },
  { article: 'a', text: 'Distributed Systems Builder' },
  { article: 'a', text: 'React Sailor' },
];

// Professional facts: supplied CV. Destinations: https://alvarorivas.dev/.
// Curated explicitly: the PDF is linked, never embedded as extracted text.
export interface CareerEntry {
  period: string;
  title: string;
  organization: string;
  description: string;
  highlights: readonly string[];
}

export const experience: readonly CareerEntry[] = [
  {
    period: '2022 — Present',
    title: 'Senior Software Engineer',
    organization: 'Nexthink',
    description: 'Building the foundations for scalable applications and independent teams.',
    highlights: [
      'Led the migration of 40+ microfrontends to Module Federation.',
      'Optimized React microfrontends, delivering up to a 70% performance improvement.',
      'Designed a company-wide strategy for unit, integration, and contract testing.',
      'Built Kafka-based streaming APIs and backend services with Java and Node.js.',
      'Helped standardize CI/CD with reusable GitHub Actions workflows.',
      'Led a large-scale UI redesign across shared components and consuming applications.',
    ],
  },
  {
    period: '2020 — 2021',
    title: 'Junior Full-stack Developer',
    organization: 'Sotec Consulting',
    description: 'Connecting web, mobile, and backend development.',
    highlights: [
      'Developed Angular web applications and cross-platform Ionic applications for Android and iOS.',
      'Built and maintained REST APIs and Oracle SQL databases.',
    ],
  },
];

export const education: readonly CareerEntry[] = [
  {
    period: '2025 — 2026',
    title: 'MSc in Artificial Intelligence',
    organization: 'Alfonso X el Sabio University',
    description: 'Machine learning, deep learning, and applied artificial intelligence.',
    highlights: ['Master’s thesis: an AI-powered SRE agent using LLMs, RAG, Kubernetes, Prometheus, and runbooks for incident diagnosis and contextual remediation guidance.'],
  },
  {
    period: '2017 — 2022',
    title: 'Computer Engineering & Software Engineering',
    organization: 'Rey Juan Carlos University of Madrid',
    description: 'Double degree in Computer Engineering and Software Engineering.',
    highlights: [],
  },
];

export const skills = [
  { label: 'Software engineering', items: ['TypeScript / JavaScript', 'React', 'Microfrontends', 'Module Federation', 'Java / Spring Boot', 'Kafka', 'Software architecture'] },
  { label: 'Cloud & quality', items: ['AWS', 'Kubernetes', 'CI/CD', 'Testing & TDD'] },
  { label: 'Artificial intelligence', items: ['Machine learning', 'Deep learning', 'RAG'] },
] as const;

export interface Project {
  id: string;
  number: string;
  name: string;
  category: string;
  summary: string;
  detail: string;
  tags: readonly string[];
  url: string;
  linkLabel: string;
}

export const projects: readonly Project[] = [
  {
    id: 'sre-agent', number: '01', name: 'SRE Agent', category: 'AI · Infrastructure',
    summary: 'Context for the moments that matter. An AI-powered assistant for incident diagnosis.',
    detail: 'Built for my AI master’s thesis, this SRE agent brings together LLMs, retrieval-augmented generation, Kubernetes, Prometheus, and runbooks to diagnose incidents and generate contextual remediation guidance.',
    tags: ['LLMs', 'RAG', 'Kubernetes', 'Observability'], url: 'https://sre-agent.arial.dev/', linkLabel: 'Visit SRE Agent',
  },
  {
    id: 'vocabulaire', number: '02', name: 'Vocabulaire', category: 'Mobile · Languages',
    summary: 'A cross-platform app for learning new vocabulary, built with Ionic and Angular.',
    detail: 'A personal vocabulary-learning app exploring cross-platform development with Ionic and Angular. Browse the repository to explore the implementation.',
    tags: ['Ionic', 'Angular', 'Languages', 'Gamification'], url: 'https://github.com/arialdev/vocabulaire', linkLabel: 'View Vocabulaire source',
  },
  {
    id: 'awards', number: '03', name: 'Awards Predictions', category: 'Web · Film',
    summary: 'Vote for your favourite film-award nominees and share your picks with friends.',
    detail: 'A personal cinema-awards voting application built with Angular, Node.js, and MongoDB. Explore the source for the full-stack implementation.',
    tags: ['Angular', 'Node.js', 'MongoDB'], url: 'https://github.com/arialdev/Awards-Predictions', linkLabel: 'View Awards Predictions source',
  },
];

