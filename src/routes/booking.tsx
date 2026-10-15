import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { useBooking } from "@/components/booking-context";
import { BookingCalendar } from "@/components/booking-calendar";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Bowling Reservation | Booking system" }, { name: "description", content: "Choose your date, players and duration, then explore simulated lane availability at Booking system. No real reservations or payments." },
      { property: "og:title", content: "Bowling Reservation | Booking system" }, { property: "og:description", content: "Plan your game with our simple demo bowling reservation experience." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ]
  }), component: BookingPage
});

function fakeTimes(date: string, length: number) {
  if (!date) return [];

  const selectedDate = new Date(`${date}T12:00:00`);
  const weekday = selectedDate.getDay();

  const openingMinutes = 10 * 60; // 10:00 AM

  const closingMinutes =
    weekday === 5 || weekday === 6
      ? 25 * 60
      : 23 * 60;

  const durationMinutes = length * 60;
  const seed = [...date].reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0
  );

  const slots = [];

  for (
    let start = openingMinutes;
    start + durationMinutes <= closingMinutes;
    start += 30
  ) {
    const index = (start - openingMinutes) / 30;
    const count = (seed + index * 7 + Math.round(length * 10) * 3) % 13;

    const hour24 = Math.floor(start / 60) % 24;
    const minutes = start % 60;
    const hour12 = hour24 % 12 || 12;
    const period = hour24 >= 12 ? "pm" : "am";

    slots.push({
      time: `${hour12}:${String(minutes).padStart(2, "0")}${period}`,
      count,
    });
  }

  return slots;
}

function BookingPage() {

  const { booking: b, update, reset } = useBooking();
  const [step, setStep] = useState(1);
  const [confirmation, setConfirmation] = useState("");
  
  const lanes = Math.ceil(b.players / 6);
  const total = lanes * b.length * 35;
  const ready = Boolean(b.date && b.players && b.length);
  const detailsReady = ready && Boolean(b.time);
  const reviewReady = detailsReady && Boolean(b.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) && b.phone.trim());
  
  const times = useMemo(
    () => fakeTimes(b.date, b.length),
    [b.date, b.length]
  );

  const move = (next: number) => { setStep(next); window.scrollTo({ top: 0, behavior: "instant" }); };
  const selection = (selected: boolean) => `choice-button ${selected ? "selected" : ""}`;
  const dateLabel = b.date ? new Date(b.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not selected";

  return <>
    <SiteHeader />
    <main className="container booking-main">
      <div className="booking-topline">
        <Link to="/" className="back-home">
          <ArrowLeft size={16} /> Home
        </Link>
        <span className="demo-label">DEMO · NO REAL BOOKINGS</span>
      </div>
      {step < 4 && <nav aria-label="Reservation steps" className="step-navigation">{["Date & time", "Your details", "Review"].map((label, i) => {
        const n = i + 1; const enabled = n === 1 || (n === 2 ? detailsReady : reviewReady);
        return <Button key={label} variant="ghost" disabled={!enabled} aria-current={n === step ? "step" : undefined} onClick={() => move(n)} className={`step-button ${step === n ? "active" : ""}`}><span className="step-number">{n < step ? <Check size={15} /> : n}</span><span>{label}</span></Button>;
      })}</nav>}
      <div className="row g-5">
        <section className={step === 4 ? "col-12" : "col-lg-8"}>
          {step === 1 && <>
            <div className="page-title">
              <span className="eyebrow text-primary">LET’S GET YOU ON A LANE</span>
              <h1>Bowling Reservation</h1>
              <p>Great games start with a good plan. Choose when you’d like to play and who’s coming along.</p>
            </div>
            <div className="row g-4 selection-row"><div className="col-md-6">
              <h2 className="field-title">
                <CalendarDays /> Date</h2>
              <p className="field-help">Pick a day for your next game. Dates are available up to 90 days ahead.</p>
              <BookingCalendar value={b.date} onChange={(date) => update({ date, time: "" })} /></div>
              <div className="col-md-6">
                <h2 className="field-title">
                  <Users /> Players
                </h2>
                <p className="field-help">Count everyone joining the fun. Up to 6 players share each lane.</p>
                <div className="player-grid">{Array.from({ length: 12 }, (_, i) => i + 1).map((n) =>
                  <Button key={n} variant="outline" aria-label={`${n} players`} aria-pressed={b.players === n} className={selection(b.players === n)} onClick={() => update({ players: n, time: "" })}>{n}</Button>
                )}</div>
                <div className="length-section">
                  <h2 className="field-title">
                    <Clock3 /> Length
                  </h2>
                  <p className="field-help">Give yourself time for a few frames, or settle in for a longer session.</p>
                  <div className="length-grid">{[1, 1.5, 2, 3].map((n) =>
                    <Button key={n} variant="outline" aria-pressed={b.length === n} className={selection(b.length === n)} onClick={() => update({ length: n, time: "" })}>{n} h</Button>)}
                  </div>
                </div>
              </div>
            </div>
            <section className="times-section">
              <div className="times-heading">
                <div>
                  <h2>Available times</h2>
                  <p className="field-help">Find the start time that suits your group. Lane counts below are simulated.</p>
                </div>
              </div>
              <div className="d-none availability-legend">
                <span><i className="availability-dot plenty" /> 6+ lanes</span>
                <span><i className="availability-dot limited" /> 1–5 lanes</span>
                <span><i className="availability-dot full" /> No lanes</span>
              </div>
              {ready ?
                <div className="time-grid">{times.map(({ time, count }) =>
                  <Button key={time} variant="outline" disabled={count < lanes} aria-pressed={b.time === time} className={`time-button ${b.time === time ? "selected" : ""}`} onClick={() => update({ time })}><span>{time}</span><span className="lane-count"><i className={`availability-dot ${count === 0 ? "full" : count < 6 ? "limited" : "plenty"}`} />{count} {count === 1 ? "lane" : "lanes"}</span></Button>
                )}</div> :
                <div className="times-empty"><Clock3 size={24} /><p>Choose your date, players and length to see available times.</p></div>}</section>
            <div className="booking-actions">
              <Button asChild variant="outline" size="lg"><Link to="/"><ArrowLeft /> Back</Link></Button>
              <Button disabled={!detailsReady} size="lg" onClick={() => move(2)}>Continue <ArrowRight /></Button>
            </div>
          </>}
          {step === 2 &&
            <form onSubmit={(event) => { event.preventDefault(); if (reviewReady) move(3); }}>
              <div className="page-title">
                <span className="eyebrow text-primary">THE PEOPLE BEHIND THE GAME</span>
                <h1>Your Details</h1>
                <p>Tell us who’s joining us. These details stay in this demo and no confirmation email will be sent.</p>
              </div>
              <div className="row g-4">
                <div className="col-sm-6">
                  <label htmlFor="full-name" className="form-label">Full name</label>
                  <input id="full-name" autoComplete="name" required className="form-control" placeholder="Alex Johnson" value={b.name} onChange={(e) => update({ name: e.target.value })} />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input id="email" type="email" autoComplete="email" required className="form-control" placeholder="alex@example.com" value={b.email} onChange={(e) => update({ email: e.target.value })} />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="phone" className="form-label">Phone number</label>
                  <input id="phone" type="tel" autoComplete="tel" required className="form-control" placeholder="Your phone number" value={b.phone} onChange={(e) => update({ phone: e.target.value })} /></div>
                <div className="col-sm-6">
                  <label htmlFor="offer" className="form-label">Offer code
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input id="offer" className="form-control" placeholder="Enter a code" />
                  <p className="small text-muted-foreground mt-2">Offer codes aren’t applied in this demo.</p>
                </div>
                <div className="col-12">
                  <label htmlFor="notes" className="form-label">Anything else?
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <textarea id="notes" className="form-control" rows={4} placeholder="Let us know if there’s anything you’d like us to know." value={b.notes} onChange={(e) => update({ notes: e.target.value })} />
                </div>
              </div>
              <div className="booking-actions">
                <Button type="button" variant="outline" size="lg" onClick={() => move(1)}><ArrowLeft /> Back</Button>
                <Button type="submit" size="lg">Review <ArrowRight /></Button>
              </div>
            </form>}
          {step === 3 && <>
            <div className="page-title">
              <span className="eyebrow text-primary">ONE LAST LOOK</span>
              <h1>Review your reservation</h1>
              <p>Everything looking good? Check your game details before confirming this demo reservation.</p>
            </div>
            <dl className="review-list">{[["Activity", "Reservation"], ["Date", dateLabel], ["Start time", b.time], ["Length", `${b.length} hours`], ["Players / lanes", `${b.players} players · ${lanes} ${lanes === 1 ? "lane" : "lanes"}`], ["Name", b.name], ["Email", b.email], ["Phone", b.phone]].map(([key, value]) => <Fragment key={key}><dt>{key}</dt><dd>{value}</dd></Fragment>)}</dl>
            <div className="demo-notice">
              <ShieldCheck />
              <div><strong>No payment required</strong>
                <p>This is a demo. No card details are needed, and nothing will be reserved or charged.</p>
              </div>
            </div>
            <div className="booking-actions">
              <Button variant="outline" size="lg" onClick={() => move(2)}><ArrowLeft /> Back</Button>
              <Button size="lg" onClick={() => { setConfirmation(`DL${Math.floor(100000 + Math.random() * 899999)}`); move(4); }}>Confirm demo <Check />
              </Button>
            </div></>}
          {step === 4 &&
            <div className="confirmation">
              <CheckCircle2 size={56} className="text-success" />
              <span className="eyebrow text-primary mt-4">YOU’RE ALL SET</span>
              <h1>That’s how you roll.</h1>
              <p>Demo confirmation #{confirmation}</p>
              <p>{dateLabel} at {b.time} · {b.players} players · {b.length} h</p>
              <div className="demo-notice">
                <ShieldCheck />
                <p>No real reservation was made and no payment was taken.</p>
              </div>
              <div className="flex justify-center gap-3 flex-wrap">
                <Button asChild variant="outline" size="lg"><Link to="/">Back to home</Link></Button>
                <Button size="lg" onClick={() => { reset(); move(1); }}>Start another game <ArrowRight /></Button>
              </div>
            </div>}
        </section>{step < 4 && <aside className="col-lg-4">
          <div className="booking-summary">
            <span className="eyebrow">YOUR GAME PLAN</span>
            <h2>Summary</h2>
            <p className="summary-activity">Bowling Reservation</p>
            <ul className="summary-items">
              <li>
                <CalendarDays />
                <span>{dateLabel}</span>
              </li>
              <li>
                <Users />
                <span>{b.players ? `${b.players} players · ${lanes} ${lanes === 1 ? "lane" : "lanes"}` : "Players not selected"}</span>
              </li>
              <li>
                <Clock3 />
                <span>{b.length ? `${b.length} h` : "Length not selected"}{b.time && ` · ${b.time}`}</span>
              </li>
            </ul>
            <div className="summary-total">
              <span>Estimated total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <p className="summary-note">Sample price · $35 per lane / hour</p>
            <div className="summary-demo">
              <ShieldCheck size={16} /> Demo only. Nothing will be charged.</div>
          </div>
        </aside>}
      </div>
    </main>
    <footer className="site-footer">
      <div className="container">Booking system
        <span>Good games. Great company.</span>
      </div>
    </footer></>;
}
