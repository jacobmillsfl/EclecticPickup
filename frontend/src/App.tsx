import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import MainNav from "./Components/Navigation/MainNav";
import "./App.css";
import MediaComponent from "./Components/MediaPlayer/MediaComponent";
import Footer from "./Components/Footer/Footer";
import LandingPage from "./Views/LandingPage";
import { useEffect } from "react";
import { LoginComponent } from "./Views/Auth/Login";
import { AdminComponent } from "./Views/Admin/Admin";
import { LogOutComponent } from "./Views/Auth/Logout";
import AuthManager from "./Utilities/AuthManager";

function App() {
  useEffect(() => {
    console.error = (message) => {
      if (
        message.includes(
          "ResizeObserver loop completed with undelivered notifications"
        )
      ) {
        // Ignore the specific error message
        return;
      }
      // For other errors, log as usual
      console.error(message);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <MediaComponent className="mediaComponent">
          <MainNav />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={<LoginComponent />}
            />
            <Route
              path="/admin"
              element={<AdminComponent />}
            />
            <Route
              path="/logout"
              element={<LogOutComponent />}
            />
          </Routes>
          <Footer />
        </MediaComponent>
      </div>
    </Router>
  );
}

export default App;
