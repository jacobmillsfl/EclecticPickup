import React, { useContext, useLayoutEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import appContext from "../../Contexts/AppContext";
import AuthManager from "../../Utilities/AuthManager";

type RequireAuthProps = {
  children: React.ReactElement;
};

/**
 * Renders children only when a non-expired JWT is present. Syncs appContext.loggedIn
 * and sends unauthenticated users to /login.
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { setLoggedIn } = useContext(appContext);
  const location = useLocation();
  const ok = AuthManager.isAuthenticated();

  useLayoutEffect(() => {
    setLoggedIn(ok);
  }, [ok, setLoggedIn]);

  if (!ok) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};
