import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainNav from "./Components/Navigation/MainNav";
import "./App.css";
import AppContextProvider from "./Contexts/AppContextProvider";
import Footer from "./Components/Footer/Footer";
import LandingPage from "./Views/LandingPage";
import { LoginComponent } from "./Views/Auth/Login";
import { AdminComponent } from "./Views/Admin/Admin";
import { LogOutComponent } from "./Views/Auth/Logout";
import { RequireAuth } from "./Views/Auth/RequireAuth";

function App() {
  return (
    <Router>
      <div className="App">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <AppContextProvider>
          <MainNav />
          <main id="main-content" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginComponent />} />
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <AdminComponent />
                  </RequireAuth>
                }
              />
              <Route path="/logout" element={<LogOutComponent />} />
            </Routes>
          </main>
          <Footer />
        </AppContextProvider>
      </div>
    </Router>
  );
}

export default App;
