"use client";

import React, {Suspense} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import OwnProfile from "./OwnProfile";
import OtherLenderProfile from "./OtherLenderProfile";
import OtherLendeeProfile from "./OtherLendeeProfile";
import AppShell from "../common/AppShell";
import { PageLoader } from "../common/LoadingSpinner";
import { StatePanel } from "../common/ui";

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
    <AppShell>
      <StatePanel
        icon={<AlertCircle />}
        tone="warning"
        title="Invalid profile type"
        description="Use lender or borrower profile links from the marketplace or your dashboard."
        action={
          <Link href="/loanRequests" className="btn-primary">
            Open marketplace
          </Link>
        }
      />
    </AppShell>
  );
};
// Main ProfilePage component with Suspense boundary
const ProfilePage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <AppShell>
          <PageLoader label="Loading profile" />
        </AppShell>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
};

export default ProfilePage;
