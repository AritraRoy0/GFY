// components/Logo.tsx

import React from "react";

const Logo: React.FC = () => {
	const width = 100;
	const height = 100;
	const gapHeight = 10; // Height from the top vertex where the gap starts
	const gapSize = 10; // Size of the gap

	return (
		<header className="flex items-center justify-center h-16 bg-transparent">
			<div className="relative w-12 h-12">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 100 100"
					fill="none"
					stroke="white"
					strokeWidth="4"
					className="w-full h-full"
				>
					{/* bottom line */}
					<path d="M 0 100 L 100 100" />

					{/* left line */}

					<path d="M 0 100 L 38 30" />

					<path d="M 100 100 L 62 30" />
				</svg>
			</div>
		</header>
	);
};

export default Logo;
