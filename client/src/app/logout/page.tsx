"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig"; // Adjust the path if necessary
import { useDispatch } from "react-redux";
import { logout } from "../auth/authSlice"; // Adjust the path if necessary

const LogoutPage: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                // Sign out from Firebase
                await signOut(auth);
                // Dispatch logout action to Redux store
                dispatch(logout());
                // Redirect to the login page (or any other route)
                router.push("/");
            } catch (error) {
                console.error("Error during logout:", error);
            }
        };

        handleLogout();
    }, [dispatch, router]);

    return <p>Logging out...</p>;
};

export default LogoutPage;
