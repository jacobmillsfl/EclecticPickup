import React from "react";
import AuthManager from "../../Utilities/AuthManager";

export const LogOutComponent: React.FC = () => {
  AuthManager.setAuthToken("");
  window.location.href = "/login";

  return (
    <>
    </>
  );
};

