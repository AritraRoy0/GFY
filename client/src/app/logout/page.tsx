// app/logout/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig"; // Adjust the path if necessary
import { useDispatch } from "react-redux";
import { clearUser } from "../features/authSlice"; // Adjust the path if necessary

const LogoutPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        await signOut(auth);
        dispatch(clearUser());
        router.push("/"); // Redirect to home page after logout
      } catch (error) {
        console.error("Error during sign-out:", error);
        // Optionally, handle the error (e.g., display a message)
      }
    };

    performSignOut();
  }, [dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-700 text-lg">Logging out...</p>
    </div>
  );
};

export default LogoutPage;
