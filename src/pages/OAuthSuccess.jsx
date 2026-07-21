import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

function OAuthSuccess() {
  const navigate =
    useNavigate();

  const {
    completeGoogleLogin,
  } = useAuth();

  const [error, setError] =
    useState("");

  useEffect(() => {
    try {
      const params =
        new URLSearchParams(
          window.location.search
        );

      const token =
        params.get("token");

      if (!token) {
        throw new Error(
          "Google login token not found."
        );
      }

      const loggedInUser =
        completeGoogleLogin(
          token
        );

      window.history.replaceState(
        {},
        document.title,
        "/oauth-success"
      );

      navigate(
        loggedInUser.role === "ADMIN"
          ? "/admin"
          : loggedInUser.role === "DRIVER"
            ? "/driver"
            : "/cars",
        {
          replace: true,
        }
      );
    } catch (oauthError) {
      console.error(
        "Google authentication error:",
        oauthError
      );

      setError(
        oauthError.message ||
        "Google login failed."
      );

      setTimeout(() => {
        navigate(
          "/",
          {
            replace: true,
          }
        );
      }, 3000);
    }
  }, [
    completeGoogleLogin,
    navigate,
  ]);

  return (
    <main className="page-center">
      {error ? (
        <div>
          <h2>
            Google login failed
          </h2>

          <p>{error}</p>

          <p>
            Redirecting to login...
          </p>
        </div>
      ) : (
        <div>
          <h2>
            Signing you in...
          </h2>

          <p>
            Please wait while we complete
            your Google authentication.
          </p>
        </div>
      )}
    </main>
  );
}

export default OAuthSuccess;