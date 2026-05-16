import { AuthPage } from "./components/auth/AuthPage.jsx";
import { Workspace } from "./components/workspace/Workspace.jsx";
import { useTheme } from "./hooks/useTheme.js";
import { useWorkspace } from "./hooks/useWorkspace.js";

export default function App({ googleLoginReady }) {
  const { theme, toggleTheme } = useTheme();
  const workspace = useWorkspace();

  if (!workspace.user) {
    return (
      <AuthPage
        error={workspace.error}
        googleLoginReady={googleLoginReady}
        onEmailAuth={(authMode, authForm) => workspace.runAction(() => workspace.loginWithEmail(authMode, authForm))}
        onVerifyEmail={(token) => workspace.runAction(() => workspace.verifyEmail(token))}
        onGoogleAuth={(credential) => workspace.runAction(() => workspace.loginWithGoogle(credential))}
        onGoogleError={() => workspace.setError("Google login failed")}
        onForgotPassword={(email) => workspace.runAction(() => workspace.forgotPassword(email))}
        onResetPassword={(token, password) => workspace.runAction(() => workspace.resetPassword(token, password))}
      />
    );
  }

  return <Workspace workspace={workspace} theme={theme} onToggleTheme={toggleTheme} />;
}

