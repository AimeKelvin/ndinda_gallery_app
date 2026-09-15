/** Shared text-input primitive; forwardRef keeps it compatible with future form libraries/focus management. */
import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(props, ref) {
  return <input ref={ref} className="field-control" {...props} />;
});
