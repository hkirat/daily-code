import { Track, Problem } from "@prisma/client";
import { PageToggle } from "./PageToggle";
import Link from "next/link";
import { Button } from "@repo/ui";
import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
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
      className="flex w-full items-center justify-between gap-2 p-6"
    >
      <div className="border-primary/10 flex gap-2 rounded-lg border bg-black/10 p-1 backdrop-blur-lg">
        <Link href={"/"} className="hidden lg:block">
          <Button className="flex gap-2 bg-[#323232] font-semibold dark:bg-slate-50" size={"lg"}>
            Back to home
          </Button>
        </Link>
        <PageToggle allProblems={track.problems} track={track} />
        <div style={{ cursor: problemIndex !== 0 ? "pointer" : "not-allowed" }}>
          <Link
            prefetch={true}
            href={problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]!.id}` : ``}
            className={ problemIndex === 0 ? "pointer-events-none" : "" }
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
        </div>
        <div style={{ cursor: problemIndex + 1 !== track.problems.length ? "pointer" : "not-allowed" }}>
          <Link
            prefetch={true}
            href={
              problemIndex + 1 === track.problems.length
                ? ``
                : `/tracks/${track.id}/${track.problems[problemIndex + 1]!.id}`
            }
            className={ problemIndex + 1 === track.problems.length ? "pointer-events-none" : "" }
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
        </div>

        {/* To Top */}
        <Button className="flex gap-2 dark:bg-[#323232]" onClick={scrollToTop} size={"lg"} variant={"secondary"}>
          <span className="hidden md:block">Go to Top</span>
          <ArrowUp className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TrackTools;
