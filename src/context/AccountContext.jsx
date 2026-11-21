
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { initialAccounts } from "../data/sampleData";

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem("actify_accounts");
      return saved ? JSON.parse(saved) : initialAccounts;
    } catch {
      return initialAccounts;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "actify_accounts",
      JSON.stringify(accounts)
    );
  }, [accounts]);

  const addAccount = (account) => {
    setAccounts((prev) => [
      ...prev,
      {
        ...account,
        id: crypto.randomUUID()
      }
    ]);
  };

  const deleteAccount = (id) => {
    setAccounts((prev) =>
      prev.filter((account) => account.id !== id)
    );
  };

  const updateAccount = (id, updatedData) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id
          ? { ...account, ...updatedData }
          : account
      )
    );
  };

  return (
    <AccountContext.Provider
      value={{
        accounts,
        addAccount,
        deleteAccount,
        updateAccount
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccounts() {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error(
      "useAccounts must be used inside AccountProvider"
    );
  }

  return context;
}
