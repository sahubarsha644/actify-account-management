
import { useRef, useState } from "react";
import { Upload, Download, FileText, CheckCircle2, AlertCircle, X } from "lucide-react";
import Papa from "papaparse";
import { useAccounts } from "../context/AccountContext";

const columns = [
  "AccountName",
  "Email",
  "Phone",
  "Industry",
  "Status"
];

const sampleCSV = [
  ["AccountName", "Email", "Phone", "Industry", "Status"],
  ["Astra Solutions", "contact@astra.com", "9876543210", "Information Technology", "Active"],
  ["Bright Healthcare", "hello@bright.com", "9876543211", "Healthcare", "Inactive"]
];

function validateRow(row) {
  const errors = [];

  if (!row.AccountName?.trim()) {
    errors.push("Account name is required");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.Email?.trim() || "")) {
    errors.push("Valid email is required");
  }

  if (!/^\+?[\d\s()-]{7,20}$/.test(row.Phone?.trim() || "")) {
    errors.push("Valid phone is required");
  }

  if (
    row.Status?.trim() &&
    !["active", "inactive"].includes(row.Status.trim().toLowerCase())
  ) {
    errors.push("Status must be Active or Inactive");
  }

  return errors;
}

export default function AccountUpload() {
  const { accounts, addAccount } = useAccounts();

  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validRows = rows.filter((row) => row.errors.length === 0);
  const invalidRows = rows.filter((row) => row.errors.length > 0);

  const downloadTemplate = () => {
    const csv = Papa.unparse(sampleCSV);
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "actify_account_template.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleFile = (file) => {
    if (!file) return;

    setRows([]);
    setFileName("");
    setMessage("");
    setError("");

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file only.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const headers = results.meta.fields || [];

        const missing = ["AccountName", "Email", "Phone"].filter(
          (field) => !headers.includes(field)
        );

        if (missing.length > 0) {
          setError(`Missing required columns: ${missing.join(", ")}`);
          return;
        }

        if (results.errors.length > 0) {
          setError("CSV contains parsing errors. Please check the file format.");
          return;
        }

        const parsed = results.data.map((row, index) => ({
          ...row,
          _rowNumber: index + 2,
          errors: validateRow(row)
        }));

        setRows(parsed);
        setFileName(file.name);
      },
      error: () => {
        setError("Unable to read CSV file.");
      }
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const importRecords = () => {
    if (validRows.length === 0) return;

    const existingEmails = new Set(
      accounts.map((account) => account.email.toLowerCase().trim())
    );

    let imported = 0;
    let skipped = 0;

    validRows.forEach((row) => {
      const email = row.Email.trim().toLowerCase();

      if (existingEmails.has(email)) {
        skipped++;
        return;
      }

      addAccount({
        name: row.AccountName.trim(),
        email: row.Email.trim(),
        phone: row.Phone.trim(),
        industry: row.Industry?.trim() || "Other",
        status:
          row.Status?.trim().toLowerCase() === "inactive"
            ? "Inactive"
            : "Active"
      });

      existingEmails.add(email);
      imported++;
    });

    setRows([]);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    setMessage(
      `${imported} account(s) imported successfully. ${skipped} duplicate email(s) skipped.`
    );
  };

  return (
    <main className="dashboard account-upload">
      <div className="page-heading">
        <div>
          <h2>Account Upload</h2>
          <p>
            Import account records from a CSV file.
            Preview and validate before importing.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <section className="panel upload-instructions">
        <div>
          <h3>How to use</h3>
          <ol>
            <li>Download the CSV template to see the required column format.</li>
            <li>
              Fill in your account data — <code>AccountName</code>,{" "}
              <code>Email</code>, and <code>Phone</code> are required.
            </li>
            <li>Upload your completed CSV file.</li>
            <li>Review the preview — invalid rows are highlighted in red.</li>
            <li>
              Click <strong>Import Valid Records</strong> to add them to your account list.
            </li>
          </ol>
        </div>

        <button className="template-btn" onClick={downloadTemplate}>
          <Download size={16} />
          Download Template
        </button>
      </section>

      {/* File selection */}
      <section className="panel upload-file-panel">
        <h3>Select CSV File</h3>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          hidden
          onChange={(event) => handleFile(event.target.files[0])}
        />

        <div
          className={`upload-dropzone ${dragging ? "dragging" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <Upload size={32} strokeWidth={1.8} />
          <strong>Click to browse or drag & drop</strong>
          <small>Only .csv files are accepted</small>
        </div>
      </section>

      {error && (
        <div className="upload-alert upload-error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {message && (
        <div className="upload-alert upload-success">
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      {/* Empty state */}
      {rows.length === 0 && !fileName && (
        <div className="upload-empty">
          <FileText size={38} strokeWidth={1.6} />
          <strong>No file selected</strong>
          <p>Upload a CSV file above to preview and import accounts.</p>
        </div>
      )}

      {/* CSV Preview */}
      {fileName && (
        <section className="panel upload-preview">
          <div className="upload-preview-header">
            <div>
              <h3>CSV Preview</h3>
              <p>{fileName}</p>
            </div>

            <button
              className="upload-clear-btn"
              onClick={() => {
                setRows([]);
                setFileName("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <X size={16} /> Clear
            </button>
          </div>

          <div className="upload-preview-stats">
            <span>Total: {rows.length}</span>
            <span className="preview-valid">Valid: {validRows.length}</span>
            <span className="preview-invalid">Invalid: {invalidRows.length}</span>
          </div>

          <div className="upload-table-scroll">
            <table className="upload-table">
              <thead>
                <tr>
                  <th>ROW</th>
                  {columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                  <th>VALIDATION</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row._rowNumber}
                    className={row.errors.length ? "invalid-row" : ""}
                  >
                    <td>{row._rowNumber}</td>
                    {columns.map((column) => (
                      <td key={column}>{row[column] || "—"}</td>
                    ))}
                    <td>
                      {row.errors.length ? (
                        <span className="row-error">
                          {row.errors.join(", ")}
                        </span>
                      ) : (
                        <span className="row-valid">Valid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="upload-import-footer">
            <span>
              {validRows.length} valid record(s) ready to import
            </span>

            <button
              className="primary-btn"
              disabled={validRows.length === 0}
              onClick={importRecords}
            >
              <Upload size={16} />
              Import Valid Records
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
