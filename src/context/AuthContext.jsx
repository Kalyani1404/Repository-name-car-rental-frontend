import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

const AuthContext = createContext(null);

const decodeJwt = (token) => {
  try {
    if (!token) {
      return null;
    }

    const payloadPart = token.split(".")[1];

    if (!payloadPart) {
      return null;
    }

    const normalizedPayload = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length +
        ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    );

    const decodedPayload = decodeURIComponent(
      window
        .atob(paddedPayload)
        .split("")
        .map(
          (character) =>
            `%${character
              .charCodeAt(0)
              .toString(16)
              .padStart(2, "0")}`
        )
        .join("")
    );

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Unable to decode token:", error);
    return null;
  }
};

const normalizeRole = (role) => {
  return String(role || "USER")
    .replace("ROLE_", "")
    .toUpperCase();
};

const buildUserFromToken = (token) => {
  const payload = decodeJwt(token);

  if (!payload) {
    return null;
  }

  const email =
    payload.email ||
    payload.sub ||
    payload.username ||
    "";

  const role = normalizeRole(
    payload.role ||
      payload.authority ||
      payload.roles?.[0]
  );

  const fullName =
    payload.fullName ||
    payload.name ||
    email.split("@")[0] ||
    "RentRide User";

  return {
    id: payload.userId || payload.id || null,
    email,
    fullName,
    firstName:
      payload.firstName ||
      fullName.split(" ")[0] ||
      fullName,
    lastName: payload.lastName || "",
    role,
    provider: "LOCAL",
  };
};

const isTokenExpired = (token) => {
  const payload = decodeJwt(token);

  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const savedToken =
      localStorage.getItem("token");

    if (
      savedToken &&
      !isTokenExpired(savedToken)
    ) {
      return savedToken;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rideSearch");

    return null;
  });

  const [user, setUser] = useState(() => {
    const savedToken =
      localStorage.getItem("token");

    const savedUser =
      localStorage.getItem("user");

    if (
      !savedToken ||
      isTokenExpired(savedToken)
    ) {
      return null;
    }

    if (savedUser) {
      try {
        const parsedUser =
          JSON.parse(savedUser);

        return {
          ...parsedUser,
          role: normalizeRole(
            parsedUser?.role
          ),
        };
      } catch (error) {
        console.error(
          "Unable to read saved user:",
          error
        );

        localStorage.removeItem("user");
      }
    }

    return buildUserFromToken(savedToken);
  });

  const clearAuthentication =
    useCallback(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("rideSearch");

      setToken(null);
      setUser(null);
    }, []);

  useEffect(() => {
    if (
      token &&
      isTokenExpired(token)
    ) {
      clearAuthentication();
    }
  }, [token, clearAuthentication]);

  const saveAuthentication = (
    newToken,
    newUser
  ) => {
    const normalizedUser = {
      ...newUser,
      role: normalizeRole(
        newUser?.role
      ),
      provider:
        newUser?.provider || "LOCAL",
    };

    localStorage.setItem(
      "token",
      newToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(normalizedUser)
    );

    setToken(newToken);
    setUser(normalizedUser);
  };

  const login = async (
    email,
    password
  ) => {
    const response = await API.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    const responseData =
      response.data?.data ||
      response.data;

    const newToken =
      responseData?.token;

    if (!newToken) {
      throw new Error(
        "Token was not returned by backend."
      );
    }

    const loggedInUser =
      responseData?.user ||
      buildUserFromToken(newToken);

    if (!loggedInUser) {
      throw new Error(
        "User information was not returned."
      );
    }

    const normalizedUser = {
      ...loggedInUser,
      role: normalizeRole(
        loggedInUser.role
      ),
      provider:
        loggedInUser.provider ||
        "LOCAL",
    };

    saveAuthentication(
      newToken,
      normalizedUser
    );

    return normalizedUser;
  };

  const logout = async () => {
    try {
      if (token) {
        await API.post("/auth/logout");
      }
    } catch (error) {
      console.warn(
        "Backend logout failed. Local logout completed.",
        error
      );
    } finally {
      clearAuthentication();
    }
  };

  const normalizedUserRole =
    normalizeRole(user?.role);

  const value = {
    user,
    token,
    login,
    logout,

    isLoggedIn: Boolean(
      token && user
    ),

    isAdmin:
      normalizedUserRole === "ADMIN",

    isUser:
      normalizedUserRole === "USER",

    isDriver:
      normalizedUserRole === "DRIVER",
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
};