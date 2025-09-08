import { JSX, HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly variant?: "success" | "loading" | "error" | "info";
  readonly size?: "sm" | "md" | "lg";
}

/**
 * A reusable badge component for displaying status information
 * @param variant - The visual style variant of the badge
 * @param size - The size of the badge
 * @param className - Additional CSS classes
 * @param children - Badge content
 * @param props - Additional span props
 */
export function Badge({
  variant = "info",
  size = "md",
  className,
  children,
  ...props
}: Readonly<BadgeProps>): JSX.Element {
  const baseClasses = "status-badge";
  
  const variantClasses = {
    success: "status-success",
    loading: "status-loading animate-pulse",
    error: "status-error",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  };
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };
  
  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}