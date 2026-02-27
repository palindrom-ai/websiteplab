export type ProjectStatus = "active" | "completed" | "on-hold" | "planning";

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  consultant: string;
  type: string;
  startDate: string;
  progress: number;
}

export const projects: Project[] = [
  {
    id: "GLOB-001",
    name: "Medical NLP Translation Engine",
    status: "active",
    consultant: "Sarah Chen",
    type: "AI Build",
    startDate: "2025-11-01",
    progress: 72,
  },
  {
    id: "GLOB-002",
    name: "Interpreter Quality Scoring Model",
    status: "active",
    consultant: "Marcus Rivera",
    type: "AI Build",
    startDate: "2025-12-15",
    progress: 58,
  },
  {
    id: "GLOB-003",
    name: "Epic EHR Integration Pipeline",
    status: "completed",
    consultant: "Sarah Chen",
    type: "AI Build",
    startDate: "2025-09-01",
    progress: 100,
  },
  {
    id: "GLOB-004",
    name: "Real-Time Speech Recognition API",
    status: "active",
    consultant: "James Okonkwo",
    type: "AI Platform",
    startDate: "2026-01-10",
    progress: 41,
  },
  {
    id: "GLOB-005",
    name: "Language Access Analytics Dashboard",
    status: "completed",
    consultant: "Marcus Rivera",
    type: "AI Expert",
    startDate: "2025-08-15",
    progress: 100,
  },
  {
    id: "GLOB-006",
    name: "Patient Communication Sentiment Analysis",
    status: "active",
    consultant: "Elena Vasquez",
    type: "AI Build",
    startDate: "2026-01-20",
    progress: 35,
  },
  {
    id: "GLOB-007",
    name: "AI Transformation Roadmap — Phase 2",
    status: "planning",
    consultant: "David Park",
    type: "Strategic Advisory",
    startDate: "2026-03-01",
    progress: 10,
  },
  {
    id: "GLOB-008",
    name: "Multilingual Terminology Extraction",
    status: "active",
    consultant: "Sarah Chen",
    type: "AI Build",
    startDate: "2025-12-01",
    progress: 63,
  },
  {
    id: "GLOB-009",
    name: "Skills-Based Routing Optimizer",
    status: "completed",
    consultant: "James Okonkwo",
    type: "AI Expert",
    startDate: "2025-07-01",
    progress: 100,
  },
  {
    id: "GLOB-010",
    name: "430-Language Voice Model Fine-Tuning",
    status: "on-hold",
    consultant: "Elena Vasquez",
    type: "AI Research",
    startDate: "2025-10-15",
    progress: 22,
  },
];
