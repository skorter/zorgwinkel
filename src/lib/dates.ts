// Dates as the app shows and stores them.
// Stored: "2026-11-10" (the database's date format).
// Shown:  "Tuesday 10 November", in the app's language.

// "2026-11-10", in the phone's own time zone. (toISOString() uses UTC,
// which can give yesterday's date shortly after midnight.)
export function toDateString(d: Date) {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

// "2026-11-10" back to a Date at midnight, local time.
export function fromDateString(s: string) {
  const [year, month, day] = s.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// "Tuesday 10 November". English uses the British order, as on Home.
export function formatDay(d: Date, language: string) {
  const locale = language === "en" ? "en-GB" : language;
  return d.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
