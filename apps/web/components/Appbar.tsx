import Link from "next/link";
import { Button } from "@repo/ui";
import { ModeToggle } from "./ModeToggle";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import UserAccountDropDown from "./UserAccountDropDown";
import Image from "next/image";
import { motion } from "framer-motion";

export const Appbar = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky mx-auto wrapper top-0 z-50 flex items-center gap-2 py-6 w-full">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10 }}
        className="flex w-full justify-between mx-auto bg-secondary/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-primary/10 p-6 rounded-2xl"
      >
        <Link href={"/"} className="flex items-center gap-2 cursor-pointer">
          <Image
            src={"https://appx-wsb-gcp.akamai.net.in/subject/2023-01-17-0.17044360120951185.jpg"}
            alt="Logo"
            width={300}
            height={200}
            className="rounded-full size-10"
          />
          <span className="text-lg md:text-2xl font-bold tracking-tight text-foreground hidden md:block">
            100xProjects
          </span>
        </Link>
        <div className="flex items-center gap-8">
          <ModeToggle />
          {!user ? (
            <Button
              className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear"
              onClick={async () => {
                await signIn();
              }}
            >
              Login
            </Button>
          ) : (
            ""
          )}

          <UserAccountDropDown />
        </div>
      </motion.div>
    </nav>
  );
};
