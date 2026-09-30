import type { ReactNode } from "react";

interface StatusMessageProps {
  title: string;
  description?: string;
  variant?: "info" | "error";
  action?: ReactNode;
}

/** Shared block for empty and error states. */
export default function StatusMessage({
  title,
  description,
  variant = "info",
  action,
}: StatusMessageProps) {
  return (
    <div className={`status status--${variant}`} role={variant === "error" ? "alert" : "status"}>
      <p className="status__title">{title}</p>
      {description && <p className="status__text">{description}</p>}
      {action}
    </div>
  );
}
