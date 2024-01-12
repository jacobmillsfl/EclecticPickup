import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainNav from "./Components/Navigation/MainNav";
import "./App.css";
import MediaComponent from "./Components/MediaPlayer/MediaComponent";
import Footer from "./Components/Footer/Footer";
import LandingPage from "./Views/LandingPage";
import { useEffect } from "react";
import { RegisterComponent } from "./Views/Auth/Register";
import { LoginComponent } from "./Views/Auth/Login";
import { AdminComponent } from "./Views/Admin/Admin";
import { LogOutComponent } from "./Views/Auth/Logout";
import AuthManager from "./Utilities/AuthManager";
import { CreateEvent } from "./Views/Admin/CreateEvent";

function App() {
  const isAuthenticated = AuthManager.isAuthenticated();

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
              path="/register"
              element={
                !isAuthenticated ? (
                  <RegisterComponent />
                ) : (
                  <Navigate to="/admin" />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isAuthenticated ? <LoginComponent /> : <Navigate to="/admin" />
              }
            />
            <Route
              path="/admin"
              element={
                isAuthenticated ? <AdminComponent /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/logout"
              element={
                isAuthenticated ? <LogOutComponent /> : <Navigate to="/login" />
              }
            />
            {/* <Route
              path="/create-event"
              element={
                isAuthenticated ? <CreateEvent /> : <Navigate to="/login" />
              }
            /> */}
          </Routes>
          <Footer />
        </MediaComponent>
      </div>
    </Router>
  );
}

export default App;
