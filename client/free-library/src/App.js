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
import SignIn from "./components/sign-in/SignIn";
import SignUp from "./components/sign-up/SignUp";
import EditName from "./components/edit-name/EditName";
import EditEmail from "./components/edit-email/EditEmail";

function App() {
  const themeMode = useSelector((state) => state.theme.mode);
  let textColor = "dark";
  if (themeMode === "dark") textColor = "light";
  return (
    <>
      <div className={"App bg-" + themeMode + " text-" + textColor}>
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/" element={<User />}>
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<Books isPublisher={false} />} />
            <Route path="view-book" element={<ViewBook />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
          </Route>
          <Route path="/publisher" element={<Publisher />}>
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<Books isPublisher={true} />} />
            <Route path="account-settings" element={<AccountSettingsRoute />}>
              <Route index element={<Navigate to="account-info" />} />
              <Route path="account-info" element={<AccountInfo />} />
              <Route path="change-name" element={<EditName />} />
              <Route path="change-email" element={<EditEmail />} />
            </Route>
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
