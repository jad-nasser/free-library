import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountSettingsRoute from "./components/route-components/AccountSettingsRoute";
import Footer from "./components/footer/Footer";
import User from "./components/route-components/User";
import Publisher from "./components/route-components/Publisher";

function App() {
  const themeMode = useSelector((state) => state.theme.mode);
  return (
    <>
      <div className={"App bg-" + themeMode}>
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/" element={<User />}></Route>
          <Route path="/publisher" element={<Publisher />}>
            <Route
              path="account-settings"
              element={<AccountSettingsRoute />}
            ></Route>
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
