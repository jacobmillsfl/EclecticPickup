import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthManager from "../../Utilities/AuthManager";
import appContext from "../../Contexts/AppContext";

export const LogOutComponent: React.FC = () => {
  const { setLoggedIn } = useContext(appContext);
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      AuthManager.setAuthToken("");
      navigate("/login");
      setLoggedIn(false);
    };

    logout();
  }, [navigate]);
  return <></>;
};
