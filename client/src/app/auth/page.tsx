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
import { useDispatch } from "react-redux";
import { AlertCircle, ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { auth, firestore } from "../../../firebaseConfig";
import { clearUser, setUser } from "../store";
import Logo from "../common/Logo";

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

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");
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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="app-container grid min-h-screen gap-10 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="max-w-xl">
          <Link href="/" className="mb-10 inline-flex items-center gap-3">
            <Logo />
            <span className="text-base font-semibold text-slate-950">GoFundYourself</span>
          </Link>

          <p className="section-kicker">Secure Account Access</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Get into the lending workspace.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Create a borrower or lender profile, then manage loan requests, approvals, and portfolio activity from the app.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Validated forms", "Profile context", "Portfolio tracking"].map((item) => (
              <div key={item} className="rounded-md border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card mx-auto w-full max-w-md overflow-hidden">
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 p-1">
            {[
              { key: "signup", label: "Sign Up" },
              { key: "login", label: "Login" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as "signup" | "login")}
                className={`rounded-md px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === tab.key ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={submitHandler} className="space-y-5 p-6 sm:p-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                {activeTab === "signup" ? "Create your account" : "Welcome back"}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {activeTab === "signup"
                  ? "Use a username borrowers and lenders can recognize."
                  : "Sign in to continue to your dashboard."}
              </p>
            </div>

            {state.alertMessage && (
              <div className="flex gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
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
            />

            <TextField
              id="password"
              label="Password"
              type="password"
              icon={<LockKeyhole className="h-4 w-4" />}
              value={state.formData.password}
              error={state.errors.password}
              onChange={handleChange}
            />

            <button type="submit" disabled={state.loading} className="btn-primary w-full">
              {state.loading ? "Working..." : activeTab === "signup" ? "Create Account" : "Sign In"}
              {!state.loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          </form>
        </section>
      </div>
    </main>
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
}

function TextField({ id, label, type = "text", value, error, icon, onChange }: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          className={`input-field pl-10 ${error ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/15" : ""}`}
          placeholder={label}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1 text-sm font-medium text-red-600">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
