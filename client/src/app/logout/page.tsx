"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useDispatch } from "react-redux";
import { logout } from "./../store";
import LoadingSpinner from "../common/LoadingSpinner";

const LogoutPage: React.FC = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	useEffect(() => {
		const logoutUser = async () => {
			await signOut(auth);
			dispatch(logout());
			router.push("/");
		};
		logoutUser();
	}, [dispatch, router]);

	return (
		<main className="app-page flex min-h-screen items-center justify-center px-4">
			<div className="surface-card p-8 text-center">
				<LoadingSpinner size="large" className="mb-4 text-sky-700" />
				<p className="text-sm font-semibold text-slate-700">Logging out...</p>
			</div>
		</main>
	);
};

export default LogoutPage;
