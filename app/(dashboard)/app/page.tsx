"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "AI Agents Deployed", value: "12", change: "+3 this month", changeType: "positive" as const, barColor: "orchid" as const, barPercent: 75 },
  { label: "API Requests (24h)", value: "284K", change: "+18% vs yesterday", changeType: "positive" as const, barColor: "blue" as const, barPercent: 68 },
  { label: "Pipeline Runs (7d)", value: "1,847", change: "99.2% success rate", changeType: "positive" as const, barColor: "salmon" as const, barPercent: 92 },
  { label: "Avg Latency", value: "142ms", change: "-8ms vs last week", changeType: "positive" as const, barColor: "black" as const, barPercent: 30 },
];

const agents = [
  { name: "Customer Support Agent", model: "GPT-4o", status: "running" as const, requests: "12.4K/day", accuracy: "96.2%", lastTrained: "2 days ago" },
  { name: "Document Processing Pipeline", model: "Claude 3.5", status: "running" as const, requests: "8.1K/day", accuracy: "98.7%", lastTrained: "5 hours ago" },
  { name: "Speech-to-Text Engine", model: "Whisper v3", status: "running" as const, requests: "45.2K/day", accuracy: "94.1%", lastTrained: "1 week ago" },
  { name: "Sentiment Analysis API", model: "Custom BERT", status: "running" as const, requests: "22.8K/day", accuracy: "91.5%", lastTrained: "3 days ago" },
  { name: "Data Extraction Agent", model: "Claude 3.5", status: "training" as const, requests: "—", accuracy: "89.3%", lastTrained: "Training now..." },
  { name: "Fraud Detection Model", model: "XGBoost + LLM", status: "paused" as const, requests: "—", accuracy: "97.8%", lastTrained: "2 weeks ago" },
];

const pipelines = [
  { name: "Nightly Retraining — Sentiment Model", status: "completed", duration: "23m 14s", time: "Today, 3:00 AM" },
  { name: "Data Ingestion — CRM Sync", status: "completed", duration: "4m 02s", time: "Today, 2:15 AM" },
  { name: "Evaluation Run — Support Agent v2.4", status: "running", duration: "11m 32s", time: "Now" },
  { name: "Fine-tune — Document Classifier", status: "queued", duration: "—", time: "Scheduled 4:00 PM" },
  { name: "A/B Test Analysis — Chat Agent", status: "completed", duration: "1m 48s", time: "Yesterday, 11:00 PM" },
];

const statusColors: Record<string, string> = {
  running: "bg-[rgba(34,197,94,0.1)] text-green-600",
  training: "bg-[rgba(186,85,211,0.08)] text-orchid",
  paused: "bg-[rgba(0,0,0,0.06)] text-text-tertiary",
  completed: "bg-[rgba(34,197,94,0.1)] text-green-600",
  queued: "bg-[rgba(234,179,8,0.1)] text-yellow-600",
  failed: "bg-[rgba(239,68,68,0.1)] text-red-500",
};

const statusDots: Record<string, string> = {
  running: "bg-green-500",
  training: "bg-orchid",
  paused: "bg-gray-400",
};

export default function DashboardOverview() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-medium tracking-[-0.03em] mb-1">
          Welcome back, Coca Cola!
        </h2>
        <p className="text-sm text-text-tertiary">
          Here&apos;s your AI platform overview — all systems operational
        </p>
      </div>

      {/* Stat widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* AI Agents — takes 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-md border border-[rgba(0,0,0,0.08)] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-medium tracking-[-0.02em]">
              Active AI Agents
            </h3>
            <button className="text-xs font-medium text-orchid hover:text-orchid/80 transition-colors px-3 py-1.5 rounded-md bg-[rgba(186,85,211,0.06)] hover:bg-[rgba(186,85,211,0.1)]">
              + Deploy Agent
            </button>
          </div>
          <div className="space-y-0">
            {agents.map((agent, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 border-b border-[rgba(0,0,0,0.06)] last:border-0"
              >
                <div className="flex items-center gap-2 flex-shrink-0 w-5">
                  <div className={`w-2 h-2 rounded-full ${statusDots[agent.status]} ${agent.status === "running" ? "animate-pulse" : ""}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">{agent.name}</p>
                  <p className="text-[11px] text-text-tertiary">{agent.model}</p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-xs font-medium text-black">{agent.requests}</p>
                  <p className="text-[11px] text-text-tertiary">requests</p>
                </div>
                <div className="text-right flex-shrink-0 hidden md:block">
                  <p className="text-xs font-medium text-black">{agent.accuracy}</p>
                  <p className="text-[11px] text-text-tertiary">accuracy</p>
                </div>
                <Badge
                  variant={agent.status === "running" ? "success" : agent.status === "training" ? "orchid" : "default"}
                  className="flex-shrink-0 text-[9px]"
                >
                  {agent.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* API Usage panel */}
        <div className="bg-white rounded-md border border-[rgba(0,0,0,0.08)] p-6">
          <h3 className="text-base font-medium tracking-[-0.02em] mb-5">
            API Usage
          </h3>
          {/* Mini bar chart */}
          <div className="space-y-3 mb-6">
            {[
              { endpoint: "/v1/chat", calls: 124200, pct: 85 },
              { endpoint: "/v1/extract", calls: 67800, pct: 46 },
              { endpoint: "/v1/speech", calls: 52100, pct: 36 },
              { endpoint: "/v1/classify", calls: 31400, pct: 21 },
              { endpoint: "/v1/embed", calls: 8900, pct: 6 },
            ].map((ep) => (
              <div key={ep.endpoint}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-text-secondary">{ep.endpoint}</span>
                  <span className="text-[11px] text-text-tertiary">{(ep.calls / 1000).toFixed(1)}K</span>
                </div>
                <div className="h-1.5 bg-[rgba(0,0,0,0.06)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue"
                    style={{ width: `${ep.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[rgba(0,0,0,0.06)] pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">Monthly Quota</span>
              <span className="text-xs font-medium text-black">284K / 500K</span>
            </div>
            <div className="h-2 bg-[rgba(0,0,0,0.06)] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-blue via-orchid to-salmon" style={{ width: "56.8%" }} />
            </div>
            <p className="text-[11px] text-text-tertiary mt-1.5">56.8% used · Resets in 21 days</p>
          </div>
        </div>
      </div>

      {/* Training Pipelines */}
      <div className="bg-white rounded-md border border-[rgba(0,0,0,0.08)] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-medium tracking-[-0.02em]">
            Training Pipelines
          </h3>
          <button className="text-xs font-medium text-blue hover:text-blue/80 transition-colors px-3 py-1.5 rounded-md bg-[rgba(0,0,255,0.04)] hover:bg-[rgba(0,0,255,0.08)]">
            View All Runs
          </button>
        </div>
        <div className="space-y-0">
          {pipelines.map((pipeline, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3 border-b border-[rgba(0,0,0,0.06)] last:border-0"
            >
              <span
                className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-pill flex-shrink-0 ${
                  statusColors[pipeline.status]
                }`}
              >
                {pipeline.status}
              </span>
              <p className="text-sm text-text-secondary flex-1 truncate">
                {pipeline.name}
              </p>
              <span className="text-xs font-mono text-text-tertiary flex-shrink-0 hidden sm:block">
                {pipeline.duration}
              </span>
              <span className="text-xs text-text-tertiary flex-shrink-0 whitespace-nowrap">
                {pipeline.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
