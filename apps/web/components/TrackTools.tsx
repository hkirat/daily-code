"use client";
import { useState } from "react";
import { Track, Problem } from "@prisma/client";
import { PageToggle } from "./PageToggle";
import Link from "next/link";
import { Button } from "@repo/ui";
import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Cross1Icon, EyeClosedIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";

const TrackTools = ({
  track,
  problemIndex,
}: {
  allProblems: Problem[];
  track: Track & { problems: Problem[] };
  problemIndex: number;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-start px-2 py-6 md:px-4">
      <Button size="icon" onClick={() => setIsOpen(!isOpen)} className="rounded-full p-2">
        <motion.div
          className="relative flex items-center justify-center gap-2"
          initial={false}
          animate={isOpen ? "open" : "closed"}
        >
          <motion.div
            variants={{
              open: { opacity: 0, rotate: -90, scale: 0 },
              closed: { opacity: 1, rotate: 0, scale: 1 },
            }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            <HamburgerMenuIcon />
          </motion.div>
          <motion.div
            variants={{
              open: { opacity: 1, rotate: 0, scale: 1 },
              closed: { opacity: 0, rotate: 90, scale: 0 },
            }}
            transition={{ duration: 0.3 }}
            className="absolute rounded-full p-2"
          >
            <Cross1Icon />
          </motion.div>
        </motion.div>
      </Button>

      {isOpen && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            type: "spring",
            damping: 10,
          }}
          className="ml-1 flex w-full items-center justify-between gap-2 px-1 md:px-3"
        >
          <div className="border-primary/10 flex gap-2 rounded-lg border bg-black/10 backdrop-blur-lg">
            <Link href={"/"} className="hidden lg:block">
              <Button className="flex gap-2 bg-[#323232] font-semibold dark:bg-slate-50" size={"lg"}>
                Back to home
              </Button>
            </Link>
            <PageToggle allProblems={track.problems} track={track} />
            <Link
              prefetch={true}
              href={problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]!.id}` : ``}
              style={{ cursor: problemIndex !== 0 ? "pointer" : "not-allowed" }}
            >
              <Button
                className="flex gap-2 bg-[#323232] font-semibold dark:bg-slate-50"
                disabled={problemIndex === 0}
                size={"lg"}
              >
                <ChevronLeft className="size-4" />
                <span className="hidden md:block">Prev</span>
              </Button>
            </Link>
            <Link
              prefetch={true}
              href={
                problemIndex + 1 === track.problems.length
                  ? ``
                  : `/tracks/${track.id}/${track.problems[problemIndex + 1]!.id}`
              }
              style={{ cursor: problemIndex + 1 !== track.problems.length ? "pointer" : "not-allowed" }}
            >
              <Button
                className="flex gap-2 bg-[#323232] font-semibold dark:bg-slate-50"
                disabled={problemIndex + 1 === track.problems.length}
                size={"lg"}
              >
                <span className="hidden md:block">Next</span>
                <ChevronRight className="size-4" />
              </Button>
            </Link>

            {/* To Top */}
            <Button className="flex gap-2 dark:bg-[#323232]" onClick={scrollToTop} size={"lg"} variant={"secondary"}>
              <span className="hidden md:block">Go to Top</span>
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrackTools;
