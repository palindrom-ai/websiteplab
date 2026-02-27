"use client";

import { team } from "@/lib/data/clients";
import { Badge } from "@/components/ui/badge";

const availabilityVariants: Record<string, { variant: "success" | "warning" | "default"; label: string }> = {
  available: { variant: "success", label: "Available" },
  busy: { variant: "warning", label: "Busy" },
  away: { variant: "default", label: "Away" },
};

export default function TeamPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-medium tracking-[-0.03em] mb-1">
          Your Team
        </h2>
        <p className="text-sm text-text-tertiary">
          {team.length} Progression Labs consultants assigned to your engagement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member) => {
          const status = availabilityVariants[member.availability];
          return (
            <div
              key={member.id}
              className="bg-white rounded-md border border-[rgba(0,0,0,0.08)] p-6 hover:border-[rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-medium tracking-[-0.02em] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-text-tertiary">{member.role}</p>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-tertiary">Specialty</span>
                  <span className="text-text-secondary font-medium">
                    {member.specialty}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-tertiary">Active Projects</span>
                  <span className="text-text-secondary font-medium">
                    {member.activeProjects}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(0,0,0,0.06)]">
                <p className="text-sm text-text-secondary">
                  {member.email}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
