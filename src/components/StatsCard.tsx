import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "primary" | "secondary" | "accent";
}

const variantStyles = {
  default: "bg-card shadow-soft border border-border/50",
  primary: "bg-gradient-primary text-primary-foreground shadow-elevated",
  secondary: "bg-secondary/20 border border-secondary/30",
  accent: "bg-accent/10 border border-accent/20",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  secondary: "bg-secondary/30 text-secondary-foreground",
  accent: "bg-accent/20 text-accent",
};

export default function StatsCard({ label, value, icon: Icon, trend, variant = "default" }: StatsCardProps) {
  return (
    <div className={cn("rounded-xl p-5 animate-fade-in", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-sm font-medium", variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground")}>
            {label}
          </p>
          <p className="mt-1 text-3xl font-display font-bold">{value}</p>
          {trend && (
            <p className={cn("mt-1 text-xs font-medium", variant === "primary" ? "text-primary-foreground/70" : "text-success")}>
              {trend}
            </p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconVariantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
