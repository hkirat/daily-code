import { Track, Problem } from "@prisma/client";
import { PageToggle } from "./PageToggle";
import Link from "next/link";
import { Button } from "@repo/ui";
import { ArrowUp, ChevronLeft, ChevronRight,HomeIcon } from "lucide-react";
import { motion } from "framer-motion";

const TrackTools = ({
  track,
  problemIndex,
}: {
  allProblems: Problem[];
  track: Track & { problems: Problem[] };
  problemIndex: number;
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10 }}
      className="flex w-full items-center justify-center sm:justify-between gap-2 py-6 sm:p-6"
      >
      <div className="border-primary/10 flex gap-2 rounded-lg border bg-[#e5e5e5]/95 dark:bg-black/95 p-1 backdrop-blur-lg">
        <Link href={"/"}>
          <Button className="flex gap-2 bg-[#323232] font-semibold dark:bg-slate-50">
            <span className="hidden sm:block">Back to home</span>
            <HomeIcon className="size-4" />
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
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:block">Prev</span>
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
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRight className="size-4" />
          </Button>
        </Link>
        {/* To Top */}
        <Button
          className="flex gap-2 dark:bg-[#323232] sm:w-auto" onClick={scrollToTop} variant={"secondary"}
        >
          <span className="hidden sm:block">Go to Top</span>
          <ArrowUp className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TrackTools;
