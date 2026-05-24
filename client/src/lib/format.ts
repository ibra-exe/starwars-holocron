// Helpers for BBY/ABY formatting and lookups across the lore data.

export function formatBBY(value: number): string {
  if (value === 0) return "0 BBY/ABY";
  if (value < 0) return `${Math.abs(value).toLocaleString()} BBY`;
  return `${value.toLocaleString()} ABY`;
}

export function formatBBYRange(start: number, end: number): string {
  return `${formatBBY(start)} → ${formatBBY(end)}`;
}

export function shortBBY(value: number): string {
  if (value === 0) return "0";
  if (value < 0) return `${Math.abs(value)} BBY`;
  return `${value} ABY`;
}
