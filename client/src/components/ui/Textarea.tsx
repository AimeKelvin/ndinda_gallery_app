/** Shared textarea primitive for consistent form presentation. */
import type { TextareaHTMLAttributes } from "react";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="field-control textarea" {...props} />;
}
