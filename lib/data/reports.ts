export interface ReportMetric {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export const overviewMetrics: ReportMetric[] = [
  {
    label: "Active Projects",
    value: "5",
    change: "+2 this quarter",
    changeType: "positive",
  },
  {
    label: "Translation Accuracy",
    value: "98.4%",
    change: "+1.2pp vs Q4",
    changeType: "positive",
  },
  {
    label: "Avg. Delivery Time",
    value: "18 days",
    change: "-4 days vs Q4",
    changeType: "positive",
  },
];

export const revenueByService: ChartData[] = [
  { label: "NLP Models", value: 180, color: "#0000FF" },
  { label: "Speech AI", value: 125, color: "#BA55D3" },
  { label: "Integrations", value: 95, color: "#FFA07A" },
  { label: "Analytics", value: 72, color: "#000000" },
  { label: "Advisory", value: 45, color: "#888888" },
];

export const monthlyRevenue: ChartData[] = [
  { label: "Oct", value: 82 },
  { label: "Nov", value: 96 },
  { label: "Dec", value: 88 },
  { label: "Jan", value: 110 },
  { label: "Feb", value: 125 },
];

export const clientSatisfaction: ChartData[] = [
  { label: "Oct", value: 92 },
  { label: "Nov", value: 94 },
  { label: "Dec", value: 93 },
  { label: "Jan", value: 96 },
  { label: "Feb", value: 98 },
];

export const q1Summary = {
  title: "Q1 2026 Engagement Summary",
  highlights: [
    "Medical NLP Translation Engine reaching 72% completion — on track for April delivery",
    "Interpreter Quality Scoring Model achieving 94.7% prediction accuracy in beta testing",
    "Epic EHR Integration Pipeline delivered ahead of schedule, now in production",
    "Real-Time Speech Recognition API supporting 15-second connection speeds across 430+ languages",
    "AI Transformation Phase 2 roadmap approved — expanding to patient communication analytics",
  ],
};
