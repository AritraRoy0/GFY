"use client";

import React, {Suspense} from "react";
import { useSearchParams } from "next/navigation";
import OwnProfile from "./OwnProfile";
import OtherLenderProfile from "./OtherLenderProfile";
import OtherLendeeProfile from "./OtherLendeeProfile";

const ProfilePageContent: React.FC = () => {
  // useSearchParams hook gives access to URL search params
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type"); // Expected to be either "lender" or "lendee"

  // If no id is provided, assume it's the logged-in user's own profile.
  if (!id) {
    return <OwnProfile />;
  }

  // If an id is provided, render the appropriate public profile based on the type.
  if (type === "lender") {
    return <OtherLenderProfile />;
  } else if (type === "lendee") {
    return <OtherLendeeProfile />;
  }

  // Fallback if an unknown type is provided.
  return (
    <div className="app-page flex min-h-screen items-center justify-center px-4">
      <div className="surface-card max-w-md p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-950">Invalid profile type</h1>
        <p className="mt-2 text-sm text-slate-600">Use lender or lendee profile links from the marketplace.</p>
      </div>
    </div>
  );
};
// Main ProfilePage component with Suspense boundary
const ProfilePage: React.FC = () => {
  return (
    <Suspense fallback={<div className="app-page flex min-h-screen items-center justify-center">Loading profile...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
};

export default ProfilePage;
