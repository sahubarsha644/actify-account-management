
import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Dashboard",
  "/accounts": "Accounts",
  "/account-report": "Account Report",
  "/account-upload": "Account Upload",
  "/contacts": "Contacts",
  "/leads": "Leads",
  "/deals": "Deals",
  "/feedback": "Feedback",
  "/profile": "Profile",
  "/inbox": "Inbox",
  "/jobs": "My Jobs",
  "/test-results": "Test Results"
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setShowProfileMenu(false);
  }, [location.pathname]);

  return (
    <header className="top-header">
      <div className="header-title">
        <strong>{title}</strong>
        <small>Actify Business › {title}</small>
      </div>

      <div className="header-right">
        {/* Notification Bell */}
        <button
          type="button"
          className="notification"
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span></span>
        </button>

        {/* Profile Dropdown */}
        <div className="profile-dropdown" ref={profileRef}>
          <button
            type="button"
            className="header-user profile-trigger"
            aria-haspopup="menu"
            aria-expanded={showProfileMenu}
            onClick={() =>
              setShowProfileMenu((prev) => !prev)
            }
          >
            <div className="avatar">D</div>
            <span>Deepu</span>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown-menu" role="menu">
              <Link
                to="/profile"
                role="menuitem"
                onClick={() => setShowProfileMenu(false)}
              >
                Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
