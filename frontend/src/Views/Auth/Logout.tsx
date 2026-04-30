import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthManager from "../../Utilities/AuthManager";
import appContext from "../../Contexts/AppContext";

export const LogOutComponent: React.FC = () => {
  const { setLoggedIn } = useContext(appContext);
  const navigate = useNavigate();

  useEffect(() => {
    AuthManager.clearAuthToken();
    setLoggedIn(false);
    navigate("/login", { replace: true });
  }, [navigate, setLoggedIn]);

  return null;
};
