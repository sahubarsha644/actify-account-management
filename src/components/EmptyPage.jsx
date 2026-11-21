
import { Construction } from "lucide-react";

const pageContent = {
  contacts: {
    title: "Contact",
    description: "Manage individual contacts linked to your accounts."
  },
  leads: {
    title: "Lead",
    description: "Track and manage incoming leads from your campaigns."
  },
  deals: {
    title: "Deal",
    description: "Manage and track your business deals."
  },
  feedback: {
    title: "Feedback",
    description: "View and manage feedback."
  },
  inbox: {
    title: "Inbox",
    description: "View your messages and notifications."
  },
  jobs: {
    title: "My Jobs",
    description: "Manage your job applications."
  },
  "test-results": {
    title: "Test Results",
    description: "View your test results."
  }
};

export default function EmptyPage({ type }) {
  const page = pageContent[type] || {
    title: "Coming Soon",
    description: "This feature is under development."
  };

  return (
    <main className="empty-page">
      <div className="empty-page-content">
        <div className="empty-page-icon">
          <Construction size={30} strokeWidth={1.8} />
        </div>

        <h2>{page.title}</h2>
        <p>{page.description}</p>
      </div>
    </main>
  );
}
