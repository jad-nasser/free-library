import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountSettingsRoute from "./components/route-components/AccountSettingsRoute";
import Footer from "./components/footer/Footer";
import User from "./components/route-components/User";
import Publisher from "./components/route-components/Publisher";
import AccountInfo from "./components/account-info/AccountInfo";
import Books from "./components/books/Books";
import ViewBook from "./components/view-book/ViewBook";

function App() {
  const themeMode = useSelector((state) => state.theme.mode);
  return (
    <>
      <div className={"App bg-" + themeMode}>
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/" element={<User />}>
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<Books isPublisher={false} />} />
            <Route path="view-book" element={<ViewBook />} />
          </Route>
          <Route path="/publisher" element={<Publisher />}>
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<Books isPublisher={true} />} />
            <Route path="account-settings" element={<AccountSettingsRoute />}>
              <Route index element={<Navigate to="account-info" />} />
              <Route path="account-info" element={<AccountInfo />} />
            </Route>
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
