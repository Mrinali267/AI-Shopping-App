import { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md";

const BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white shadow-sm hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md",
  secondary: "border border-line bg-surface text-ink hover:border-accent/50 hover:bg-accent-soft",
  ghost: "text-ink-soft hover:bg-accent-soft hover:text-ink",
  destructive: "border border-danger/25 bg-danger-soft text-danger hover:bg-danger/10",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "secondary", size = "md", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`${BASE} ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
      {...props}
    />
  )
);
Button.displayName = "Button";

export default Button;
