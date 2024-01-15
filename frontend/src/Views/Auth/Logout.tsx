import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthManager from "../../Utilities/AuthManager";

export const LogOutComponent: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      AuthManager.setAuthToken("");
      navigate("/login");
    };

    logout();
  }, [navigate]);
  return <></>;
};
