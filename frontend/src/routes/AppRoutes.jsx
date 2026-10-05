import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Services from "../pages/public/Services";
import FAQ from "../pages/public/FAQ";
import Contact from "../pages/public/Contact";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import MyTickets from "../pages/customer/MyTickets";
import CreateTicket from "../pages/customer/CreateTicket";
import TicketDetails from "../pages/customer/TicketDetails";
import Profile from "../pages/customer/Profile";

import AgentDashboard from "../pages/agent/AgentDashboard";
import AssignedTickets from "../pages/agent/AssignedTickets";
import AgentTicketDetails from "../pages/agent/AgentTicketDetails";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Users from "../pages/admin/Users";
import Agents from "../pages/admin/Agents";
import AllTickets from "../pages/admin/AllTickets";
import Categories from "../pages/admin/Categories";
import Analytics from "../pages/Analytics";
import KnowledgeBase from "../pages/KnowledgeBase";
import Notifications from "../pages/Notifications";
import AIAssistant from "../pages/AIAssistant";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/tickets" element={<MyTickets />} />
          <Route path="/tickets/new" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/ai" element={<AIAssistant />} />

          <Route element={<RoleRoute roles={["agent"]} />}>
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/agent/tickets" element={<AssignedTickets />} />
            <Route path="/agent/tickets/:id" element={<AgentTicketDetails />} />
          </Route>

          <Route element={<RoleRoute roles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/agents" element={<Agents />} />
            <Route path="/admin/tickets" element={<AllTickets />} />
            <Route path="/admin/categories" element={<Categories />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
