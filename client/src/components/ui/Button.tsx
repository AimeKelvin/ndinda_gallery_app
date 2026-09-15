/** Small shared button primitive used to keep button styling and variants consistent. */
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }>;

export function Button({ variant = "primary", className = "", children, ...props }: Props) {
  return <button className={`button ${variant} ${className}`.trim()} {...props}>{children}</button>;
}
