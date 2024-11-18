// app/auth/page.tsx

'use client';

import React, { useReducer, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
} from "firebase/auth";
import {
	doc,
	setDoc,
	getDoc,
	getDocs,
	collection,
	query,
	where,
} from "firebase/firestore";
import { auth, firestore } from "../../../firebaseConfig"; // Adjust the path if necessary

import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { setUser, clearUser } from "./../store";

// Define interfaces
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

// Action constants
const ACTIONS = {
	SET_ERRORS: "SET_ERRORS",
	SET_LOADING: "SET_LOADING",
	SET_ALERT: "SET_ALERT",
	SET_FORM_DATA: "SET_FORM_DATA",
};

// Reducer function
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

// Animation Variants
const fadeInUp = {
	hidden: { opacity: 0, y: 40 },
	visible: { opacity: 1, y: 0 },
};

// Shake animation using framer-motion
const shakeAnimation = {
	hidden: { x: 0 },
	visible: {
		x: [0, -10, 10, -10, 10, 0],
		transition: { duration: 0.5 },
	},
};

const AuthPage: React.FC = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");

	// Manage state with useReducer
	const [state, localDispatch] = useReducer(formReducer, {
		formData: { username: "", email: "", password: "" },
		errors: { username: "", email: "", password: "" },
		loading: false,
		alertMessage: null,
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			// Get the 'tab' parameter from URL
			const searchParams = new URLSearchParams(window.location.search);
			const tabParam = searchParams.get("tab");
			setActiveTab(tabParam === "login" ? "login" : "signup");
		}
	}, []);

	// Auth state listener
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				const { email, uid } = firebaseUser;

				// Fetch additional user data from Firestore
				const userDoc = await getDoc(doc(firestore, "users", uid));
				let userData = {};

				if (userDoc.exists()) {
					userData = userDoc.data();
				}

				const fullUserData = {
					id: uid,
					email: email,
					...userData,
				};

				// Dispatch setUser action
				dispatch(setUser(fullUserData));
			} else {
				// User is signed out
				dispatch(clearUser());
			}
		});

		// Clean up the listener on unmount
		return () => unsubscribe();
	}, [dispatch]);

	// Handle form input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		localDispatch({
			type: ACTIONS.SET_FORM_DATA,
			payload: { ...state.formData, [name]: value },
		});
		// Clear the error message for this field
		localDispatch({
			type: ACTIONS.SET_ERRORS,
			payload: { ...state.errors, [name]: "" },
		});
	};

	// Form validation
	const validateForm = (): boolean => {
		let valid = true;
		const newErrors = { ...state.errors };

		if (!state.formData.username.trim()) {
			newErrors.username = "Username is required";
			valid = false;
		} else {
			newErrors.username = "";
		}

		if (!state.formData.email.trim()) {
			newErrors.email = "Email is required";
			valid = false;
		} else if (!/\S+@\S+\.\S+/.test(state.formData.email)) {
			newErrors.email = "Email is invalid";
			valid = false;
		} else {
			newErrors.email = "";
		}

		if (!state.formData.password) {
			newErrors.password = "Password is required";
			valid = false;
		} else if (state.formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
			valid = false;
		} else {
			newErrors.password = "";
		}

		localDispatch({ type: ACTIONS.SET_ERRORS, payload: newErrors });
		return valid;
	};

	// Check if username exists in Firestore
	const checkUsernameExists = async (username: string): Promise<boolean> => {
		const q = query(
			collection(firestore, "users"),
			where("username", "==", username)
		);
		const querySnapshot = await getDocs(q);
		return !querySnapshot.empty;
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		localDispatch({ type: ACTIONS.SET_LOADING, payload: true });
		try {
			const usernameExists = await checkUsernameExists(state.formData.username);
			if (usernameExists) {
				localDispatch({
					type: ACTIONS.SET_ERRORS,
					payload: {
						...state.errors,
						username: "Username already taken",
					},
				});
				localDispatch({ type: ACTIONS.SET_LOADING, payload: false });
				return;
			}

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				state.formData.email,
				state.formData.password
			);
			const user = userCredential.user;

			// Save user data in Firestore
			const userData = {
				username: state.formData.username,
				email: user.email,
			};

			await setDoc(doc(firestore, "users", user.uid), userData);

			// Dispatch setUser action
			dispatch(
				setUser({
					id: user.uid,
					...userData,
				})
			);

			localDispatch({
				type: ACTIONS.SET_ALERT,
				payload: "Sign-up successful!",
			});
			router.push("/dashboard");
		} catch (error: any) {
			localDispatch({
				type: ACTIONS.SET_ALERT,
				payload: error.message || "Error during sign-up. Please try again.",
			});
			console.error("Error during sign-up:", error);
		} finally {
			localDispatch({ type: ACTIONS.SET_LOADING, payload: false });
		}
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!state.formData.email.trim()) {
			localDispatch({
				type: ACTIONS.SET_ERRORS,
				payload: {
					...state.errors,
					email: "Email is required",
				},
			});
			return;
		}

		if (!state.formData.password) {
			localDispatch({
				type: ACTIONS.SET_ERRORS,
				payload: {
					...state.errors,
					password: "Password is required",
				},
			});
			return;
		}

		localDispatch({ type: ACTIONS.SET_LOADING, payload: true });
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				state.formData.email,
				state.formData.password
			);
			const user = userCredential.user;

			const userDoc = await getDoc(doc(firestore, "users", user.uid));
			if (!userDoc.exists()) {
				localDispatch({
					type: ACTIONS.SET_ALERT,
					payload: "No account found. Please sign up first.",
				});
				localDispatch({ type: ACTIONS.SET_LOADING, payload: false });
				return;
			}

			const userData = userDoc.data();

			// Dispatch setUser action
			dispatch(
				setUser({
					id: user.uid,
					email: user.email,
					...userData,
				})
			);

			localDispatch({
				type: ACTIONS.SET_ALERT,
				payload: "Logged in successfully!",
			});
			router.push("/dashboard");
		} catch (error: any) {
			localDispatch({
				type: ACTIONS.SET_ALERT,
				payload: error.message || "Error during login. Please try again.",
			});
			console.error("Error during login:", error);
		} finally {
			localDispatch({ type: ACTIONS.SET_LOADING, payload: false });
		}
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100">
			{/* Animated Background */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Subtle animated patterns or shapes can be added here if desired */}
			</div>

			{/* Main Content */}
			<div className="relative bg-white p-12 rounded-lg shadow-lg w-full max-w-md z-10">
				{/* Alert Message */}
				<AnimatePresence>
					{state.alertMessage && (
						<motion.div
							className={`mb-4 p-4 rounded-lg text-center font-bold transition-transform transform ${
								state.alertMessage.startsWith("Error") ||
								state.alertMessage.startsWith("No account")
									? "bg-red-500 text-white"
									: "bg-green-500 text-white"
							}`}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.5 }}
							role="alert"
							aria-live="assertive"
						>
							{state.alertMessage}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Informative Text */}
				<motion.div
					className="mb-6 text-center text-gray-600"
					initial="hidden"
					animate="visible"
					variants={fadeInUp}
					transition={{ duration: 1, delay: 0.3 }}
				>
					<p>Please sign up or log in using your email and password.</p>
				</motion.div>

				{/* Tabs for Login/Signup */}
				<div className="flex justify-center mb-8">
					<button
						className={`text-lg font-bold px-6 py-3 rounded-t-lg transition-colors duration-300 focus:outline-none ${
							activeTab === "signup"
								? "text-blue-600 border-b-4 border-blue-600 shadow-lg transform scale-105"
								: "text-gray-400 hover:text-blue-600"
						}`}
						onClick={() => setActiveTab("signup")}
						aria-label="Sign Up Tab"
					>
						Sign Up
					</button>
					<button
						className={`text-lg font-bold px-6 py-3 rounded-t-lg transition-colors duration-300 focus:outline-none ${
							activeTab === "login"
								? "text-blue-600 border-b-4 border-blue-600 shadow-lg transform scale-105"
								: "text-gray-400 hover:text-blue-600"
						}`}
						onClick={() => setActiveTab("login")}
						aria-label="Login Tab"
					>
						Login
					</button>
				</div>

				{/* Signup Form */}
				<AnimatePresence mode="wait">
					{activeTab === "signup" && (
						<motion.form
							className="mb-6"
							variants={fadeInUp}
							initial="hidden"
							animate="visible"
							exit="hidden"
							transition={{ duration: 0.7 }}
							noValidate
							onSubmit={handleSignUp}
						>
							{/* Username Field */}
							<div className="relative mb-6">
								<input
									type="text"
									id="username"
									name="username"
									value={state.formData.username}
									onChange={handleChange}
									className={`peer w-full px-4 py-3 border rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 ${
										state.errors.username ? "border-red-500" : "border-gray-300"
									}`}
									placeholder=" "
									required
									aria-invalid={!!state.errors.username}
									aria-describedby="username-error"
								/>
								<label
									htmlFor="username"
									className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-6 left-2"
								>
									Username
								</label>
								{state.errors.username && (
									<motion.div
										className="text-red-500 text-sm mt-2"
										id="username-error"
										variants={shakeAnimation}
										initial="hidden"
										animate="visible"
									>
										{state.errors.username}
									</motion.div>
								)}
							</div>

							{/* Email Field */}
							<div className="relative mb-6">
								<input
									type="email"
									id="email"
									name="email"
									value={state.formData.email}
									onChange={handleChange}
									className={`peer w-full px-4 py-3 border rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 ${
										state.errors.email ? "border-red-500" : "border-gray-300"
									}`}
									placeholder=" "
									required
									aria-invalid={!!state.errors.email}
									aria-describedby="email-error"
								/>
								<label
									htmlFor="email"
									className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-6 left-2"
								>
									Email
								</label>
								{state.errors.email && (
									<motion.div
										className="text-red-500 text-sm mt-2"
										id="email-error"
										variants={shakeAnimation}
										initial="hidden"
										animate="visible"
									>
										{state.errors.email}
									</motion.div>
								)}
							</div>

							{/* Password Field */}
							<div className="relative mb-6">
								<input
									type="password"
									id="password"
									name="password"
									value={state.formData.password}
									onChange={handleChange}
									className={`peer w-full px-4 py-3 border rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 ${
										state.errors.password ? "border-red-500" : "border-gray-300"
									}`}
									placeholder=" "
									required
									aria-invalid={!!state.errors.password}
									aria-describedby="password-error"
								/>
								<label
									htmlFor="password"
									className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-6 left-2"
								>
									Password
								</label>
								{state.errors.password && (
									<motion.div
										className="text-red-500 text-sm mt-2"
										id="password-error"
										variants={shakeAnimation}
										initial="hidden"
										animate="visible"
									>
										{state.errors.password}
									</motion.div>
								)}
							</div>

							<button
								type="submit"
								className="w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-blue-500 transition-colors duration-300 mt-4 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
								disabled={state.loading}
								aria-label="Sign Up"
							>
								{state.loading ? "Signing up..." : "Sign Up"}
							</button>
						</motion.form>
					)}
				</AnimatePresence>

				{/* Login Form */}
				<AnimatePresence mode="wait">
					{activeTab === "login" && (
						<motion.form
							className="mb-6"
							variants={fadeInUp}
							initial="hidden"
							animate="visible"
							exit="hidden"
							transition={{ duration: 0.7 }}
							noValidate
							onSubmit={handleLogin}
						>
							{/* Email Field */}
							<div className="relative mb-6">
								<input
									type="email"
									id="email"
									name="email"
									value={state.formData.email}
									onChange={handleChange}
									className={`peer w-full px-4 py-3 border rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 ${
										state.errors.email ? "border-red-500" : "border-gray-300"
									}`}
									placeholder=" "
									required
									aria-invalid={!!state.errors.email}
									aria-describedby="email-error"
								/>
								<label
									htmlFor="email"
									className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-6 left-2"
								>
									Email
								</label>
								{state.errors.email && (
									<motion.div
										className="text-red-500 text-sm mt-2"
										id="email-error"
										variants={shakeAnimation}
										initial="hidden"
										animate="visible"
									>
										{state.errors.email}
									</motion.div>
								)}
							</div>

							{/* Password Field */}
							<div className="relative mb-6">
								<input
									type="password"
									id="password"
									name="password"
									value={state.formData.password}
									onChange={handleChange}
									className={`peer w-full px-4 py-3 border rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 ${
										state.errors.password ? "border-red-500" : "border-gray-300"
									}`}
									placeholder=" "
									required
									aria-invalid={!!state.errors.password}
									aria-describedby="password-error"
								/>
								<label
									htmlFor="password"
									className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-6 left-2"
								>
									Password
								</label>
								{state.errors.password && (
									<motion.div
										className="text-red-500 text-sm mt-2"
										id="password-error"
										variants={shakeAnimation}
										initial="hidden"
										animate="visible"
									>
										{state.errors.password}
									</motion.div>
								)}
							</div>

							<button
								type="submit"
								className="w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-blue-500 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
								disabled={state.loading}
								aria-label="Login"
							>
								{state.loading ? "Logging in..." : "Login"}
							</button>
						</motion.form>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default AuthPage;
