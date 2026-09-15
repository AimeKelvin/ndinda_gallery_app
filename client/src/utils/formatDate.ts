/** Keeps presentation formatting out of gallery components. */
export function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric", month: "short", day: "numeric",
  }).format(new Date(value));
}
