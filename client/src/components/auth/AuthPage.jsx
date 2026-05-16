import { useEffect, useState } from "react";
import { FolderKanban } from "lucide-react";
import { Alert } from "../ui/alert.jsx";
import { Button } from "../ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";
import { Tabs, TabsTrigger } from "../ui/tabs.jsx";

export function AuthPage({ error, onEmailAuth, onVerifyEmail, onForgotPassword, onResetPassword }) {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyToken = params.get("token") || params.get("verifyToken"); // Support both formats
    const resetTokenParam = params.get("resetToken");

    if (verifyToken) {
      onVerifyEmail(verifyToken);
      window.history.replaceState({}, "", window.location.pathname);
    } else if (resetTokenParam) {
      setResetToken(resetTokenParam);
      setShowForgotPassword(true);
    }
  }, []);

  async function submitAuth(event) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const result = await onEmailAuth(authMode, authForm);

      if (result?.message) {
        setMessage(result.message);
        setAuthMode("login");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function submitForgotPassword(event) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const result = await onForgotPassword(forgotEmail);
      if (result?.message) {
        setMessage(result.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function submitResetPassword(event) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const result = await onResetPassword(resetToken, newPassword);
      if (result?.token) {
        setShowForgotPassword(false);
        setMessage("Password reset successfully. You are now logged in!");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (showForgotPassword && !resetToken) {
    return (
      <main className="auth-page">
        <Card className="auth-card">
          <CardHeader>
            <div className="brand-row">
              <div className="brand-mark">
                <FolderKanban size={22} />
              </div>
              <div>
                <CardTitle>VertexFlow</CardTitle>
                <CardDescription>Recover your account</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form className="form-stack" onSubmit={submitForgotPassword}>
              <p className="auth-helper">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <Label>
                Email
                <Input type="email" value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} required disabled={isLoading} />
              </Label>

              {message && <Alert>{message}</Alert>}
              {error && <Alert variant="destructive">{error}</Alert>}

              <div className="auth-actions">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForgotPassword(false)} disabled={isLoading}>
                  Back to login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (resetToken) {
    return (
      <main className="auth-page">
        <Card className="auth-card">
          <CardHeader>
            <div className="brand-row">
              <div className="brand-mark">
                <FolderKanban size={22} />
              </div>
              <div>
                <CardTitle>VertexFlow</CardTitle>
                <CardDescription>Create a new password</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form className="form-stack" onSubmit={submitResetPassword}>
              <Label>
                New Password
                <Input type="password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required disabled={isLoading} />
              </Label>

              {message && <Alert>{message}</Alert>}
              {error && <Alert variant="destructive">{error}</Alert>}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <Card className="auth-card">
        <CardHeader>
          <div className="brand-row">
            <div className="brand-mark">
              <FolderKanban size={22} />
            </div>
            <div>
              <CardTitle>VertexFlow</CardTitle>
              <CardDescription>A focused workspace for projects, tasks, and team delivery.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs>
            <TabsTrigger active={authMode === "login"} onClick={() => setAuthMode("login")} disabled={isLoading}>
              Login
            </TabsTrigger>
            <TabsTrigger active={authMode === "signup"} onClick={() => setAuthMode("signup")} disabled={isLoading}>
              Signup
            </TabsTrigger>
          </Tabs>

          <form className="form-stack" onSubmit={submitAuth}>
            {authMode === "signup" && (
              <Label>
                Name
                <Input value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} required disabled={isLoading} />
              </Label>
            )}

            <Label>
              Email
              <Input type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} required disabled={isLoading} />
            </Label>

            <Label>
              Password
              <Input
                type="password"
                minLength={authMode === "signup" ? 8 : 1}
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                required
                disabled={isLoading}
              />
            </Label>

            {message && <Alert>{message}</Alert>}
            {error && <Alert variant="destructive">{error}</Alert>}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (authMode === "login" ? "Logging in..." : "Creating account...") : authMode === "login" ? "Login" : "Create account"}
            </Button>

            {authMode === "login" && (
              <button type="button" className="text-link auth-link" onClick={() => setShowForgotPassword(true)} disabled={isLoading}>
                Forgot your password?
              </button>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
