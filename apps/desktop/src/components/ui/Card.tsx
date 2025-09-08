import { JSX, HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly variant?: "default" | "glass" | "elevated";
}

/**
 * A reusable card component with different visual variants
 * @param variant - The visual style variant of the card
 * @param className - Additional CSS classes
 * @param children - Card content
 * @param props - Additional div props
 */
export function Card({
  variant = "default",
  className,
  children,
  ...props
}: Readonly<CardProps>): JSX.Element {
  const baseClasses = "card animate-fade-in";
  
  const variantClasses = {
    default: "",
    glass: "glass",
    elevated: "shadow-2xl hover:shadow-3xl transition-shadow duration-300",
  };
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card header component
 */
export function CardHeader({
  className,
  children,
  ...props
}: Readonly<HTMLAttributes<HTMLDivElement>>): JSX.Element {
  return (
    <div
      className={cn("mb-4 pb-2 border-b border-slate-200 dark:border-slate-700", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card content component
 */
export function CardContent({
  className,
  children,
  ...props
}: Readonly<HTMLAttributes<HTMLDivElement>>): JSX.Element {
  return (
    <div
      className={cn("space-y-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}