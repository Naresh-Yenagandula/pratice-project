export function formatDubaiDateTime(iso: string): string {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Dubai",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    const parts = new Intl.DateTimeFormat("en", options).formatToParts(date);
    const map: Record<string, string> = {};
    parts.forEach((p) => {
      if (p.type !== "literal") map[p.type] = p.value;
    });
    const day = map.day;
    const mon = map.month;
    const year = map.year;
    const hour = map.hour;
    const minute = map.minute;
    const dayPeriod = map.dayPeriod;
    return `${parseInt(
      day,
      10
    )} ${mon} ${year} | ${hour}:${minute} ${dayPeriod}`;
  } catch {
    return iso;
  }
}
