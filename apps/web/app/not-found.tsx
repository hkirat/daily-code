"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const paragraphText = "It seems you've ventured into uncharted territory. Let's get you back on track!";
  const words = paragraphText.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const floatingVariant = {
    initial: { y: 0, opacity: 0 },
    animate: {
      y: [0, -10, 0],
      opacity: 1,
      transition: {
        y: {
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        },
        opacity: {
          duration: 0.8,
          ease: "easeInOut",
        },
      },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="relative mx-auto flex min-h-screen w-full flex-col items-center justify-center gap-4 overflow-hidden text-gray-900 dark:text-white">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#080839] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <motion.div
        className="text-gray-750 z-0 -translate-x-1/2 -translate-y-1/2 transform text-8xl font-bold sm:text-9xl md:text-[10rem] lg:text-[11rem] dark:text-gray-200"
        style={{
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
        }}
        variants={floatingVariant}
        initial="initial"
        animate="animate"
      >
        404
      </motion.div>

      <motion.div
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10, delay: 0.3 }}
        initial={{ y: -20, opacity: 0 }}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <h1 className="my-2 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text font-bold text-transparent">
            Oops!
          </span>{" "}
          Page Not Found
        </h1>
        <motion.p
          className="max-w-lg text-center text-sm font-light tracking-tight text-gray-700 sm:text-base md:text-lg dark:text-white/60"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, index) => (
            <motion.span key={index} style={{ display: "inline-block", marginRight: "0.25em" }} variants={child}>
              {word}
            </motion.span>
          ))}
        </motion.p>
        <Link
          href="/"
          className="mt-4 rounded-full bg-blue-500 px-6 py-3 text-sm text-white transition-colors hover:bg-blue-600 sm:text-base dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
}
