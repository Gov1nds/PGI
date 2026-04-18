import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CorrelationProvider } from "./context/CorrelationContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import { AuthProvider } from "./context/AuthContext";
import { VendorAuthProvider } from "./context/VendorAuthContext";
import { RealTimeProvider } from "./context/RealTimeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LocationProvider } from "./context/LocationContext";
import { FeatureFlagsProvider } from "./context/FeatureFlagsContext";
import App from "./App";
import { runLocalStorageMigration } from "./lib/api";
import { initAnalytics } from "./lib/analytics";
import "./styles.css";

// One-time migration: clear legacy localStorage keys (GAP-001)
runLocalStorageMigration();

// Initialize analytics (Task 18)
initAnalytics();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <CorrelationProvider>
        <AnalyticsProvider>
          <LocationProvider>
            <AuthProvider>
              <FeatureFlagsProvider>
                <VendorAuthProvider>
                  <RealTimeProvider>
                    <NotificationProvider>
                      <App />
                    </NotificationProvider>
                  </RealTimeProvider>
                </VendorAuthProvider>
              </FeatureFlagsProvider>
            </AuthProvider>
          </LocationProvider>
        </AnalyticsProvider>
      </CorrelationProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
