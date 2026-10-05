import { Link } from "react-router-dom";
const services = [["Ticket Management","Create, categorize, prioritize and track support requests."],["Agent Workspace","Give support agents a focused list of assigned tickets and conversations."],["Administration","Manage users, agents, categories and all tickets from one place."],["Customer Portal","Let customers follow ticket status and communicate with support."]];
export default function Services() {
  return <div className="public-page simple-public"><header className="public-navbar"><Link className="brand" to="/">SupportDesk</Link><nav><Link to="/about">About</Link><Link to="/faq">FAQ</Link><Link to="/contact">Contact</Link></nav></header><main className="public-container"><span className="eyebrow">SERVICES</span><h1>Everything needed for support operations.</h1><div className="service-grid">{services.map(([title,text])=><div className="info-card" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div></main></div>;
}
