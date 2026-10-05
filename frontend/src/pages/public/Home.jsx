import { Link } from "react-router-dom";
import { ArrowRight, Headphones, ShieldCheck, Ticket, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="public-page">
      <header className="public-navbar">
        <Link className="brand" to="/">SupportDesk</Link>
        <nav><Link to="/about">About</Link><Link to="/services">Services</Link><Link to="/faq">FAQ</Link><Link to="/contact">Contact</Link></nav>
        <div className="public-actions"><Link className="btn btn-ghost btn-sm" to="/login">Login</Link><Link className="btn btn-primary btn-sm" to="/register">Get Started</Link></div>
      </header>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">CUSTOMER SUPPORT PLATFORM</span>
          <h1>Support your customers <span>better and faster.</span></h1>
          <p>Create tickets, communicate with support agents, track progress, and resolve issues from one simple workspace.</p>
          <div className="hero-actions"><Link className="btn btn-primary btn-lg" to="/register">Create Account <ArrowRight size={18}/></Link><Link className="btn btn-secondary btn-lg" to="/login">Sign In</Link></div>
        </div>
      </section>
      <section className="feature-grid">
        <div className="feature"><Ticket /><h3>Smart Ticketing</h3><p>Organize every customer issue with statuses, priorities and categories.</p></div>
        <div className="feature"><Headphones /><h3>Agent Collaboration</h3><p>Give agents a focused workspace to manage and resolve assigned tickets.</p></div>
        <div className="feature"><Zap /><h3>Fast Resolution</h3><p>Keep conversations and ticket history together for quicker solutions.</p></div>
        <div className="feature"><ShieldCheck /><h3>Role Security</h3><p>Separate customer, agent and administrator access with protected routes.</p></div>
      </section>
    </div>
  );
}
