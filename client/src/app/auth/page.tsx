'use client';

import React, { useReducer, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../../firebaseConfig";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setUser, clearUser } from "./../store";

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

interface Action {
	type: string;
	payload?: any;
}

const ACTIONS = {
	SET_ERRORS: "SET_ERRORS",
	SET_LOADING: "SET_LOADING",
	SET_ALERT: "SET_ALERT",
	SET_FORM_DATA: "SET_FORM_DATA",
};

const formReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case ACTIONS.SET_ERRORS:
			return { ...state, errors: action.payload };
		case ACTIONS.SET_LOADING:
			return { ...state, loading: action.payload };
		case ACTIONS.SET_ALERT:
			return { ...state, alertMessage: action.payload };
		case ACTIONS.SET_FORM_DATA:
			return { ...state, formData: action.payload };
		default:
			return state;
	}
};

const AuthPage: React.FC = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");

	const [state, localDispatch] = useReducer(formReducer, {
		formData: { username: "", email: "", password: "" },
		errors: { username: "", email: "", password: "" },
		loading: false,
		alertMessage: null,
	});

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const tabParam = searchParams.get("tab");
		setActiveTab(tabParam === "login" ? "login" : "signup");
	}, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
				dispatch(setUser({
					id: firebaseUser.uid,
					email: firebaseUser.email,
					...(userDoc.exists() ? userDoc.data() : {})
				}));
			} else {
				dispatch(clearUser());
			}
		});
		return () => unsubscribe();
	}, [dispatch]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		localDispatch({
			type: ACTIONS.SET_FORM_DATA,
			payload: { ...state.formData, [name]: value },
		});
		localDispatch({
			type: ACTIONS.SET_ERRORS,
			payload: { ...state.errors, [name]: "" },
		});
	};

	const validateForm = (): boolean => {
		const newErrors = { ...state.errors };
		let valid = true;

		if (activeTab === "signup" && !state.formData.username.trim()) {
			newErrors.username = "Username is required";
			valid = false;
		}

		if (!state.formData.email.trim()) {
			newErrors.email = "Email is required";
			valid = false;
		} else if (!/\S+@\S+\.\S+/.test(state.formData.email)) {
			newErrors.email = "Invalid email format";
			valid = false;
		}

		if (!state.formData.password) {
			newErrors.password = "Password is required";
			valid = false;
		} else if (state.formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
			valid = false;
		}

		localDispatch({ type: ACTIONS.SET_ERRORS, payload: newErrors });
		return valid;
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		localDispatch({ type: ACTIONS.SET_LOADING, payload: true });
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
		} catch (error: any) {
			localDispatch({
				type: ACTIONS.SET_ALERT,
				payload: error.message || "Signup failed. Please try again.",
			});
		} finally {
			localDispatch({ type: ACTIONS.SET_LOADING, payload: false });
		}
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		localDispatch({ type: ACTIONS.SET_LOADING, payload: true });
		try {
			await signInWithEmailAndPassword(
				auth,
				state.formData.email,
				state.formData.password
			);
			router.push("/dashboard");
		} catch (error: any) {
			localDispatch({
				type: ACTIONS.SET_ALERT,
				payload: error.message || "Login failed. Please try again.",
			});
		} finally {
			localDispatch({ type: ACTIONS.SET_LOADING, payload: false });
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
			{/* Animated Background Elements */}
			<motion.div
				className="absolute w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30 -top-32 -left-32"
				animate={{ scale: [1, 1.2, 1] }}
				transition={{ duration: 10, repeat: Infinity }}
			/>
			<motion.div
				className="absolute w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-30 -bottom-32 -right-32"
				animate={{ scale: [1, 1.2, 1] }}
				transition={{ duration: 8, repeat: Infinity, delay: 2 }}
			/>

			{/* Main Card */}
			<div className="relative bg-white backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden border border-white/20">
				{/* Tab Selector */}
				<div className="flex relative bg-gray-50">
					<button
						onClick={() => setActiveTab("signup")}
						className={`flex-1 py-5 text-center font-semibold transition-all duration-300 ${
							activeTab === "signup"
								? "text-blue-600 bg-white shadow-sm"
								: "text-gray-400 hover:text-blue-500"
						}`}
					>
						Sign Up
					</button>
					<button
						onClick={() => setActiveTab("login")}
						className={`flex-1 py-5 text-center font-semibold transition-all duration-300 ${
							activeTab === "login"
								? "text-blue-600 bg-white shadow-sm"
								: "text-gray-400 hover:text-blue-500"
						}`}
					>
						Login
					</button>
				</div>

				{/* Alert Message */}
				<AnimatePresence>
					{state.alertMessage && (
						<motion.div
							className={`px-6 py-4 flex items-center ${
								state.alertMessage.startsWith("Error") ?
									"bg-red-100 text-red-700" : "bg-green-100 text-green-700"
							}`}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
						>
              <span className="mr-2">{
	              state.alertMessage.startsWith("Error") ? "⚠️" : "✅"
              }</span>
							{state.alertMessage}
						</motion.div>
					)}
				</AnimatePresence>

				<div className="px-8 py-10">
					<AnimatePresence mode="wait">
						{/* Signup Form */}
						{activeTab === "signup" && (
							<motion.form
								key="signup"
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 50 }}
								className="space-y-6"
								onSubmit={handleSignUp}
							>
								<div className="space-y-5">
									<FloatingInput
										id="username"
										label="Username"
										value={state.formData.username}
										error={state.errors.username}
										onChange={handleChange}
										icon="👤"
									/>
									<FloatingInput
										id="email"
										type="email"
										label="Email"
										value={state.formData.email}
										error={state.errors.email}
										onChange={handleChange}
										icon="✉️"
									/>
									<FloatingInput
										id="password"
										type="password"
										label="Password"
										value={state.formData.password}
										error={state.errors.password}
										onChange={handleChange}
										icon="🔒"
									/>
								</div>

								<SubmitButton
									loading={state.loading}
									text="Create Account"
									loadingText="Creating Account..."
								/>
							</motion.form>
						)}

						{/* Login Form */}
						{activeTab === "login" && (
							<motion.form
								key="login"
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -50 }}
								className="space-y-6"
								onSubmit={handleLogin}
							>
								<div className="space-y-5">
									<FloatingInput
										id="email"
										type="email"
										label="Email"
										value={state.formData.email}
										error={state.errors.email}
										onChange={handleChange}
										icon="✉️"
									/>
									<FloatingInput
										id="password"
										type="password"
										label="Password"
										value={state.formData.password}
										error={state.errors.password}
										onChange={handleChange}
										icon="🔒"
									/>
								</div>

								<SubmitButton
									loading={state.loading}
									text="Sign In"
									loadingText="Signing In..."
								/>
							</motion.form>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

// Reusable Components
const FloatingInput = ({
	                       id,
	                       label,
	                       type = "text",
	                       error,
	                       value,
	                       onChange,
	                       icon
                       }) => (
	<div className="relative">
		<div className="absolute left-3 top-4 text-gray-400">{icon}</div>
		<input
			id={id}
			name={id}
			type={type}
			value={value}
			onChange={onChange}
			className={`w-full pl-11 pr-4 py-3 rounded-lg border focus:ring-2 transition-colors duration-300 peer ${
				error ? "border-red-500 focus:ring-red-200"
					: "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
			}`}
			placeholder=" "
		/>
		<label
			htmlFor={id}
			className="absolute left-11 top-3 px-1 bg-white text-gray-400 transition-all duration-300
               peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 
               peer-focus:text-sm peer-focus:text-blue-600 -top-2.5 text-sm"
		>
			{label}
		</label>
		{error && (
			<motion.div
				className="text-red-500 text-sm mt-1 flex items-center"
				initial={{ opacity: 0, x: -10 }}
				animate={{ opacity: 1, x: 0 }}
			>
				<span className="mr-1">⚠️</span>
				{error}
			</motion.div>
		)}
	</div>
);

const SubmitButton = ({ loading, text, loadingText }) => (
	<button
		type="submit"
		disabled={loading}
		className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold
             rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] 
             disabled:opacity-70 disabled:cursor-not-allowed relative"
	>
    <span className={`transition-opacity ${loading ? "opacity-0" : "opacity-100"}`}>
      {text}
    </span>
		{loading && (
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
			</div>
		)}
	</button>
);

export default AuthPage;