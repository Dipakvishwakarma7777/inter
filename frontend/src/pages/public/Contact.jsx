import { Link } from "react-router-dom";
import { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
export default function Contact() {
  const [sent,setSent]=useState(false);
  return <div className="public-page simple-public"><header className="public-navbar"><Link className="brand" to="/">SupportDesk</Link><nav><Link to="/about">About</Link><Link to="/services">Services</Link><Link to="/faq">FAQ</Link></nav></header><main className="public-container"><span className="eyebrow">CONTACT</span><h1>Talk to our team.</h1>{sent?<div className="success-box">Thanks! Your message has been prepared.</div>:<form className="form-card contact-form" onSubmit={(e)=>{e.preventDefault();setSent(true)}}><Input label="Name" required placeholder="Your name"/><Input label="Email" type="email" required placeholder="you@example.com"/><div className="form-group"><label className="form-label">Message</label><textarea className="form-input textarea" rows="6" required placeholder="How can we help?"/></div><Button type="submit">Send Message</Button></form>}</main></div>;
}
