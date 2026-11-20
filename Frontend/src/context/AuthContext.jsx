import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getProfile,
  loginEducator,
  loginStudentWithGoogle,
  registerEducator,
} from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveSession = useCallback((data) => {
    localStorage.setItem("edunest_token", data.token);
    setUser(data.user);
  }, []);

  const educatorLogin = useCallback(
    async (credentials) => {
      const data = await loginEducator(credentials);
      saveSession(data);
      return data.user;
    },
    [saveSession]
  );

  const educatorRegister = useCallback(async (userData) => {
    return await registerEducator(userData);
  }, []);

  const studentGoogleLogin = useCallback(
    async (idToken) => {
      const data = await loginStudentWithGoogle(idToken);
      saveSession(data);
      return data.user;
    },
    [saveSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("edunest_token");
    setUser(null);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("edunest_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProfile();
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("edunest_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        educatorLogin,
        educatorRegister,
        studentGoogleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
