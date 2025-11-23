"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export default function AuthFlow({ defaultTab = "signin" }: { defaultTab?: "signin" | "signup" }) {
  const [isSignup, setIsSignup] = useState(defaultTab === "signup");

  // EFFECT 1: Update URL when the user clicks a button to toggle the view
  useEffect(() => {
    const newPath = isSignup ? "/sign-up" : "/sign-in";
    // Use Next.js router to properly handle route changes
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', newPath);
    }
  }, [isSignup]);

  // EFFECT 2: Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // When the user navigates using back/forward buttons, the URL changes.
      // This function reads the new URL and syncs the UI state to match it.
      setIsSignup(window.location.pathname === "/sign-up");
    };

    // Listen for the 'popstate' event, which fires on back/forward navigation
    window.addEventListener('popstate', handlePopState);

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount

  const formVariants = {
    hidden: { opacity: 0, x: "-50%" },
    visible: { opacity: 1, x: "0%" },
    exit: { opacity: 0, x: "50%" },
  };

  const overlayContentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <>
      {/* ======================================================================= */}
      {/* Desktop Sliding Door Layout                                             */}
      {/* ======================================================================= */}
      <div className="hidden md:block relative h-screen w-full bg-white dark:bg-gray-800 overflow-hidden">
        {/* Forms Container */}
        <motion.div
          className="absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center p-8"
          key="signin"
          initial="hidden"
          animate={!isSignup ? "visible" : "exit"}
          variants={formVariants}
          transition={{ type: "tween", duration: 0.5 }}
        >
          <div className="w-full max-w-md">
            <SignInForm hideCard />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-0 right-0 h-full w-1/2 flex flex-col items-center justify-center p-8"
          key="signup"
          initial="exit"
          animate={isSignup ? "visible" : "exit"}
          variants={formVariants}
          transition={{ type: "tween", duration: 0.5 }}
        >
          <div className="w-full max-w-md">
            <SignUpForm hideCard />
          </div>
        </motion.div>

        {/* Sliding Overlay Panel */}
        <motion.div
          className="absolute top-0 left-1/2 w-1/2 h-full z-10"
          animate={{ x: isSignup ? "-100%" : "0%" }}
          transition={{ type: "tween", duration: 0.6, ease: "easeInOut" }}
        >
          <div className="relative h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
            <AnimatePresence initial={false} mode="wait">
              {!isSignup ? (
                <motion.div
                  key="toSignup"
                  variants={overlayContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full flex flex-col items-center justify-center text-center p-8"
                >
                  <h2 className="text-3xl font-bold mb-4">New Here?</h2>
                  <Image
                    src="/assets/undraw_sign-up.svg"
                    alt="Sign Up Illustration"
                    width={300}
                    height={200}
                    className="my-4"
                  />
                  <p className="mb-8">Sign up to discover a world of new possibilities!</p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSignup(true)}
                    className="rounded-full border-2 border-white bg-transparent px-10 h-11 font-semibold text-white transition-colors hover:bg-white hover:text-brand"
                  >
                    Sign Up
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="toSignin"
                  variants={overlayContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full flex flex-col items-center justify-center text-center p-8"
                >
                  <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                  <Image
                    src="/assets/undraw_login.svg"
                    alt="Sign In Illustration"
                    width={300}
                    height={200}
                    className="my-4"
                  />
                  <p className="mb-8">Already have an account? Sign in to continue.</p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSignup(false)}
                    className="rounded-full border-2 border-white bg-transparent px-10 h-11 font-semibold text-white transition-colors hover:bg-white hover:text-indigo-600"
                  >
                    Sign In
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ======================================================================= */}
      {/* Mobile Toggle Layout (Unchanged)                                        */}
      {/* ======================================================================= */}
      <div className="md:hidden flex flex-col min-h-screen bg-white dark:bg-gray-800">
        <motion.div
          key={isSignup ? "signup" : "signin"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col items-center justify-center p-8"
        >
          <div className="w-full max-w-md">
            {isSignup ? <SignUpForm hideCard /> : <SignInForm hideCard />}
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            <Button variant="link" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
