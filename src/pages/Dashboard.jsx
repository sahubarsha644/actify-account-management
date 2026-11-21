
import {
  Building2,
  CheckCircle2,
  XCircle,
  Activity,
  Users,
  TrendingUp,
  Handshake,
  ArrowUpRight
} from "lucide-react";

import { Link } from "react-router-dom";
import { useAccounts } from "../context/AccountContext";

export default function Dashboard() {
  const { accounts } = useAccounts();

  const total = accounts.length;
  const active = accounts.filter(
    (a) => a.status === "Active"
  ).length;

  const inactive = total - active;

  const industryCounts = accounts.reduce((result, account) => {
    const industry = account.industry || "Other";
    result[industry] = (result[industry] || 0) + 1;
    return result;
  }, {});

const industries = Object.entries(industryCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

  const stats = [
    {
      title: "TOTAL ACCOUNTS",
      value: total,
      sub: "All records",
      icon: Building2,
      color: "blue"
    },
    {
      title: "ACTIVE",
      value: active,
      sub: `${total ? Math.round((active / total) * 100) : 0}% of total`,
      icon: CheckCircle2,
      color: "green"
    },
    {
      title: "INACTIVE",
      value: inactive,
      sub: "Needs re-engagement",
      icon: XCircle,
      color: "gray"
    },
    {
      title: "INDUSTRIES",
      value: Object.keys(industryCounts).length,
      sub: "Sectors covered",
      icon: Activity,
      color: "purple"
    }
  ];

  return (
    <main className="dashboard">
      <div className="page-heading">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back! Here's your business overview.</p>
        </div>
        <Link to="/accounts" className="view-link">
          View Accounts <ArrowUpRight size={14} />
        </Link>
      </div>

      <section className="stats-grid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div className="stat-card" key={item.title}>
              <div>
                <span className="stat-title">{item.title}</span>
                <h2>{item.value}</h2>
                <p>{item.sub}</p>
              </div>

              <div className={`stat-icon ${item.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </section>

      <section className="content-grid">
        <div className="panel recent-panel">
          <div className="panel-header">
            <strong>Recent Accounts</strong>
            <Link to="/accounts">View all</Link>
          </div>

          {accounts.length === 0 ? (
            <p style={{ padding: 20, color: "#94a3b8" }}>
              No accounts available
            </p>
          ) : (
            accounts.slice(-5).reverse().map((account) => (
              <div className="account-row" key={account.id}>
                <div className="account-letter">
                  {account.name.charAt(0).toUpperCase()}
                </div>

                <div className="account-info">
                  <strong>{account.name}</strong>
                  <small>{account.email}</small>
                </div>

                <span className={`status ${account.status.toLowerCase()}`}>
                  {account.status}
                </span>
              </div>
            ))
          )}
        </div>

       
<div className="panel industries-panel">
  <div className="panel-header">
    <strong>Top Industries</strong>
  </div>

  {industries.length === 0 ? (
    <p style={{ padding: 20, color: "#94a3b8" }}>
      No industries available
    </p>
  ) : (
    industries.map(([industry, count]) => (
      <div className="industry-row" key={industry}>
        <div className="industry-info">
          <span>{industry}</span>
          <small>{count} {count === 1 ? "account" : "accounts"}</small>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${total ? (count / total) * 100 : 0}%`
            }}
          />
        </div>
      </div>
    ))
  )}
</div>

      </section>

      <section className="quick-grid">
        <Link to="/contacts" className="quick-card">
          <div className="quick-icon"><Users size={17} /></div>
          <strong>Contacts</strong>
          <p>Manage your contact records</p>
        </Link>

        <Link to="/leads" className="quick-card">
          <div className="quick-icon"><TrendingUp size={17} /></div>
          <strong>Leads</strong>
          <p>Track incoming leads</p>
        </Link>

        <Link to="/deals" className="quick-card">
          <div className="quick-icon"><Handshake size={17} /></div>
          <strong>Deals</strong>
          <p>Monitor your deal pipeline</p>
        </Link>
      </section>
    </main>
  );
}
