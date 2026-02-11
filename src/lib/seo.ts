export function formatIsoDate(input: string): string {
  const parsed = new Date(input);

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

export function formatIso8601Duration(input: string): string {
  const parts = input.split(":").map((value) => Number(value));

  if (parts.some((value) => Number.isNaN(value))) {
    return "PT0S";
  }

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  } else if (parts.length === 2) {
    [minutes, seconds] = parts;
  } else if (parts.length === 1) {
    [seconds] = parts;
  } else {
    return "PT0S";
  }

  const durationParts: string[] = [];

  if (hours > 0) {
    durationParts.push(`${hours}H`);
  }

  if (minutes > 0) {
    durationParts.push(`${minutes}M`);
  }

  if (seconds > 0 || durationParts.length === 0) {
    durationParts.push(`${seconds}S`);
  }

  return `PT${durationParts.join("")}`;
}
