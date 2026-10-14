import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return <header className="site-header"><div className="container site-header-inner">
    <Link to="/" className="brand" aria-label="Booking system home">
      <span className="brand-symbol" aria-hidden="true"><svg viewBox="0 0 32 40" fill="none"><path d="M16 3c-4 0-6 3-6 6 0 4 3 5 2 9-1 4-6 8-6 13 0 5 4 6 10 6s10-1 10-6c0-5-5-9-6-13-1-4 2-5 2-9 0-3-2-6-6-6Z" fill="currentColor"/><path d="M11 14h10M11 18h10" stroke="var(--primary)" strokeWidth="2"/></svg></span>
      <span className="brand-text">Booking system<span>LANES & GOOD TIMES</span></span>
    </Link>
    <nav className="site-nav" aria-label="Main navigation"><Link to="/" className="home-nav">Home</Link><Button asChild variant="outline" className="header-book"></Button></nav>
  </div></header>;
}