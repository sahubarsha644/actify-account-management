
import { useState } from "react";
import {
  Zap,
  LayoutDashboard,
  Building2,
  Users,
  TrendingUp,
  Handshake,
  MessageSquare,
  UserCircle,
  Inbox,
  BriefcaseBusiness,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  FileBarChart,
  Upload,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

export default function Sidebar() {
  const [expanded, setExpanded] = useState({
    account: true,
    contact: false,
    lead: false,
    deal: true,
  });

  const { profile } = useProfile();

  const personal = profile?.personal || {};

  const fullName = [
    personal.firstName,
    personal.middleName,
    personal.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const displayName = fullName || "User";
  const displayEmail =
    personal.email || "No email added";

  const avatarLetter = displayName
    .charAt(0)
    .toUpperCase();

  const toggle = (key) =>
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

  const navClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Zap size={17} />
        </div>

        <div>
          <strong>Actify</strong>
          <small>BUSINESS</small>
        </div>
      </div>

      <nav className="side-nav">
        <NavLink to="/" className={navClass}>
          <LayoutDashboard size={15} />
          Dashboard
        </NavLink>

        <button
          className="nav-link"
          onClick={() => toggle("account")}
        >
          <Building2 size={15} />
          Account

          {expanded.account ? (
            <ChevronDown size={13} />
          ) : (
            <ChevronRight size={13} />
          )}
        </button>

        {expanded.account && (
          <div className="submenu">
            <NavLink
              to="/accounts"
              className={navClass}
            >
              <Building2 size={13} />
              Accounts
            </NavLink>

            <NavLink
              to="/account-report"
              className={navClass}
            >
              <FileBarChart size={13} />
              Account Report
            </NavLink>

            <NavLink
              to="/account-upload"
              className={navClass}
            >
              <Upload size={13} />
              Account Upload
            </NavLink>
          </div>
        )}

        <button
          className="nav-link"
          onClick={() => toggle("contact")}
        >
          <Users size={15} />
          Contact

          {expanded.contact ? (
            <ChevronDown size={13} />
          ) : (
            <ChevronRight size={13} />
          )}
        </button>

        {expanded.contact && (
          <div className="submenu">
            <NavLink
              to="/contacts"
              className={navClass}
            >
              All Contacts
            </NavLink>
          </div>
        )}

        <button
          className="nav-link"
          onClick={() => toggle("lead")}
        >
          <TrendingUp size={15} />
          Lead

          {expanded.lead ? (
            <ChevronDown size={13} />
          ) : (
            <ChevronRight size={13} />
          )}
        </button>

        {expanded.lead && (
          <div className="submenu">
            <NavLink
              to="/leads"
              className={navClass}
            >
              All Leads
            </NavLink>
          </div>
        )}

        <button
          className="nav-link"
          onClick={() => toggle("deal")}
        >
          <Handshake size={15} />
          Deal

          {expanded.deal ? (
            <ChevronDown size={13} />
          ) : (
            <ChevronRight size={13} />
          )}
        </button>

        {expanded.deal && (
          <div className="submenu">
            <NavLink
              to="/deals"
              className={navClass}
            >
              <Handshake size={13} />
              All Deals
            </NavLink>
          </div>
        )}

        <NavLink
          to="/feedback"
          className={navClass}
        >
          <MessageSquare size={15} />
          Feedback
        </NavLink>

        <NavLink
          to="/profile"
          className={navClass}
        >
          <UserCircle size={15} />
          Profile
        </NavLink>

        <NavLink
          to="/inbox"
          className={navClass}
        >
          <Inbox size={15} />
          Inbox
        </NavLink>

        <NavLink
          to="/jobs"
          className={navClass}
        >
          <BriefcaseBusiness size={15} />
          My Jobs
        </NavLink>

        <NavLink
          to="/test-results"
          className={navClass}
        >
          <ClipboardList size={15} />
          Test Results
        </NavLink>
      </nav>

      {/* Dynamic Profile */}
      <NavLink
        to="/profile"
        className="sidebar-user"
        style={{ textDecoration: "none" }}
      >
        <div className="avatar">
          {avatarLetter}
        </div>

        <div style={{ minWidth: 0 }}>
          <strong
            style={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayName}
          </strong>

          <small
            style={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayEmail}
          </small>
        </div>
      </NavLink>
    </aside>
  );
}
