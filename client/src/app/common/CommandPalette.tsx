"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CornerDownLeft,
  Fingerprint,
  HandCoins,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Moon,
  PlusCircle,
  Search,
  Sun,
  UserPlus,
  UserRound,
} from "lucide-react";
import { toast } from "react-toastify";
import { RootState } from "../store";
import { useTheme } from "../providers/ThemeProvider";

const OPEN_EVENT = "gfy:open-command-palette";

/** Opens the global command palette from anywhere (buttons, menus). */
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** "⌘" on Apple platforms, "Ctrl" elsewhere. Resolved after mount to keep SSR markup stable. */
export function useModifierKeyLabel() {
  const [label, setLabel] = useState("Ctrl");
  useEffect(() => {
    if (/mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)) setLabel("⌘");
  }, []);
  return label;
}

interface Command {
  id: string;
  group: "Navigate" | "Actions" | "Account";
  label: string;
  hint?: string;
  keywords?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
}

export default function CommandPalette() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setActiveIndex(0);
      const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
      return () => {
        window.cancelAnimationFrame(frame);
        document.body.style.overflow = "";
      };
    }
    restoreFocusRef.current?.focus?.();
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    const list: Command[] = [
      { id: "dashboard", group: "Navigate", label: "Dashboard", hint: "Portfolio overview", icon: LayoutDashboard, keywords: "home portfolio overview", run: go("/dashboard") },
      { id: "marketplace", group: "Navigate", label: "Loan marketplace", hint: "Browse open requests", icon: HandCoins, keywords: "loans requests browse lend fund", run: go("/loanRequests") },
      { id: "profile", group: "Navigate", label: "Profile", hint: "Your account", icon: UserRound, keywords: "account me settings", run: go("/profile") },
      { id: "about", group: "Navigate", label: "About", hint: "How it works", icon: Info, keywords: "company info how", run: go("/about") },
      { id: "home", group: "Navigate", label: "Home", hint: "Landing page", icon: Home, keywords: "landing start", run: go("/") },
      { id: "new-request", group: "Actions", label: "New loan request", hint: "Borrow", icon: PlusCircle, keywords: "create borrow apply post", run: go("/loanRequests#composer") },
      {
        id: "toggle-theme",
        group: "Actions",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        hint: "Appearance",
        icon: theme === "dark" ? Sun : Moon,
        keywords: "theme dark light mode appearance color",
        run: toggleTheme,
      },
    ];

    if (user) {
      list.push(
        {
          id: "copy-id",
          group: "Actions",
          label: "Copy my member ID",
          icon: Fingerprint,
          keywords: "uid identifier clipboard",
          run: () => {
            navigator.clipboard.writeText(user.id).then(
              () => toast.success("Member ID copied to clipboard."),
              () => toast.error("Could not access the clipboard.")
            );
          },
        },
        { id: "logout", group: "Account", label: "Log out", icon: LogOut, keywords: "sign out exit", run: go("/logout") }
      );
    } else {
      list.push(
        { id: "login", group: "Account", label: "Sign in", icon: LogIn, keywords: "login log in", run: go("/auth?tab=login") },
        { id: "signup", group: "Account", label: "Create account", icon: UserPlus, keywords: "register sign up join", run: go("/auth?tab=signup") }
      );
    }
    return list;
  }, [router, theme, toggleTheme, user]);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return commands;
    return commands.filter((command) => {
      const haystack = `${command.label} ${command.hint ?? ""} ${command.keywords ?? ""} ${command.group}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [commands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const execute = (command: Command | undefined) => {
    if (!command) return;
    setOpen(false);
    command.run();
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      execute(results[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      // Keep focus inside the dialog; the input is its only focus stop.
      event.preventDefault();
    }
  };

  let lastGroup: string | null = null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <div className="scrim absolute inset-0" onClick={close} aria-hidden="true" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line-strong bg-surface shadow-lift"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search pages and actions..."
                className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint focus-visible:outline-none"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-palette-list"
                aria-activedescendant={results[activeIndex] ? `command-${results[activeIndex].id}` : undefined}
                aria-autocomplete="list"
              />
              <span className="kbd">esc</span>
            </div>

            <ul ref={listRef} id="command-palette-list" role="listbox" className="max-h-[min(60vh,22rem)] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-10 text-center text-sm text-ink-muted">No matches for &ldquo;{query}&rdquo;</li>
              )}
              {results.map((command, index) => {
                const Icon = command.icon;
                const showGroup = command.group !== lastGroup;
                lastGroup = command.group;
                const active = index === activeIndex;
                return (
                  <React.Fragment key={command.id}>
                    {showGroup && (
                      <li role="presentation" className="data-label px-3 pb-1.5 pt-3 first:pt-1.5">
                        {command.group}
                      </li>
                    )}
                    <li
                      id={`command-${command.id}`}
                      role="option"
                      aria-selected={active}
                      data-index={index}
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={() => execute(command)}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        active ? "bg-surface-3 text-ink" : "text-ink-2"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-md border ${
                          active ? "border-accent/40 bg-accent/10 text-accent" : "border-line-strong bg-surface-2 text-ink-muted"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 truncate font-medium">{command.label}</span>
                      {command.hint && <span className="hidden text-xs text-ink-muted sm:inline">{command.hint}</span>}
                      {active ? (
                        <CornerDownLeft className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 text-transparent" aria-hidden="true" />
                      )}
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>

            <div className="flex items-center justify-between gap-4 border-t border-line bg-canvas/40 px-4 py-2.5 text-[11px] text-ink-muted">
              <span className="flex items-center gap-1.5">
                <span className="kbd">↑</span>
                <span className="kbd">↓</span>
                navigate
                <span className="kbd ml-2">↵</span>
                open
              </span>
              <span className="font-mono uppercase tracking-[0.16em]">GFY / cmd</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
