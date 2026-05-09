import { getEventStatusLabel } from "@/lib/events/format";
import { cn } from "@/lib/utils";

type EventStatusBadgeProps = {
  published: boolean;
  startTime: string;
};

export function EventStatusBadge({
  published,
  startTime,
}: EventStatusBadgeProps) {
  const label = getEventStatusLabel(published, startTime);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold",
        label === "Draft" && "bg-amber-100 text-amber-800",
        label === "Published" && "bg-emerald-100 text-emerald-800",
        label === "Past" && "bg-slate-100 text-slate-700",
      )}
    >
      {label}
    </span>
  );
}
