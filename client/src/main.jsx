import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./styles.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const app = googleClientId ? (
  <GoogleOAuthProvider clientId={googleClientId}>
    <App googleLoginReady />
  </GoogleOAuthProvider>
) : (
  <App googleLoginReady={false} />
);

ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode>{app}</React.StrictMode>);
