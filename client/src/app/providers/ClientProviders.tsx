"use client";

import { Provider } from "react-redux";
import { MotionConfig } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "../store";
import AuthProvider from "./AuthProvider";
import ThemeProvider, { useTheme } from "./ThemeProvider";
import CommandPalette from "../common/CommandPalette";

function ThemedToasts() {
  const { theme } = useTheme();
  return <ToastContainer position="bottom-right" theme={theme} autoClose={3000} newestOnTop />;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <AuthProvider>
          <MotionConfig reducedMotion="user">
            {children}
            <CommandPalette />
          </MotionConfig>
          <ThemedToasts />
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  );
}
