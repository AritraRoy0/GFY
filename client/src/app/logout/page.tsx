"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig"; // Adjust the path
import { useDispatch, useSelector } from "react-redux";
import { RootState, logout } from "./../store";

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
	}, []);

	return <p>Logging out...</p>;
};

export default LogoutPage;
