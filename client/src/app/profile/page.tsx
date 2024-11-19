"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./../store";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProfilePage: React.FC = () => {
	const user = useSelector((state: RootState) => state.auth.user);

	if (!user) {
		return null; // Or a loading indicator
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
			<div className="w-full max-w-sm bg-white rounded-lg shadow-md p-4">
				<div className="flex flex-col items-center">
					{/* Placeholder for Profile Icon */}
					<div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
						<span className="text-gray-500 text-3xl font-bold">
							{user.username ? user.username.charAt(0).toUpperCase() : "P"}
						</span>
					</div>

					{/* Display User Information */}
					<h1 className="text-xl font-semibold text-gray-800">
						{user.username || "User Name"}
					</h1>
					<p className="text-gray-600">{user.email || "user@example.com"}</p>
				</div>

				{/* Additional Info */}
				<div className="mt-6 space-y-4">
					<div className="flex items-center">
						<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
							<span className="text-gray-500 text-lg">📧</span>
						</div>
						<p className="ml-4 text-gray-700">
							Email: {user.email || "user@example.com"}
						</p>
					</div>

					<div className="flex items-center">
						<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
							<span className="text-gray-500 text-lg">🔑</span>
						</div>
						<p className="ml-4 text-gray-700">
							ID: {user.id || "Placeholder ID"}
						</p>
					</div>
				</div>
				<div>
					{/* Logout Button */}
					<Link
						href="/logout"
						className="flex items-center px-4 py-2 rounded-md text-white border border-white bg-transparent hover:bg-gray-700 hover:border-gray-700 transition duration-300"
					>
						Logout
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
