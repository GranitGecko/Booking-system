import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Booking system | Bowling & Good Times" },
    { name: "description", content: "Plan your next visit to Booking system. Explore opening hours and try our bowling reservation demo." },
    { property: "og:title", content: "Booking system | Bowling & Good Times" },
    { property: "og:description", content: "A little friendly competition. A whole lot of good times. Plan your next bowling visit." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Home,
});
function Home() {
  return <><SiteHeader /><main>
    <section className="home-hero"><img src={"/src/assets/activity.avif"} alt="Bowling lanes at Booking system" className="hero-photo" /><div className="hero-shade" /><div className="container hero-content">
      <span className="eyebrow">A LITTLE FRIENDLY COMPETITION</span><h1>Booking system</h1><p>Make room for good times.<br />Your next great game starts here.</p>
      <Button asChild size="lg" className="hero-button"><Link to="/booking">Book a resource <ArrowRight /></Link></Button>
      <span className="hero-note">Online reservations · Demo experience</span>
    </div></section>
    <section className="visit-section"><div className="container"><div className="row g-5">
      <div className="col-lg-6 d-none"><span className="eyebrow text-primary">COME FOR THE GAME. STAY FOR THE FUN.</span><h2>A little time together.<br />A lot to look forward to.</h2><p className="section-copy">Get your favorite people together, pick a lane and enjoy a little friendly competition. Whether it’s your first frame or your next strike, there’s a place for you at Booking system.</p><div className="visit-facts"><span><MapPin size={18} /> Booking system</span><span><Sparkles size={18} /> All skill levels welcome</span></div><Button asChild variant="link" className="p-0 mt-4"><Link to="/booking">Plan your game <ArrowRight /></Link></Button></div>
      <div className="col-lg-6 offset-lg-0"><div className="hours-title"><Clock3 size={22} /><h2>Opening hours</h2></div><p className="text-muted-foreground mb-3">A good time, any day of the week.</p><dl className="hours-list">{[["Monday – Thursday", "9:00am – 11:00pm"], ["Friday – Saturday", "9:00am – 1:00am"], ["Sunday", "9:00am – 11:00pm"]].map(([day, hours]) => <div key={day}><dt>{day}</dt><dd>{hours}</dd></div>)}</dl><p className="small text-muted-foreground mt-3">Sample opening hours for this demo. Please confirm with the venue before visiting.</p></div>
    </div></div></section>
  </main><footer className="site-footer"><div className="container">Booking system<span>Demo only. No real bookings or payments.</span></div></footer></>;
}
