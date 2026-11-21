import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Loader2, LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../layouts/AuthLayout";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const Login = () => {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);

  const location = useLocation();
  const successMessage = location.state?.message;

  const { educatorLogin, studentGoogleLogin } = useAuth();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectUser = useCallback(
    (user) => {
      if (user.role === "educator") {
        navigate("/educator/dashboard", { replace: true });
      } else {
        navigate("/student/dashboard", { replace: true });
      }
    },
    [navigate],
  );

  // Initialize Google Sign-In
  useEffect(() => {
    if (!window.google || !googleButtonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

      callback: async (response) => {
        try {
          setError("");
          setGoogleLoading(true);

          const user = await studentGoogleLogin(response.credential);
          redirectUser(user);
        } catch (err) {
          setError(err.response?.data?.message || "Google sign-in failed.");
        } finally {
          setGoogleLoading(false);
        }
      },
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      shape: "rectangular",
      text: "continue_with",
      width: 320,
    });
  }, [studentGoogleLogin, redirectUser]);

  // Educator login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const user = await educatorLogin(credentials);
      redirectUser(user);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-slate-900">
            Welcome back
          </CardTitle>

          <CardDescription>
            Sign in to continue your learning journey.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {successMessage && (
            <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              {successMessage}
            </p>
          )}

          {/* Student Google sign-in */}
          <div className="space-y-3">
            <p className="text-center text-sm font-medium text-slate-700">
              Student? Continue with Google
            </p>

            <div className="flex justify-center">
              <div ref={googleButtonRef} />
            </div>

            {googleLoading && (
              <p className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 size={15} className="animate-spin" />
                Signing in...
              </p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400">
                Educator sign in
              </span>
            </div>
          </div>

          {/* Educator email/password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="pl-10"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="pl-10"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in as Educator"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Want to teach on EduNest?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Create an educator account
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Login;
