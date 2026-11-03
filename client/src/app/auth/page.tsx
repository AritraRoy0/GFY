"use client";

import React, { useEffect, useReducer, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  UserRound,
} from "lucide-react";
import { auth, firestore } from "../../../firebaseConfig";
import { clearUser, RootState, setUser } from "../store";
import Logo from "../common/Logo";
import LoadingSpinner from "../common/LoadingSpinner";
import ThemeToggle from "../common/ThemeToggle";
import { Avatar, LiveDot } from "../common/ui";

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface Errors {
  username: string;
  email: string;
  password: string;
}

interface State {
  formData: FormData;
  errors: Errors;
  loading: boolean;
  alertMessage: string | null;
}

type Action =
  | { type: "SET_ERRORS"; payload: Errors }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ALERT"; payload: string | null }
  | { type: "SET_FORM_DATA"; payload: FormData };

type Tab = "signup" | "login";

const initialState: State = {
  formData: { username: "", email: "", password: "" },
  errors: { username: "", email: "", password: "" },
  loading: false,
  alertMessage: null,
};

const formReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_ERRORS":
      return { ...state, errors: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ALERT":
      return { ...state, alertMessage: action.payload };
    case "SET_FORM_DATA":
      return { ...state, formData: action.payload };
    default:
      return state;
  }
};

const firebaseErrorMessages: Record<string, string> = {
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/wrong-password": "Email or password is incorrect.",
  "auth/user-not-found": "Email or password is incorrect.",
  "auth/email-already-in-use": "An account with this email already exists. Try signing in instead.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code: unknown }).code) : "";
  if (firebaseErrorMessages[code]) return firebaseErrorMessages[code];
  return error instanceof Error ? error.message : fallback;
};

function passwordStrength(password: string) {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return { score, label: ["Too short", "Weak", "Fair", "Strong", "Excellent"][score] };
}

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, initialized } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<Tab>("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [state, localDispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setActiveTab(searchParams.get("tab") === "login" ? "login" : "signup");
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
        dispatch(
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            ...(userDoc.exists() ? userDoc.data() : {}),
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    localDispatch({ type: "SET_ERRORS", payload: { username: "", email: "", password: "" } });
    localDispatch({ type: "SET_ALERT", payload: null });
    window.history.replaceState(null, "", `/auth?tab=${tab}`);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    localDispatch({
      type: "SET_FORM_DATA",
      payload: { ...state.formData, [name]: value },
    });
    localDispatch({
      type: "SET_ERRORS",
      payload: { ...state.errors, [name]: "" },
    });
    localDispatch({ type: "SET_ALERT", payload: null });
  };

  const validateForm = (): boolean => {
    const nextErrors: Errors = { username: "", email: "", password: "" };
    let valid = true;

    if (activeTab === "signup" && !state.formData.username.trim()) {
      nextErrors.username = "Username is required.";
      valid = false;
    }

    if (!state.formData.email.trim()) {
      nextErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.formData.email)) {
      nextErrors.email = "Enter a valid email address.";
      valid = false;
    }

    if (!state.formData.password) {
      nextErrors.password = "Password is required.";
      valid = false;
    } else if (state.formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    localDispatch({ type: "SET_ERRORS", payload: nextErrors });
    return valid;
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    localDispatch({ type: "SET_LOADING", payload: true });
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        state.formData.email,
        state.formData.password
      );

      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        username: state.formData.username,
        email: userCredential.user.email,
      });

      setRedirecting(true);
      router.push("/dashboard");
    } catch (error) {
      localDispatch({
        type: "SET_ALERT",
        payload: getErrorMessage(error, "Signup failed. Please try again."),
      });
    } finally {
      localDispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    localDispatch({ type: "SET_LOADING", payload: true });
    try {
      await signInWithEmailAndPassword(auth, state.formData.email, state.formData.password);
      setRedirecting(true);
      router.push("/dashboard");
    } catch (error) {
      localDispatch({
        type: "SET_ALERT",
        payload: getErrorMessage(error, "Login failed. Please try again."),
      });
    } finally {
      localDispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const submitHandler = activeTab === "signup" ? handleSignUp : handleLogin;
  const alreadySignedIn = initialized && user && !state.loading && !redirecting;
  const strength = passwordStrength(state.formData.password);

  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <BrandPanel />

      <section className="relative flex flex-col px-4 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 lg:invisible">
            <Logo size="sm" />
            <span className="text-sm font-semibold text-ink">GoFundYourself</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-ghost text-xs">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to site
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[25rem]">
            {alreadySignedIn ? (
              <div className="panel edge-glow p-8 text-center">
                <div className="flex justify-center">
                  <Avatar id={user.id} name={user.username || user.email || "M"} size="lg" />
                </div>
                <h1 className="mt-5 text-xl font-semibold tracking-tight text-ink">You&apos;re already signed in</h1>
                <p className="mt-2 text-sm text-ink-2">
                  Signed in as <span className="font-medium text-ink">{user.username || user.email}</span>.
                </p>
                <div className="mt-6 grid gap-2">
                  <Link href="/dashboard" className="btn-primary">
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                    Continue to dashboard
                  </Link>
                  <Link href="/logout" className="btn-secondary">
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out and switch account
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="section-kicker">{activeTab === "signup" ? "New member" : "Secure sign in"}</p>
                  <h1 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">
                    {activeTab === "signup" ? "Create your account" : "Welcome back"}
                  </h1>
                  <p className="mt-2 text-sm text-ink-2">
                    {activeTab === "signup"
                      ? "Use a username borrowers and lenders can recognize."
                      : "Sign in to continue to your dashboard."}
                  </p>
                </div>

                <div role="tablist" aria-label="Authentication mode" className="mt-7 grid grid-cols-2 rounded-lg border border-line bg-surface/60 p-1">
                  {([
                    { key: "signup", label: "Create account" },
                    { key: "login", label: "Sign in" },
                  ] as const).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.key}
                      onClick={() => switchTab(tab.key)}
                      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab.key ? "bg-elevated text-ink shadow-panel" : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={submitHandler} className="mt-6 space-y-4" noValidate>
                  {state.alertMessage && (
                    <div role="alert" className="flex gap-3 rounded-lg border border-negative/30 bg-negative/10 p-3 text-sm text-negative">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <p>{state.alertMessage}</p>
                    </div>
                  )}

                  {activeTab === "signup" && (
                    <TextField
                      id="username"
                      label="Username"
                      icon={<UserRound className="h-4 w-4" />}
                      value={state.formData.username}
                      error={state.errors.username}
                      onChange={handleChange}
                      autoComplete="username"
                      placeholder="e.g. alexr"
                    />
                  )}

                  <TextField
                    id="email"
                    label="Email"
                    type="email"
                    icon={<Mail className="h-4 w-4" />}
                    value={state.formData.email}
                    error={state.errors.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                  />

                  <TextField
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    icon={<LockKeyhole className="h-4 w-4" />}
                    value={state.formData.password}
                    error={state.errors.password}
                    onChange={handleChange}
                    autoComplete={activeTab === "signup" ? "new-password" : "current-password"}
                    placeholder={activeTab === "signup" ? "At least 6 characters" : "Your password"}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />

                  {activeTab === "signup" && state.formData.password && !state.errors.password && (
                    <div className="flex items-center gap-3" aria-live="polite">
                      <div className="grid flex-1 grid-cols-4 gap-1">
                        {[1, 2, 3, 4].map((step) => (
                          <span
                            key={step}
                            className={`h-1 rounded-full transition-colors ${
                              strength.score >= step
                                ? strength.score <= 1
                                  ? "bg-negative"
                                  : strength.score === 2
                                    ? "bg-warning"
                                    : "bg-positive"
                                : "bg-surface-3"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="w-16 text-right font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-muted">{strength.label}</span>
                    </div>
                  )}

                  <button type="submit" disabled={state.loading} className="btn-primary w-full py-3">
                    {state.loading ? (
                      <>
                        <LoadingSpinner size="small" label="Submitting" />
                        {activeTab === "signup" ? "Creating account..." : "Signing in..."}
                      </>
                    ) : (
                      <>
                        {activeTab === "signup" ? "Create account" : "Sign in"}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-ink-muted">
                  {activeTab === "signup" ? "Already have an account?" : "New to GoFundYourself?"}{" "}
                  <button
                    type="button"
                    onClick={() => switchTab(activeTab === "signup" ? "login" : "signup")}
                    className="font-medium text-accent hover:text-accent-strong"
                  >
                    {activeTab === "signup" ? "Sign in" : "Create an account"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden border-r border-line bg-surface/40 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="bg-grid mask-fade-radial pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full bg-accent/10 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent-2/10 blur-[100px]" aria-hidden="true" />

      <Link href="/" className="relative flex items-center gap-2.5">
        <Logo />
        <span className="text-[15px] font-semibold tracking-tight text-ink">GoFundYourself</span>
      </Link>

      <div className="relative max-w-md">
        <h2 className="text-4xl font-semibold leading-tight tracking-[-0.035em] text-ink">
          Your lending workspace, <span className="text-gradient">one sign-in away.</span>
        </h2>
        <p className="mt-4 text-base leading-7 text-ink-2">
          Manage loan requests, approvals, and portfolio activity from a single realtime dashboard.
        </p>

        <div className="mt-10 overflow-hidden rounded-xl border border-line-strong bg-canvas/70 font-mono text-xs shadow-lift backdrop-blur">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="text-ink-muted">session.init</span>
            <LiveDot label="Secure" />
          </div>
          <ul className="space-y-2.5 p-4">
            {[
              "Validated forms before submit",
              "Profile context for every request",
              "Portfolio tracking after funding",
            ].map((line) => (
              <li key={line} className="flex items-center gap-3 text-ink-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-positive" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="relative font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">Encrypted in transit · Firebase Auth</p>
    </aside>
  );
}

interface TextFieldProps {
  id: keyof FormData;
  label: string;
  type?: string;
  value: string;
  error?: string;
  icon: React.ReactNode;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  placeholder?: string;
  trailing?: React.ReactNode;
}

function TextField({ id, label, type = "text", value, error, icon, onChange, autoComplete, placeholder, trailing }: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink-2">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-faint">{icon}</span>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`input-field py-3 pl-10 ${trailing ? "pr-12" : ""} ${error ? "input-error" : ""}`}
          placeholder={placeholder ?? label}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {trailing && <span className="absolute inset-y-0 right-2 flex items-center">{trailing}</span>}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-negative">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
