"use client";
import { TrackCard2 } from "./TrackCard-2";
import { category } from "@repo/store";
import { useEffect, useState } from "react";
import { Track, Problem } from "@prisma/client";
import { useRecoilState } from "recoil";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Button,
  Skeleton,
  Separator,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui";
import { motion } from "framer-motion";

export interface TrackPros extends Track {
  problems: Problem[];
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

interface TracksWithCategoriesProps {
  tracks: TrackPros[];
  categories: { id: string; category: string }[];
}

enum CohortGroup {
  One = 1,
  Two = 2,
  Three = 3,
}

export const Tracks = ({ tracks, categories }: TracksWithCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useRecoilState(category);
  const [filteredTracks, setFilteredTracks] = useState<TrackPros[]>(tracks);
  const [visibleTracks, setVisibleTracks] = useState<TrackPros[]>([]);
  const [sortBy, setSortBy] = useState<string>("new");
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCohort, setSelectedCohort] = useState<number | null>(null);

  const tracksPerPage = 10;
  const isCohort2Selected = selectedCohort === CohortGroup.Two;
  const isCohort3Selected = selectedCohort === CohortGroup.Three;

  const filterTracks = () => {
    setLoading(true);
    setFilteredTracks(tracks.filter((t) => selectedCohort === 3 ? t.cohort === 3 : t.cohort !== 3));
    setCurrentPage(1); // Reset to first page on filtering
    setLoading(false);
  };

  const sortTracks = (sortBy: string) => {
    setLoading(true);
    let sortedTracks = [...filteredTracks];
    if (sortBy === "ascending") {
      sortedTracks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "descending") {
      sortedTracks.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "new") {
      sortedTracks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "old") {
      sortedTracks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    setFilteredTracks(sortedTracks);
    setLoading(false);
  };

  const handleCohortSelection = (cohort: number) => {
    setSelectedCohort((prevCohort) => (prevCohort === cohort ? null : cohort));
  };

  useEffect(() => {
    filterTracks();
  }, [selectedCategory, selectedCohort, tracks]);

  useEffect(() => {
    sortTracks(sortBy);
  }, [sortBy]);

  useEffect(() => {
    setLoading(true);
    const start = (currentPage - 1) * tracksPerPage;
    const end = start + tracksPerPage;
    setVisibleTracks(filteredTracks.slice(start, end));
    setLoading(false);
  }, [currentPage, filteredTracks]);

  const totalPages = Math.ceil(filteredTracks.length / tracksPerPage);

  const trackAnimation = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10, delay: 0.5 }}
      className="flex max-w-5xl flex-col gap-4 w-full mx-auto p-4"
      id="tracks"
    >
      <div className="flex w-full gap-4 justify-between items-center flex-col md:flex-row">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 mx-auto md:mx-0 justify-center">
          <Button
            size={"lg"}
            variant={"ghost"}
            onClick={() => handleCohortSelection(2)}
            className={isCohort2Selected ? "bg-blue-600 text-white hover:bg-blue-600" : ""}
          >
            Cohort 2.0
          </Button>
          <Separator className="w-0.5 h-4 bg-primary/25" />
          <Button
            size={"lg"}
            variant={"ghost"}
            onClick={() => handleCohortSelection(3)}
            className={isCohort3Selected ? "bg-blue-600 text-white hover:bg-blue-600" : ""}
          >
            Cohort 3.0
          </Button>
        </div>
        <div className="flex gap-2 p-2.5 bg-primary/5 rounded-lg w-full md:w-fit">
          {/* Filter by Categories */}
          <div className="flex gap-2 items-center ">
            <Select onValueChange={(e) => setSelectedCategory(e === "All" ? "" : e)}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder={selectedCategory || "All"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {categories.map((category) => (
                  <SelectItem value={category.category} key={category.id}>
                    {category.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <Select onValueChange={(e) => setSortBy(e)}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ascending">A to Z</SelectItem>
                <SelectItem value="descending">Z to A</SelectItem>
                <SelectItem value="new">Newest first</SelectItem>
                <SelectItem value="old">Oldest first</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tracks with Animation */}
      <motion.ul className="flex flex-col gap-4 w-full" variants={trackAnimation} initial="hidden" animate="show">
        {loading ? (
          Array.from({ length: tracksPerPage }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-4 w-full h-24 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-xl"
            >
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))
        ) : visibleTracks.length === 0 ? (
          <p className="text-center font-medium tracking-tighter text-lg max-w-screen-sm px-4 mx-auto">
            ☹️ Sorry - currently there are no tracks available.
          </p>
        ) : (
          filteredTracks.map((t) => (
            <motion.li key={t.id} className="w-full" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
              <TrackCard2 track={t} />
            </motion.li>
          ))
        )}
      </motion.ul>

      {/* Skeleton */}
      {filteredTracks.length < tracksPerPage && (
        <div className="flex items-center space-x-4 w-full h-24 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-xl">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}
      {/* Pagination Controls */}
      <div className="flex justify-end items-end mt-4 w-full">
        <Pagination>
          <PaginationContent>
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) =>
              index < 6 ? (
                <PaginationItem key={index} className="cursor-pointer">
                  <PaginationLink onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ) : null
            )}
            {totalPages > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}


            <PaginationItem
            className="cursor-pointer"
            >
              <PaginationNext
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </motion.div>
  );
};
