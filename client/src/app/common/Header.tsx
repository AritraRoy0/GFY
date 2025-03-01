// app/components/Header.tsx

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaBriefcase,
  FaHandHoldingUsd,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo"; // Adjust the path to your Logo component if necessary

// shadcn UI imports
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

// Define the shape of your Redux state for better TypeScript support
interface User {
  id: string;
  email: string;
}

interface RootState {
  auth: {
    user: User | null;
  };
}

const Header: React.FC = () => {
  const isLoggedIn =
    useSelector((state: RootState) => state.auth.user) !== null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevState) => !prevState);
  }, []);

  const linkClassNames =
    "flex items-center px-4 py-2 rounded-md text-white border border-white bg-transparent hover:bg-gray-700 hover:border-gray-700 transition duration-300";

  const loggedInHeader = useMemo(
    () => (
      <>
        <Link href="/dashboard" className={linkClassNames}>
          <FaBriefcase className="h-5 w-5 mr-2 text-white" />
          Dashboard
        </Link>
        <Link href="/loanRequests" className={linkClassNames}>
          <FaHandHoldingUsd className="h-5 w-5 mr-2 text-white" />
          Loan Requests
        </Link>
        <Link href="/profile" className={linkClassNames}>
          <FaUser className="h-5 w-5 mr-2 text-white" />
          Profile
        </Link>
        <Link href="/about" className={linkClassNames}>
          <FaInfoCircle className="h-5 w-5 mr-2 text-white" />
          About
        </Link>
        <Link href="/logout" className={linkClassNames}>
          <FaSignOutAlt className="h-5 w-5 mr-2 text-white" />
          Logout
        </Link>
      </>
    ),
    []
  );

  const loggedOutHeader = useMemo(
    () => (
      <>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <a href="/about">About</a>
            </NavigationMenuTrigger>  
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-center items-center gap-4 rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="flex flex-row justify-start gap-2 items-center"> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"/>
                      </svg>
                      <div className="text-lg font-medium">
                        Learn about us
                      </div>                    
                    </div>
                   
                    <p className="text-sm leading-tight text-muted-foreground">
                    Seek help growing your company, or help others grow theirs.
                    </p>
                  </a>
                </NavigationMenuLink>

              </li>
              <ListItem href="/" title="Our Team" target="_blank">
              <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="m13.85 4.44l-3.28-3.3l-.35-.14H2.5l-.5.5V7h1V2h6v3.5l.5.5H13v1h1V4.8zM10 5V2l3 3zM2.5 8l-.5.5v6l.5.5h11l.5-.5v-6l-.5-.5zM13 13v1H3V9h10zm-8-1h-.32v1H4v-3h1.06c.75 0 1.13.36 1.13 1a.94.94 0 0 1-.32.72A1.33 1.33 0 0 1 5 12m-.06-1.45h-.26v.93h.26c.36 0 .54-.16.54-.47s-.18-.46-.54-.46M9 12.58a1.48 1.48 0 0 0 .44-1.12c0-1-.53-1.46-1.6-1.46H6.78v3h1.06A1.6 1.6 0 0 0 9 12.58m-1.55-.13v-1.9h.33a.94.94 0 0 1 .7.25a.9.9 0 0 1 .25.67a1 1 0 0 1-.25.72a.94.94 0 0 1-.69.26zm4.45-.61h-.97V13h-.68v-3h1.74v.55h-1.06v.74h.97z" clip-rule="evenodd"/></svg>

              <p className="text-sm leading-tight text-muted-foreground">
              Check out our talented individuals
              </p>
                       
              </div>
              </ListItem>
              
              <ListItem href="/" title="LinkedIn" target="_blank">
              <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"/></svg>
              <p className="text-sm leading-tight text-muted-foreground">
              Follow us on our socials
              </p>
              
              </div>
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <a href="/about">Statistics</a>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
              <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-center items-center gap-4 rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/about"
                  >
                    <div className="flex flex-row justify-start gap-2 items-center"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M2.5 20v-.685c0-.685.498-1.483 1.114-1.784l5.66-2.762c.821-.4 1.012-1.288.42-1.99l-.362-.429C8.596 11.478 8 9.85 8 8.71V7a4 4 0 0 1 8 0v1.71c0 1.14-.6 2.773-1.332 3.642l-.361.428c-.59.699-.406 1.588.419 1.99l5.66 2.762c.615.3 1.114 1.093 1.114 1.783V20a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1"/></svg>
                      <div className="text-lg font-medium">
                        About
                      </div>                    
                    </div>
                   
                    <p className="text-sm leading-tight text-muted-foreground">
                      My quick intro, and a couple of links you can visit
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/about#info" title="Testimonials">
                What ours users have to say
              </ListItem>
              <ListItem href="/about#techstack" title="Peer to Peer Lending">
                What we use to secure our transactions
              </ListItem>
              <ListItem href="/about#connect" title="Pricing">
                We offer different pricing tiers
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        =

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <a href="/">Sign Up</a>
            </NavigationMenuTrigger>
          
          
        </NavigationMenuItem>

    

      </NavigationMenuList>
    </NavigationMenu>
      </>
    ),
    []
  );

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  return (
    <header className="bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo and Brand Name */}
        <Link href="/" className="flex items-center space-x-2">
          <Logo /> {/* Use the Logo component here */}
          <span className="text-2xl font-extrabold text-white">
            Go Fund Yourself!!
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {isLoggedIn ? loggedInHeader : loggedOutHeader}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            type="button"
            className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-gray-800 shadow-md"
            id="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-4 pb-3 space-y-2 sm:px-3">
              {isLoggedIn ? (
                <div className="flex flex-col space-y-2">
                  <Link href="/dashboard" className={linkClassNames}>
                    <FaBriefcase className="h-5 w-5 mr-2 text-white" />
                    Dashboard
                  </Link>
                  <Link href="/loanRequests" className={linkClassNames}>
                    <FaHandHoldingUsd className="h-5 w-5 mr-2 text-white" />
                    Loan Requests
                  </Link>
                  <Link href="/profile" className={linkClassNames}>
                    <FaUser className="h-5 w-5 mr-2 text-white" />
                    Profile
                  </Link>
                  <Link href="/about" className={linkClassNames}>
                    <FaInfoCircle className="h-5 w-5 mr-2 text-white" />
                    About
                  </Link>
                  <Link href="/logout" className={linkClassNames}>
                    <FaSignOutAlt className="h-5 w-5 mr-2 text-white" />
                    Logout
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/about" className={linkClassNames}>
                    <FaInfoCircle className="h-5 w-5 mr-2 text-white" />
                    About
                  </Link>
                  <Link href="/auth?tab=login" className={linkClassNames}>
                    <FaSignInAlt className="h-5 w-5 mr-2 text-white" />
                    Login
                  </Link>
                  <Link href="/auth?tab=signup" className={linkClassNames}>
                    <FaUserPlus className="h-5 w-5 mr-2 text-white" />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default Header;
