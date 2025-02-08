"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { Download, Menu, RefreshCcwDot, User, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DownloadIcon } from "@radix-ui/react-icons";

import { Problem, Track } from "@prisma/client";
import { isLegacyViewMode } from "@repo/store";
import { Button, Card, CardContent, Separator } from "@repo/ui";

import { ModeToggle } from "./ModeToggle";
import UserAccountDropDown from "./UserAccountDropDown";
import CustomPagination from "./CustomPagination";

export const BlogAppbar = ({
  track,
  problemIndex,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
  problemIndex: number;
}) => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;

  const [isLegacyMode, setIsLegacyMode] = useRecoilState(isLegacyViewMode);

  const { trackIds }: { trackIds?: string[] } = useParams();
  const currentTrack = trackIds ? trackIds.join("/") : "";

  const [isOpen, setIsOpen] = useState<boolean>(() => {
    const storedPreference = localStorage.getItem("modeToggleIsOpen");
    return storedPreference === "true" || false;
  });
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const toggleViewMode = () => {
    const newViewMode = !isLegacyMode ? "legacy" : "new";
    setIsLegacyMode(!isLegacyMode);
    localStorage.setItem("viewMode", newViewMode);
  };

  const debounce = (func: any, delay: any) => {
    let timeoutId: any;
    return (...args: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedHandleScroll = debounce(() => {
    const currentScrollPos = window.scrollY;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 50);
    setScrollingDown(prevScrollPos < currentScrollPos);
    setPrevScrollPos(currentScrollPos);
  }, 90);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setVisible(false);
        setIsOpen(false);
      } else {
        // Scrolling up
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    }
  };

  const renderTopics = () => {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ x: -20 }}
          transition={{ duration: 0.3 }}
          className={`${visible ? "translate-y-0" : "-translate-y-full"} px-6`}
        >
          <Card className="border-primary/10 no-scrollbar max-h-[50vh] w-fit overflow-auto bg-[#e5e5e5]/95 pt-4 backdrop-blur-lg dark:bg-black/95">
            {track?.problems?.map((problem: { id: string; title: string }, index: number) => {
              const isDisabled = currentTrack === `${track.id}/${problem.id}`;
              return (
                <CardContent key={index} className={isDisabled ? "opacity-50" : ""}>
                  <Link
                    key={problem.id}
                    prefetch
                    className="w-full max-w-screen-md"
                    href={`/tracks/${track.id}/${problem.id}`}
                    onClick={(e) => isDisabled && e.preventDefault()}
                  >
                    {index + 1} - {problem.title}
                  </Link>
                </CardContent>
              );
            })}
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderUIModeToggleButton = () => (
    <Button onClick={toggleViewMode} className="flex gap-2">
      <span className="hidden lg:block">{`Switch to ${isLegacyMode ? "New" : "Old"} UI`}</span>
      <RefreshCcwDot size={16} />
    </Button>
  );

  const renderBlogAppbar = () =>
    isLegacyMode ? (
      <div
        className={`sticky top-0 z-50 flex w-full flex-col items-center justify-between gap-4 border-b bg-zinc-50 p-4 shadow-md transition-transform duration-300 md:gap-0 dark:bg-zinc-950 ${
          !visible && scrollingDown ? "-translate-y-full transform" : " "
        }`}
        style={{ transform: !visible && !scrollingDown ? "translateY(0)" : "" }}
      >
        <div className="mr-2 flex w-full flex-col items-center sm:gap-2 md:flex-row md:items-center md:justify-between">
          <div className="mb-2 text-3xl font-semibold text-zinc-950 md:mb-0 dark:text-zinc-100">
            <Link href={"/"}>DailyCode</Link>
          </div>

          <p className="ml-2 hidden flex-1 items-center justify-center font-medium md:flex">
            {track.title} ({problemIndex + 1} / {track.problems.length})
          </p>
          <div className="flex items-center space-x-2">
            <CustomPagination allProblems={track.problems} isAtHeader track={track} problemIndex={problemIndex} />
            <ModeToggle />
            <Link href={`/pdf/${track.id}/${track.problems[problemIndex]!.id}`} target="_blank">
              <Button variant="outline" className="ml-2 hidden bg-black text-white md:flex">
                {/* Don't think this is required and its cluttering the AppBar at the top. Uncomment this if its required */}
                {/* Download */}
                <DownloadIcon />
              </Button>
              <Button variant="outline" className="block bg-black text-white md:hidden">
                <div>
                  <DownloadIcon />
                </div>
              </Button>
            </Link>
            {renderUIModeToggleButton()}
            <UserAccountDropDown />
          </div>
        </div>

        <p className="ml-2 flex w-full flex-1 items-center justify-center border-t bg-opacity-60 pt-2 text-center font-medium md:hidden">
          {track.title} ({problemIndex + 1} / {track.problems.length})
        </p>
      </div>
    ) : (
      <>
        <motion.div
          className={`z-[50] flex w-full flex-col justify-between gap-2 p-6 md:flex-row ${visible ? "translate-y-0" : "-translate-y-full"}`}
          initial={{ y: 0 }}
          animate={{ y: visible ? 0 : -100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            {/* menu */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary border-primary/10 flex cursor-pointer items-center gap-4 rounded-lg border bg-[#e5e5e5]/95 dark:bg-black/95 p-3 backdrop-blur-lg"
            >
              {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </div>
            {/* track title */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10 }}
              className="flex justify-between gap-2"
            >
              <div
                className={`border-primary/10 flex items-center gap-4 rounded-lg border bg-[#e5e5e5]/95 dark:bg-black/95 p-2 backdrop-blur-lg transition-all duration-500 ease-in-out`}
              >
                <Link href={"/"} className="hidden cursor-pointer items-center gap-4 md:flex">
                  <Image
                    src={"https://appx-wsb-gcp.akamai.net.in/subject/2023-01-17-0.17044360120951185.jpg"}
                    alt="Logo"
                    width={200}
                    height={200}
                    className="size-8 rounded-full"
                  />
                </Link>
                <Separator className="bg-primary/25 hidden h-6 w-0.5 md:flex" />

                <h4 className="flex items-center gap-2 font-medium tracking-tighter md:max-w-[50vw] md:text-lg">
                  {track.title}
                  <span className="text-primary/80 text-sm">
                    {problemIndex + 1} of {track.problems.length}
                  </span>
                </h4>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10 }}
            className="flex gap-2"
          >
            <div
              className={`border-primary/10 flex items-center gap-2 rounded-lg border bg-[#e5e5e5]/95 p-2 backdrop-blur-lg transition-all duration-500 ease-in-out dark:bg-black/95 ${
                isOpen ? `translate-y-0 opacity-100` : `-translate-y-32 opacity-0`
              }`}
            >
              {!user ? (
                <Button
                  size={"default"}
                  onClick={async () => {
                    await signIn();
                  }}
                  className="flex gap-2"
                >
                  <User className="size-4" />
                  <span className="hidden lg:block">Login</span>
                </Button>
              ) : (
                <UserAccountDropDown />
              )}
              <Link href={`/pdf/${track.id}/${track.problems[problemIndex]!.id}`} target="_blank">
                <Button className="flex gap-2" size={"default"}>
                  <span className="hidden lg:block">Download</span>
                  <Download className="size-4" />
                </Button>
              </Link>
              <ModeToggle />
              {renderUIModeToggleButton()}
            </div>
          </motion.div>
        </motion.div>
        {isOpen && renderTopics()}
      </>
    );

  useEffect(() => {
    window.addEventListener("scroll", isLegacyMode ? debouncedHandleScroll : handleScroll);
    return () => {
      window.removeEventListener("scroll", isLegacyMode ? debouncedHandleScroll : handleScroll);
    };
  }, [prevScrollPos, debouncedHandleScroll, lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const savedView = localStorage.getItem("viewMode");
    console.log({ savedView, check: savedView === "legacy" });
    setIsLegacyMode(savedView === "legacy");
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        router.push(
          problemIndex + 1 === track.problems.length
            ? ``
            : `/tracks/${track.id}/${track.problems[problemIndex + 1]?.id}`
        );
      } else if (event.key === "ArrowLeft") {
        router.push(problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]?.id}` : ``);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [problemIndex, router, track]);

  return renderBlogAppbar();
};
