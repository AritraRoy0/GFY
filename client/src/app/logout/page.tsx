"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useDispatch } from "react-redux";
import { logout } from "./../store";
import LoadingSpinner from "../common/LoadingSpinner";
import Logo from "../common/Logo";

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
		<main className="app-page relative flex min-h-screen items-center justify-center px-4">
			<div className="bg-grid mask-fade-radial pointer-events-none absolute inset-0" aria-hidden="true" />
			<div className="panel edge-glow relative w-full max-w-sm p-8 text-center">
				<div className="flex justify-center">
					<Logo />
				</div>
				<LoadingSpinner size="medium" className="mt-6 text-accent" label="Signing out" />
				<p className="mt-4 text-sm font-medium text-ink">Signing you out</p>
				<p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">Closing secure session</p>
			</div>
		</main>
	);
};

export default LogoutPage;
