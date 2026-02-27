export type InvoiceStatus = "paid" | "outstanding" | "overdue" | "draft";

export interface Invoice {
  id: string;
  project: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
}

export const invoices: Invoice[] = [
  {
    id: "INV-2026-001",
    project: "Medical NLP Translation Engine",
    amount: 48000,
    status: "paid",
    issueDate: "2026-01-15",
    dueDate: "2026-02-14",
  },
  {
    id: "INV-2026-002",
    project: "Epic EHR Integration Pipeline",
    amount: 72000,
    status: "paid",
    issueDate: "2026-01-01",
    dueDate: "2026-01-31",
  },
  {
    id: "INV-2026-003",
    project: "Interpreter Quality Scoring Model",
    amount: 35000,
    status: "outstanding",
    issueDate: "2026-02-01",
    dueDate: "2026-03-03",
  },
  {
    id: "INV-2026-004",
    project: "Language Access Analytics Dashboard",
    amount: 120000,
    status: "paid",
    issueDate: "2025-12-15",
    dueDate: "2026-01-14",
  },
  {
    id: "INV-2026-005",
    project: "AI Transformation Roadmap — Phase 2",
    amount: 25000,
    status: "outstanding",
    issueDate: "2026-02-10",
    dueDate: "2026-03-12",
  },
  {
    id: "INV-2026-006",
    project: "430-Language Voice Model Fine-Tuning",
    amount: 55000,
    status: "overdue",
    issueDate: "2025-11-15",
    dueDate: "2025-12-15",
  },
  {
    id: "INV-2026-007",
    project: "Real-Time Speech Recognition API",
    amount: 15000,
    status: "draft",
    issueDate: "2026-02-25",
    dueDate: "2026-03-27",
  },
  {
    id: "INV-2026-008",
    project: "Skills-Based Routing Optimizer",
    amount: 88000,
    status: "paid",
    issueDate: "2025-12-01",
    dueDate: "2025-12-31",
  },
  {
    id: "INV-2026-009",
    project: "Patient Communication Sentiment Analysis",
    amount: 42000,
    status: "outstanding",
    issueDate: "2026-02-15",
    dueDate: "2026-03-17",
  },
  {
    id: "INV-2026-010",
    project: "Multilingual Terminology Extraction",
    amount: 38000,
    status: "paid",
    issueDate: "2026-01-20",
    dueDate: "2026-02-19",
  },
  {
    id: "INV-2025-011",
    project: "Epic EHR Integration Pipeline — Phase 1",
    amount: 64000,
    status: "paid",
    issueDate: "2025-10-01",
    dueDate: "2025-10-31",
  },
  {
    id: "INV-2025-012",
    project: "AI Readiness Assessment",
    amount: 31000,
    status: "paid",
    issueDate: "2025-09-15",
    dueDate: "2025-10-15",
  },
];
