
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Pencil,
  Trash2,
  MoreHorizontal,
  FileSpreadsheet,
  Building2,
  ChevronUp,
  ChevronDown,
  Save,
  X
} from "lucide-react";

import { useAccounts } from "../context/AccountContext";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  website: "",
  industry: "",
  status: "Active",
  remark: ""
};

const columns = [
  { key: "name", label: "Account Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone No." },
  { key: "website", label: "Website" },
  { key: "industry", label: "Industry" },
  { key: "status", label: "Account Status" },
  { key: "remark", label: "Remark" }
];

export default function Accounts() {
  const {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount
  } = useAccounts();

  const [activeTab, setActiveTab] = useState("account");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [sort, setSort] = useState({
    key: "name",
    direction: "asc"
  });

  const [openMenu, setOpenMenu] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [formError, setFormError] = useState("");

  const menuRef = useRef(null);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  // Search and sort accounts
  const filteredAccounts = accounts
    .filter((account) => {
      const query = appliedSearch.toLowerCase().trim();

      if (!query) return true;

      return [
        account.name,
        account.email,
        account.phone,
        account.website,
        account.industry,
        account.status,
        account.remark
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const getValue = (account) => {
        const value = account[sort.key] ?? "";

        if (sort.key === "status") {
          return value === "Active" || value === true
            ? "true"
            : "false";
        }

        return String(value).toLowerCase();
      };

      const valueA = getValue(a);
      const valueB = getValue(b);

      const result = valueA.localeCompare(valueB, undefined, {
        numeric: true
      });

      return sort.direction === "asc" ? result : -result;
    });

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc"
          ? "desc"
          : "asc"
    }));
  };

  const handleCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormError("");
    setActiveTab("create");
    setOpenMenu(null);
  };

  const handleEdit = (account) => {
    setEditingId(account.id);

    setForm({
      name: account.name || "",
      email: account.email || "",
      phone: account.phone || "",
      website: account.website || "",
      industry: account.industry || "",
      status:
        account.status === "Active" ||
        account.status === true ||
        account.status === "true"
          ? "Active"
          : "Inactive",
      remark: account.remark || ""
    });

    setFormError("");
    setActiveTab("create");
    setOpenMenu(null);
  };

  const handleDelete = (account) => {
    setOpenMenu(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${account.name}"?`
    );

    if (confirmed) {
      deleteAccount(account.id);
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    setFormError("");

    const cleaned = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      website: form.website.trim(),
      industry: form.industry.trim(),
      status: form.status,
      remark: form.remark.trim()
    };

    if (
      !cleaned.name ||
      !cleaned.email ||
      !cleaned.phone ||
      !cleaned.industry
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const emailExists = accounts.some(
      (account) =>
        account.email.toLowerCase().trim() ===
          cleaned.email.toLowerCase() &&
        account.id !== editingId
    );

    if (emailExists) {
      setFormError("An account with this email already exists.");
      return;
    }

    if (editingId !== null) {
      updateAccount(editingId, cleaned);
    } else {
      addAccount(cleaned);
    }

    setEditingId(null);
    setForm({ ...emptyForm });
    setActiveTab("account");
    setAppliedSearch("");
    setSearch("");
  };

  const getWebsiteUrl = (website) => {
    if (!website) return null;

    const url = /^https?:\/\//i.test(website)
      ? website
      : `https://${website}`;

    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol)
        ? url
        : null;
    } catch {
      return null;
    }
  };

  return (
    <main className="dashboard actify-accounts-page">

      {/* Account / Create Tabs */}
      <div className="account-tabs">
        <button
          className={activeTab === "account" ? "active" : ""}
          onClick={() => {
            setActiveTab("account");
            setEditingId(null);
            setFormError("");
          }}
        >
          Account
        </button>

        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={handleCreate}
        >
          <Pencil size={14} />
          Create
        </button>
      </div>

      {activeTab === "account" ? (
        <section className="panel account-list-panel">

          {/* Title */}
          <div className="account-list-heading">
            <h3>Account Lists</h3>
            <p>Here's a list of your accounts.</p>
          </div>

          {/* Search */}
          <div className="account-search-toolbar">
            <div className="account-search-field">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search Here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setAppliedSearch(search);
                  }
                }}
              />
            </div>

            <button
              className="account-view-btn"
              onClick={() => setAppliedSearch(search)}
            >
              <FileSpreadsheet size={15} />
              View
            </button>
          </div>

          {/* Account Table */}
          <div className="actify-account-table-scroll">
            <table className="actify-account-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>
                      <button
                        className={`account-sort-btn ${
                          sort.key === column.key
                            ? "selected-sort"
                            : ""
                        }`}
                        onClick={() => handleSort(column.key)}
                      >
                        {column.label}

                        <span className="sort-arrows">
                          <ChevronUp
                            size={11}
                            className={
                              sort.key === column.key &&
                              sort.direction === "asc"
                                ? "sort-active"
                                : ""
                            }
                          />
                          <ChevronDown
                            size={11}
                            className={
                              sort.key === column.key &&
                              sort.direction === "desc"
                                ? "sort-active"
                                : ""
                            }
                          />
                        </span>
                      </button>
                    </th>
                  ))}

                  <th className="actions-heading">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAccounts.map((account) => {
                  const websiteUrl = getWebsiteUrl(account.website);

                  const isActive =
                    account.status === "Active" ||
                    account.status === true ||
                    account.status === "true";

                  return (
                    <tr key={account.id}>
                      <td className="account-name-cell">
                        {account.name}
                      </td>

                      <td>{account.email}</td>

                      <td>
                        {account.phone || (
                          <span className="account-muted">—</span>
                        )}
                      </td>

                      <td>
                        {websiteUrl ? (
                          <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="account-website-link"
                          >
                            {account.website}
                          </a>
                        ) : (
                          <span className="account-muted">n/a</span>
                        )}
                      </td>

                      <td>{account.industry || "Other"}</td>

                      <td>
                        {isActive ? "true" : "false"}
                      </td>

                      <td className="account-remark-cell">
                        <span title={account.remark || ""}>
                          {account.remark || "—"}
                        </span>
                      </td>

                      <td className="account-actions-cell">
                        <div
                          className="account-action-wrapper"
                          ref={
                            openMenu === account.id
                              ? menuRef
                              : null
                          }
                        >
                          <button
                            className="account-more-btn"
                            aria-label={`Actions for ${account.name}`}
                            aria-expanded={openMenu === account.id}
                            onClick={() =>
                              setOpenMenu(
                                openMenu === account.id
                                  ? null
                                  : account.id
                              )
                            }
                          >
                            <MoreHorizontal size={19} />
                          </button>

                          {openMenu === account.id && (
                            <div className="account-action-menu">
                              <button
                                onClick={() => handleEdit(account)}
                              >
                                <Pencil size={14} />
                                Edit
                              </button>

                              <button
                                className="delete-action"
                                onClick={() => handleDelete(account)}
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="account-no-records">
                      No accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="account-table-footer">
            Showing {filteredAccounts.length} of {accounts.length} accounts
          </div>
        </section>
      ) : (

        /* Create / Edit Account */
        <section className="panel account-create-panel">
          <div className="account-list-heading">
            <h3>
              {editingId !== null
                ? "Edit Account"
                : "Create Account"}
            </h3>
            <p>
              {editingId !== null
                ? "Update your account details."
                : "Enter the details to create a new account."}
            </p>
          </div>

          <form onSubmit={handleSave} className="account-create-form">
            {formError && (
              <div className="account-form-error">
                {formError}
              </div>
            )}

            <div className="account-form-grid">
              <div className="account-form-group">
                <label>Account Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter account name"
                />
              </div>

              <div className="account-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>

              <div className="account-form-group">
                <label>Phone No. *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>

              <div className="account-form-group">
                <label>Website</label>
                <input
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                  placeholder="example.com"
                />
              </div>

              <div className="account-form-group">
                <label>Industry *</label>
                <input
                  required
                  list="actify-industries"
                  value={form.industry}
                  onChange={(e) =>
                    setForm({ ...form, industry: e.target.value })
                  }
                  placeholder="Select or enter industry"
                />

                <datalist id="actify-industries">
                  {[
                    ...new Set([
                      "Information Technology",
                      "Healthcare",
                      "Finance",
                      "Retail",
                      "Manufacturing",
                      "Education",
                      "Real Estate",
                      "Telecommunications",
                      "Hospitality",
                      "Logistics",
                      "CCTV",
                      ...accounts.map((a) => a.industry)
                    ].filter(Boolean))
                  ].map((industry) => (
                    <option key={industry} value={industry} />
                  ))}
                </datalist>
              </div>

              <div className="account-form-group">
                <label>Account Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option value="Active">Active (true)</option>
                  <option value="Inactive">Inactive (false)</option>
                </select>
              </div>

              <div className="account-form-group full-width">
                <label>Remark</label>
                <textarea
                  rows={4}
                  value={form.remark}
                  onChange={(e) =>
                    setForm({ ...form, remark: e.target.value })
                  }
                  placeholder="Enter remarks about this account"
                />
              </div>
            </div>

            <div className="account-form-actions">
              <button
                type="button"
                className="account-cancel-btn"
                onClick={() => {
                  setActiveTab("account");
                  setEditingId(null);
                  setFormError("");
                }}
              >
                <X size={16} />
                Cancel
              </button>

              <button type="submit" className="account-save-btn">
                <Save size={16} />
                {editingId !== null
                  ? "Update Account"
                  : "Create Account"}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
