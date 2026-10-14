import { createContext, useContext, useState, type ReactNode } from "react";

const initial = { date: "", players: 0, length: 0, time: "", name: "", email: "", phone: "", notes: "" };
type Booking = typeof initial;
const BookingContext = createContext<{ booking: Booking; update: (patch: Partial<Booking>) => void; reset: () => void } | null>(null);
export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState(initial);
  return <BookingContext.Provider value={{ booking, update: (patch) => setBooking((prev) => ({ ...prev, ...patch })), reset: () => setBooking(initial) }}>{children}</BookingContext.Provider>;
}
export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("BookingProvider is required");
  return context;
}