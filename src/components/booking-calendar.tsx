import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingCalendar({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const [view, setView] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const max = new Date(now.getTime() + 90 * 864e5);
  const first = (view.getDay() + 6) % 7;
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  return <div className="booking-calendar">
    <div className="calendar-heading"><span>{view.toLocaleString("en-US", { month: "long", year: "numeric" })}</span><div className="flex gap-1">
      <Button variant="ghost" size="icon" title="Previous month" aria-label="Previous month" disabled={view <= new Date(now.getFullYear(), now.getMonth(), 1)} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}><ChevronLeft /></Button>
      <Button variant="ghost" size="icon" title="Next month" aria-label="Next month" disabled={new Date(view.getFullYear(), view.getMonth() + 1, 1) > max} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}><ChevronRight /></Button>
    </div></div>
    <div className="calendar-grid calendar-weekdays">{["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => <span key={day}>{day}</span>)}</div>
    <div className="calendar-grid">{Array.from({ length: first }, (_, i) => <span key={`empty${i}`} />)}{Array.from({ length: days }, (_, i) => {
      const d = new Date(view.getFullYear(), view.getMonth(), i + 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return <Button key={key} aria-label={key} aria-pressed={key === value} disabled={d < now || d > max} variant={key === value ? "default" : "ghost"} className="calendar-day" onClick={() => onChange(key)}>{i + 1}</Button>;
    })}</div>
  </div>;
}