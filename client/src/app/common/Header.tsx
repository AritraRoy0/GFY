"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Menu, Search, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { openCommandPalette, useModifierKeyLabel } from "./CommandPalette";
import { RootState } from "../store";

const navLinks = [
    { href: "/loanRequests", text: "Marketplace" },
    { href: "/#calculator", text: "Calculator" },
    { href: "/#workflow", text: "How it works" },
    { href: "/#faq", text: "FAQ" },
    { href: "/about", text: "About" },
];

/** Top navigation for public pages (landing, about). Workspace pages use AppShell instead. */
const Header: React.FC = () => {
    const pathname = usePathname();
    const { user, initialized } = useSelector((state: RootState) => state.auth);
    const isLoggedIn = user !== null;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const modKey = useModifierKeyLabel();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header
            className={`sticky top-0 z-50 transition-[background-color,border-color] duration-300 ${
                scrolled || isMenuOpen ? "border-b border-line bg-canvas/80 backdrop-blur-xl" : "border-b border-transparent"
            }`}
        >
            <nav className="app-container" aria-label="Primary">
                <div className="flex h-16 items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2.5" onClick={closeMenu}>
                        <Logo />
                        <span className="text-[15px] font-semibold tracking-tight text-ink">GoFundYourself</span>
                    </Link>

                    <div className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        isActive ? "text-ink" : "text-ink-muted hover:text-ink"
                                    }`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {link.text}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        <button
                            type="button"
                            onClick={openCommandPalette}
                            className="flex h-9 items-center gap-2 rounded-lg border border-line bg-surface/60 pl-3 pr-1.5 text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
                            aria-label="Open command palette"
                        >
                            <Search className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="hidden lg:inline">Search</span>
                            <span className="kbd">{modKey} K</span>
                        </button>
                        <ThemeToggle />
                        <div className={`flex items-center gap-2 transition-opacity ${initialized ? "opacity-100" : "opacity-0"}`}>
                            {isLoggedIn ? (
                                <Link href="/dashboard" className="btn-primary h-9 py-0">
                                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                                    Open dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/auth?tab=login" className="btn-ghost h-9">
                                        Sign in
                                    </Link>
                                    <Link href="/auth?tab=signup" className="btn-primary h-9 py-0">
                                        Get started
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle className="h-10 w-10" />
                        <button
                            type="button"
                            onClick={openCommandPalette}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface/60 text-ink-2"
                            aria-label="Search"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((value) => !value)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface/60 text-ink-2"
                            aria-label="Toggle navigation menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden md:hidden"
                        >
                            <div className="grid gap-1 border-t border-line py-3">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={closeMenu}
                                        className="rounded-lg px-3 py-3 text-sm font-medium text-ink-2 hover:bg-surface-2 hover:text-ink"
                                    >
                                        {link.text}
                                    </Link>
                                ))}
                                <div className="mt-2 grid gap-2 border-t border-line pt-3">
                                    {isLoggedIn ? (
                                        <Link href="/dashboard" onClick={closeMenu} className="btn-primary">
                                            Open dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/auth?tab=signup" onClick={closeMenu} className="btn-primary">
                                                Get started
                                            </Link>
                                            <Link href="/auth?tab=login" onClick={closeMenu} className="btn-secondary">
                                                Sign in
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default Header;
