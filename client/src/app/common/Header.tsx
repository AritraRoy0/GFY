"use client";

import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HandCoins,
    Info,
    LayoutDashboard,
    LogIn,
    LogOut,
    Menu,
    ShieldCheck,
    UserPlus,
    UserRound,
    X,
} from "lucide-react";
import Logo from "./Logo";
import { RootState } from "../store";

const Header: React.FC = () => {
    const pathname = usePathname();
    const isLoggedIn = useSelector((state: RootState) => state.auth.user) !== null;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = useMemo(() => {
        if (isLoggedIn) {
            return [
                { href: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
                { href: "/loanRequests", icon: HandCoins, text: "Loans" },
                { href: "/profile", icon: UserRound, text: "Profile" },
                { href: "/about", icon: Info, text: "About" },
                { href: "/logout", icon: LogOut, text: "Logout" },
            ];
        }

        return [
            { href: "/about", icon: Info, text: "About" },
            { href: "/auth?tab=login", icon: LogIn, text: "Login" },
            { href: "/auth?tab=signup", icon: UserPlus, text: "Sign Up" },
        ];
    }, [isLoggedIn]);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
            <nav className="app-container">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
                        <Logo />
                        <div className="leading-tight">
                            <span className="block text-base font-semibold tracking-tight text-slate-950">
                                GoFundYourself
                            </span>
                            <span className="hidden text-xs font-medium text-slate-500 sm:block">
                                Peer lending workspace
                            </span>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const linkPath = link.href.split("?")[0];
                            const isActive = pathname === linkPath;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                                        isActive
                                            ? "bg-slate-950 text-white"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                    {link.text}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        <span className="badge">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                            Verified network
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((value) => !value)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="border-t border-slate-200 py-3 md:hidden">
                        <div className="grid gap-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const linkPath = link.href.split("?")[0];
                                const isActive = pathname === linkPath;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={closeMenu}
                                        className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition-colors ${
                                            isActive
                                                ? "bg-slate-950 text-white"
                                                : "text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                        {link.text}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
