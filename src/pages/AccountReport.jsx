
import {
  Building2,
  CheckCircle2,
  XCircle,
  Activity,
  PieChart,
  ChartColumn,
  TrendingUp
} from "lucide-react";

import { useAccounts } from "../context/AccountContext";

const colors = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#f43f5e",
  "#06b6d4",
  "#f97316",
  "#14b8a6",
  "#6366f1",
  "#ec4899"
];

export default function AccountReport() {
  const { accounts } = useAccounts();

  const total = accounts.length;
  const active = accounts.filter(
    (account) => account.status === "Active"
  ).length;
  const inactive = total - active;

  const activeRate = total ? (active / total) * 100 : 0;
  const inactiveRate = total ? (inactive / total) * 100 : 0;

  const industryMap = accounts.reduce((map, account) => {
    const name = (account.industry || "Other").trim() || "Other";
    const key = name.toLowerCase();

    if (!map[key]) {
      map[key] = {
        name,
        count: 0,
        active: 0,
        inactive: 0
      };
    }

    map[key].count++;

    if (account.status === "Active") {
      map[key].active++;
    } else {
      map[key].inactive++;
    }

    return map;
  }, {});

  const industries = Object.values(industryMap)
    .sort((a, b) => b.count - a.count);

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
      sub: `${Math.round(activeRate)}% of total`,
      icon: CheckCircle2,
      color: "green"
    },
    {
      title: "INACTIVE",
      value: inactive,
      sub: `${Math.round(inactiveRate)}% of total`,
      icon: XCircle,
      color: "gray"
    },
    {
      title: "INDUSTRIES",
      value: industries.length,
      sub: "Unique sectors",
      icon: Activity,
      color: "purple"
    }
  ];

  return (
    <main className="dashboard account-report">
      <div className="page-heading">
        <div>
          <h2>Account Report</h2>
          <p>
            Live analytics derived from your account dataset.
            Figures update automatically when accounts change.
          </p>
        </div>
      </div>

      {/* Statistics */}
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

      {/* Report charts */}
      <section className="report-grid">
        <div className="panel report-panel">
          <div className="panel-header report-panel-title">
            <strong>
              <PieChart size={17} color="#2860ed" />
              Status Distribution
            </strong>
          </div>

          <div className="report-body">
            <div className="distribution-bar">
              <div
                className="distribution-active"
                style={{ width: `${activeRate}%` }}
              />
              <div
                className="distribution-inactive"
                style={{ width: `${inactiveRate}%` }}
              />
            </div>

            <div className="distribution-legend">
              <div>
                <span className="legend-dot green-dot" />
                Active — <b>{active}</b> ({Math.round(activeRate)}%)
              </div>
              <div>
                <span className="legend-dot gray-dot" />
                Inactive — <b>{inactive}</b> ({Math.round(inactiveRate)}%)
              </div>
            </div>

            <div className="report-metrics">
              <div className="report-metric">
                <span>ACTIVE RATE</span>
                <strong className="metric-green">
                  {Math.round(activeRate)}%
                </strong>
              </div>
              <div className="report-metric">
                <span>INACTIVE RATE</span>
                <strong className="metric-gray">
                  {Math.round(inactiveRate)}%
                </strong>
              </div>
              <div className="report-metric">
                <span>TOTAL RECORDS</span>
                <strong className="metric-blue">{total}</strong>
              </div>
              <div className="report-metric">
                <span>SECTORS</span>
                <strong className="metric-purple">
                  {industries.length}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="panel report-panel">
          <div className="panel-header report-panel-title">
            <strong>
              <ChartColumn size={17} color="#2860ed" />
              Industry Breakdown
            </strong>
          </div>

          <div className="breakdown-list">
            {industries.length === 0 ? (
              <p className="report-empty">No industry data available</p>
            ) : (
              industries.map((industry, index) => {
                const percentage = total
                  ? (industry.count / total) * 100
                  : 0;

                return (
                  <div className="breakdown-item" key={industry.name}>
                    <div className="breakdown-label">
                      <span>
                        <i
                          className="industry-dot"
                          style={{
                            backgroundColor: colors[index % colors.length]
                          }}
                        />
                        {industry.name}
                      </span>
                      <small>
                        {industry.count} • {Math.round(percentage)}%
                      </small>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: colors[index % colors.length]
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* All Industries Summary */}
      <section className="panel industry-summary">
        <div className="panel-header report-panel-title">
          <strong>
            <TrendingUp size={17} color="#2860ed" />
            All Industries Summary
          </strong>
          <span className="summary-total">
            {total} total accounts
          </span>
        </div>

        <div className="report-table-scroll">
          <table className="report-table">
            <thead>
              <tr>
                <th>INDUSTRY</th>
                <th>COUNT</th>
                <th>ACTIVE</th>
                <th>INACTIVE</th>
                <th>SHARE</th>
              </tr>
            </thead>

            <tbody>
              {industries.map((industry, index) => (
                <tr key={industry.name}>
                  <td>
                    <div className="industry-cell">
                      <span
                        className="industry-dot"
                        style={{
                          backgroundColor: colors[index % colors.length]
                        }}
                      />
                      {industry.name}
                    </div>
                  </td>

                  <td className="count-cell">{industry.count}</td>

                  <td>
                    <span className="report-pill active-pill">
                      {industry.active}
                    </span>
                  </td>

                  <td>
                    <span className="report-pill inactive-pill">
                      {industry.inactive}
                    </span>
                  </td>

                  <td>
                    {total
                      ? ((industry.count / total) * 100).toFixed(1)
                      : "0.0"}%
                  </td>
                </tr>
              ))}

              {industries.length === 0 && (
                <tr>
                  <td colSpan={5} className="report-empty">
                    No account records available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
