import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountSettings from "./components/account-settings/AccountSettings";

function App() {
  const themeMode = useSelector((state) => state.theme.mode);
  return (
    <div className={"App bg-" + themeMode}>
      <Routes>
        <Route path="/"></Route>
        <Route path="/publisher">
          <Route path="account-settings" element={<AccountSettings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
