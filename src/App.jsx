
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AccountProvider } from "./context/AccountContext";
import { ProfileProvider } from "./context/ProfileContext";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import AccountReport from "./pages/AccountReport";
import AccountUpload from "./pages/AccountUpload";
import Profile from "./pages/Profile";
import EmptyPage from "./components/EmptyPage";

import "./App.css";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  return (
    <>
      {/* Hamburger menu */}
      <button
        type="button"
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={sidebarOpen}
      >
        <Menu size={25} />
      </button>

      {/* Dark overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={
          sidebarOpen ? "sidebar-open" : ""
        }
      >
        <Sidebar />

        {sidebarOpen && (
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={21} />
          </button>
        )}
      </div>

      {/* Header */}
      <Header />

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/accounts"
          element={<Accounts />}
        />

        <Route
          path="/account-report"
          element={<AccountReport />}
        />

        <Route
          path="/account-upload"
          element={<AccountUpload />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/contacts"
          element={
            <EmptyPage type="contacts" />
          }
        />

        <Route
          path="/leads"
          element={<EmptyPage type="leads" />}
        />

        <Route
          path="/deals"
          element={<EmptyPage type="deals" />}
        />

        <Route
          path="/feedback"
          element={
            <EmptyPage type="feedback" />
          }
        />

        <Route
          path="/inbox"
          element={<EmptyPage type="inbox" />}
        />

        <Route
          path="/jobs"
          element={<EmptyPage type="jobs" />}
        />

        <Route
          path="/test-results"
          element={
            <EmptyPage type="test-results" />
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AccountProvider>
      <ProfileProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ProfileProvider>
    </AccountProvider>
  );
}

export default App;
