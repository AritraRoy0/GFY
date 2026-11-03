"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { shortId } from "./format";

export interface MemberSummary {
  id: string;
  username?: string;
  email?: string;
}

// Shared across hook instances so each member document is read at most once per session.
const memberCache = new Map<string, Promise<MemberSummary>>();

function loadMember(uid: string): Promise<MemberSummary> {
  let pending = memberCache.get(uid);
  if (!pending) {
    pending = getDoc(doc(firestore, "users", uid))
      .then((snapshot) => {
        const data = snapshot.exists() ? snapshot.data() : {};
        return { id: uid, username: data.username, email: data.email };
      })
      .catch(() => ({ id: uid }));
    memberCache.set(uid, pending);
  }
  return pending;
}

/** Resolves member IDs to profile summaries. Unknown or unreadable members resolve to just their ID. */
export function useUserDirectory(uids: string[]) {
  const [members, setMembers] = useState<Record<string, MemberSummary>>({});
  const key = useMemo(() => Array.from(new Set(uids.filter(Boolean))).sort().join("|"), [uids]);

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    Promise.all(key.split("|").map(loadMember)).then((results) => {
      if (cancelled) return;
      setMembers((previous) => {
        const next = { ...previous };
        results.forEach((member) => {
          next[member.id] = member;
        });
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return members;
}

export function memberName(uid: string, member?: MemberSummary) {
  return member?.username || member?.email?.split("@")[0] || `Member ${shortId(uid)}`;
}
