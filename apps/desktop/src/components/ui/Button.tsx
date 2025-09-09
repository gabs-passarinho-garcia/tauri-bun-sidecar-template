import { JSX, ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: "primary" | "secondary" | "outline" | "ghost";
  readonly size?: "sm" | "md" | "lg";
  readonly isLoading?: boolean;
}

/**
 * A reusable button component with multiple variants and sizes
 * @param variant - The visual style variant of the button
 * @param size - The size of the button
 * @param isLoading - Whether the button is in a loading state
 * @param className - Additional CSS classes
 * @param children - Button content
 * @param props - Additional button props
 */
export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: Readonly<ButtonProps>): JSX.Element {
  const baseClasses = "btn";

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline:
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20",
    ghost:
      "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isLoading && "cursor-not-allowed opacity-70",
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
