"use client";
import React, { useEffect, useState } from "react";
import { ContentSearch } from "../components/ContentSearch";
import { motion } from "framer-motion";
import { Spotlight } from "@repo/ui";
import { TrackPros } from "./Tracks";

export default function Hero({ tracks }: { tracks: TrackPros[] }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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

  return (
    <div className="flex flex-col gap-4 h-[50vh] md:h-[75vh] size-screen mx-auto justify-center">
      <div className="relative w-full">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          aria-label="TypeScript"
          role="img"
          viewBox="0 0 512 512"
          className="hidden lg:block size-12 absolute -top-10 -left-24 -rotate-12 drop-shadow-[0_16px_24px_rgba(49,120,198,0.35)]"
          style={{
            x: mousePosition.x * 0.04, // Parallax effect based on mouse position
            y: mousePosition.y * 0.04,
          }}
          variants={floatingVariant}
          initial="initial"
          animate="animate"
        >
          <rect width="512" height="512" rx="15%" fill="#3178c6" />
          <path
            fill="#ffffff"
            d="m233 284h64v-41H118v41h64v183h51zm84 173c8.1 4.2 18 7.3 29 9.4s23 3.1 35 3.1c12 0 23-1.1 34-3.4c11-2.3 20-6.1 28-11c8.1-5.3 15-12 19-21s7.1-19 7.1-32c0-9.1-1.4-17-4.1-24s-6.6-13-12-18c-5.1-5.3-11-10-18-14s-15-8.2-24-12c-6.6-2.7-12-5.3-18-7.9c-5.2-2.6-9.7-5.2-13-7.8c-3.7-2.7-6.5-5.5-8.5-8.4c-2-3-3-6.3-3-10c0-3.4.89-6.5 2.7-9.3s4.3-5.1 7.5-7.1c3.2-2 7.2-3.5 12-4.6c4.7-1.1 9.9-1.6 16-1.6c4.2 0 8.6.31 13 .94c4.6.63 9.3 1.6 14 2.9c4.7 1.3 9.3 2.9 14 4.9c4.4 2 8.5 4.3 12 6.9v-47c-7.6-2.9-16-5.1-25-6.5s-19-2.1-31-2.1c-12 0-23 1.3-34 3.8s-20 6.5-28 12c-8.1 5.4-14 12-19 21c-4.7 8.4-7 18-7 30c0 15 4.3 28 13 38c8.6 11 22 19 39 27c6.9 2.8 13 5.6 19 8.3s11 5.5 15 8.4c4.3 2.9 7.7 6.1 10 9.5c2.5 3.4 3.8 7.4 3.8 12c0 3.2-.78 6.2-2.3 9s-3.9 5.2-7.1 7.2s-7.1 3.6-12 4.8c-4.7 1.1-10 1.7-17 1.7c-11 0-22-1.9-32-5.7c-11-3.8-21-9.5-28.1-15.44z"
          />
        </motion.svg>
        <motion.svg
          className="hidden lg:block size-12 absolute top-80 -left-32 drop-shadow-[0_16px_24px_rgba(0,0,255,0.35)] "
          style={{
            x: mousePosition.x * 0.02, // Parallax effect based on mouse position
            y: mousePosition.y * 0.02,
          }}
          variants={floatingVariant}
          initial="initial"
          animate="animate"
          width="800px"
          height="800px"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M29.01,5.03,23.244,2.254a1.742,1.742,0,0,0-1.989.338L2.38,19.8A1.166,1.166,0,0,0,2.3,21.447c.025.027.05.053.077.077l1.541,1.4a1.165,1.165,0,0,0,1.489.066L28.142,5.75A1.158,1.158,0,0,1,30,6.672V6.605A1.748,1.748,0,0,0,29.01,5.03Z"
            fill="#0065a9"
          />
          <path
            d="M29.01,26.97l-5.766,2.777a1.745,1.745,0,0,1-1.989-.338L2.38,12.2A1.166,1.166,0,0,1,2.3,10.553c.025-.027.05-.053.077-.077l1.541-1.4A1.165,1.165,0,0,1,5.41,9.01L28.142,26.25A1.158,1.158,0,0,0,30,25.328V25.4A1.749,1.749,0,0,1,29.01,26.97Z"
            fill="#007acc"
          />
          <path
            d="M23.244,29.747a1.745,1.745,0,0,1-1.989-.338A1.025,1.025,0,0,0,23,28.684V3.316a1.024,1.024,0,0,0-1.749-.724,1.744,1.744,0,0,1,1.989-.339l5.765,2.772A1.748,1.748,0,0,1,30,6.6V25.4a1.748,1.748,0,0,1-.991,1.576Z"
            fill="#1f9cf0"
          />
        </motion.svg>
        <motion.svg
          style={{
            x: mousePosition.x * 0.02, // Parallax effect based on mouse position
            y: mousePosition.y * 0.02,
          }}
          variants={floatingVariant}
          initial="initial"
          animate="animate"
          className="hidden lg:block size-16 absolute bottom-20 right-0 rotate-12 drop-shadow-[0_16px_24px_rgba(160,79,18,0.35)]"
          fill="none"
          viewBox="0, 0, 32, 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.124 5.3a.832.832 0 111.664 0 .832.832 0 01-1.664 0zM5.2 12.834a.832.832 0 111.664 0 .832.832 0 01-1.664 0zm19.856.039a.832.832 0 111.664 0 .832.832 0 01-1.664 0zm-17.451 1.14a.76.76 0 00.386-1l-.369-.835h1.452v6.545h-2.93a10.246 10.246 0 01-.332-3.911l1.793-.799zm6.074.161v-1.929h3.458c.179 0 1.261.206 1.261 1.016 0 .672-.83.913-1.513.913h-3.206zM8.958 24.561a.832.832 0 111.664 0 .832.832 0 01-1.664 0zm12.331.039a.832.832 0 111.664 0 .832.832 0 01-1.664 0zm.257-1.887a.76.76 0 00-.9.584l-.418 1.949a10.246 10.246 0 01-8.545-.041l-.417-1.949a.758.758 0 00-.9-.583l-1.721.37c-.32-.33-.617-.68-.89-1.049h8.374c.095 0 .158-.017.158-.1v-2.966c0-.086-.063-.1-.158-.1h-2.45v-1.881h2.649a1.665 1.665 0 011.629 1.412c.105.413.336 1.757.494 2.187.157.483.8 1.447 1.482 1.447h4.323c-.29.389-.607.756-.949 1.1l-1.761-.38zm4.65-7.821c.059.591.066 1.186.022 1.779h-1.051c-.105 0-.148.069-.148.172v.483c0 1.136-.641 1.384-1.2 1.447-.535.06-1.128-.224-1.2-.551a3.616 3.616 0 00-1.671-2.808c1.03-.654 2.1-1.619 2.1-2.911a3.294 3.294 0 00-1.608-2.7 4.562 4.562 0 00-2.2-.724H8.367A10.246 10.246 0 0114.1 5.84l1.282 1.344a.76.76 0 001.073.025l1.434-1.372a10.246 10.246 0 017.015 5l-.982 2.217a.761.761 0 00.386 1l1.888.838zm2.448.036l-.033-.343 1.011-.943a.42.42 0 00-.134-.676l-1.288-.483-.1-.334.806-1.12a.42.42 0 00-.263-.636l-1.363-.222-.164-.306.573-1.257a.418.418 0 00-.382-.573l-1.383.048-.224-.264.318-1.347a.42.42 0 00-.487-.487l-1.348.315-.266-.219.049-1.381a.42.42 0 00-.572-.383l-1.257.573-.306-.164-.222-1.363a.421.421 0 00-.636-.263l-1.121.806-.333-.1-.483-1.293a.421.421 0 00-.675-.135l-.943 1.012-.343-.033-.728-1.177a.421.421 0 00-.688 0l-.728 1.177-.343.033-.943-1.012a.42.42 0 00-.675.135L12.483 3.8l-.333.1-1.12-.8a.421.421 0 00-.636.263l-.222 1.363-.306.164-1.258-.573a.42.42 0 00-.572.383l.048 1.383-.266.217-1.347-.316a.42.42 0 00-.487.487L6.3 7.819l-.218.265L4.7 8.036a.422.422 0 00-.383.573l.573 1.257-.164.306-1.363.222a.42.42 0 00-.263.636l.806 1.12-.1.334-1.293.483a.421.421 0 00-.134.676l1.011.943-.033.343-1.177.728a.421.421 0 000 .688l1.177.728.033.343-1.011.943a.421.421 0 00.134.675l1.293.483.1.334-.806 1.121a.421.421 0 00.264.636l1.363.222.164.307-.573 1.257a.42.42 0 00.383.573l1.383-.048.219.266-.317 1.348a.42.42 0 00.487.486l1.345-.319.266.218-.049 1.382a.42.42 0 00.572.382l1.257-.573.306.164.222 1.362a.421.421 0 00.636.264l1.12-.807.334.1.483 1.292a.421.421 0 00.675.134l.943-1.011.343.034.728 1.177a.422.422 0 00.688 0l.728-1.177.343-.034.943 1.011a.421.421 0 00.675-.134l.483-1.292.334-.1 1.12.807a.42.42 0 00.636-.264l.222-1.362.306-.164 1.257.573a.42.42 0 00.572-.382l-.048-1.384.265-.218 1.347.317a.419.419 0 00.487-.486l-.312-1.346.218-.266 1.383.048a.42.42 0 00.382-.573l-.573-1.257.164-.307 1.363-.222a.42.42 0 00.263-.636l-.806-1.12.1-.334 1.293-.483a.42.42 0 00.134-.675l-1.011-.943.033-.343 1.177-.728a.42.42 0 000-.688l-1.176-.728z"
            fill="url(#paint0_radial)"
          />
          <defs>
            <radialGradient
              id="paint0_radial"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(12.12436 -7 4.2 7.27461 16 16)"
            >
              <stop stopColor="#7D7D7D" />
              <stop offset=".267" stopColor="#7E7C7A" />
              <stop offset=".45" stopColor="#817871" />
              <stop offset=".608" stopColor="#867162" />
              <stop offset=".753" stopColor="#8D684C" />
              <stop offset=".886" stopColor="#965C30" />
              <stop offset="1" stopColor="#A04F12" />
            </radialGradient>
          </defs>
        </motion.svg>
        <motion.svg
          className="hidden lg:block size-14 absolute top-96 -right-32 rotate-12 drop-shadow-[0_16px_24px_rgba(247,147,20,0.35)]"
          style={{
            x: mousePosition.x * 0.04,
            y: mousePosition.y * 0.04,
          }}
          variants={floatingVariant}
          initial="initial"
          animate="animate"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Bitcoin"
          role="img"
          viewBox="0 0 512 512"
        >
          <rect width="512" height="512" rx="15%" fill="#f7931a" />
          <path
            fill="#ffffff"
            d="m391 216c6-43-25-64-68-79l14-55-34-9-13 54-28-7 14-54-35-9-13 56-22-5-47-12-8 36 24 6c14 4 17 14 15 21l-15 63 3 1-3-1-22 89c-2 5-6 11-16 8l-24-6-17 39 68 17-13 57 33 8 14-55 26 6-13 55 34 9 14-56c58 11 102 6 120-46 14-42-1-66-32-82 22-5 39-20 44-49zm-77 108c-11 41-82 20-105 14l19-75c23 6 97 17 86 61zm9-110c-9 39-67 20-87 15l17-68c20 5 81 14 70 53z"
          />
        </motion.svg>
      </div>
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10, delay: 0.3 }}
        initial={{ y: -20, opacity: 0 }}
        className="max-w-7xl mx-auto px-4 flex flex-col gap-4 items-center justify-center"
      >
        <div className="flex flex-col items-center justify-center">
          <span className="tracking-tighter text-2xl md:text-3xl text-center font-medium text-primary/80 ">
            Welcome to
          </span>
          <h1 className="tracking-tighter text-6xl md:text-7xl xl:text-8xl text-center font-bold my-2">
            <span className="font-bold bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">
              100x
            </span>{" "}
            Projects.
          </h1>
        </div>
        <p className="text-primary/80 max-w-lg text-center tracking-tight md:text-lg font-light">
          A platform where you'll find the right content to help you improve your skills and grow your knowledge.
        </p>
        <ContentSearch tracks={tracks} />
      </motion.div>
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 -z-10" fill="blue" />
    </div>
  );
}
