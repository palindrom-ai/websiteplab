export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  activeProjects: number;
  email: string;
  availability: "available" | "busy" | "away";
}

export const team: TeamMember[] = [
  {
    id: "TM-001",
    name: "Sarah Chen",
    role: "Lead AI Engineer",
    specialty: "NLP & Translation Models",
    activeProjects: 3,
    email: "s.chen@progressionlabs.com",
    availability: "busy",
  },
  {
    id: "TM-002",
    name: "Marcus Rivera",
    role: "Data Scientist",
    specialty: "Quality Analytics & Scoring",
    activeProjects: 1,
    email: "m.rivera@progressionlabs.com",
    availability: "available",
  },
  {
    id: "TM-003",
    name: "James Okonkwo",
    role: "ML Engineer",
    specialty: "Speech Recognition & Audio",
    activeProjects: 1,
    email: "j.okonkwo@progressionlabs.com",
    availability: "busy",
  },
  {
    id: "TM-004",
    name: "Elena Vasquez",
    role: "AI Research Scientist",
    specialty: "Multilingual Voice Models",
    activeProjects: 1,
    email: "e.vasquez@progressionlabs.com",
    availability: "available",
  },
  {
    id: "TM-005",
    name: "David Park",
    role: "Strategy Consultant",
    specialty: "AI Transformation & Roadmapping",
    activeProjects: 1,
    email: "d.park@progressionlabs.com",
    availability: "available",
  },
  {
    id: "TM-006",
    name: "Priya Sharma",
    role: "Account Director",
    specialty: "Client Success & Delivery",
    activeProjects: 0,
    email: "p.sharma@progressionlabs.com",
    availability: "available",
  },
];
