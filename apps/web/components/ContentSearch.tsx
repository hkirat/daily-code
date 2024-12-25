"use client";
import { useEffect, useRef, useState, useDeferredValue } from "react";
import Link from "next/link";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Dialog, DialogClose, DialogContent, Input, Card, CardDescription, CardHeader, CardTitle } from "@repo/ui";
/* import { getSearchResults } from "../lib/search";
import Image from "next/image"; */
import Fuse from "fuse.js";
import { TrackPros } from "./Tracks";

type Payload = {
  problemId: string;
  trackTitle: string;
  problemTitle: string;
  trackId: string;
  image: string;
};

interface DataItem {
  payload: Payload;
}

export function ContentSearch({ tracks }: { tracks: TrackPros[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [input, setInput] = useState("");
  const [searchTracks, setSearchTracks] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const deferredInput = useDeferredValue(input);
  const [allTracks, setAllTracks] = useState<DataItem[]>([]);
  useEffect(() => {
    const updatedTracks: DataItem[] = [];
    tracks.map((t) => {
      t.problems.map((p) => {
        updatedTracks.push({
          payload: {
            problemId: p.id,
            trackTitle: t.title,
            problemTitle: p.title,
            trackId: t.id,
            image: t.image,
          },
        });
      });
    });
    setAllTracks(updatedTracks);
  }, []);
  useEffect(() => {
    const fuse = new Fuse(allTracks, {
      keys: ["payload.problemTitle"],
    });

    async function fetchSearchResults() {
      if (deferredInput.length > 0) {
        /* const data = await getSearchResults(deferredInput); */
        const data = fuse.search(deferredInput);
        const items = data.map((result) => result.item);
        setSearchTracks(items);
      } else {
        setSearchTracks([]);
      }
    }
    fetchSearchResults();
  }, [deferredInput]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyK":
          if (event.ctrlKey) {
            event.preventDefault();
            setDialogOpen(true);
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prevIndex) => (prevIndex + 1) % searchTracks.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prevIndex) => (prevIndex - 1 + searchTracks.length) % searchTracks.length);
          break;
        case "Enter":
          if (selectedIndex !== -1) {
            event.preventDefault();
            const selectedTrack = searchTracks[selectedIndex];
            window.open(`/tracks/${selectedTrack?.payload.trackId}/${selectedTrack?.payload.problemId}`, "_blank");
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [searchTracks, selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== -1 && scrollableContainerRef.current) {
      const selectedElement = scrollableContainerRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleClose = (open: boolean) => {
    if (!open) {
      setDialogOpen(false);
      setInput("");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleClose}>
      <div
        className="md:max-w-screen border border-primary/15 p-3 rounded-lg cursor-text w-full mx-auto"
        onClick={() => setDialogOpen(true)}
      >
        <div className="md:flex gap-2 items-center hidden justify-between ">
          <div className="flex gap-2 items-center">
            <MagnifyingGlassIcon className="size-4" />
            Search
          </div>
          <kbd className="bg-white/15 p-2 rounded-sm text-sm leading-3">Ctrl + K</kbd>
        </div>
        <div className="block md:hidden">
          <MagnifyingGlassIcon className="size-4" />
        </div>
      </div>
      <DialogContent className="p-0 gap-0 max-w-2xl">
        <div className="flex items-center px-6 py-4 border-b">
          <MagnifyingGlassIcon className="size-4" />
          <Input
            type="text"
            placeholder="Search"
            className="border-none focus-visible:outline-none focus-visible:ring-0 text-base shadow-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <DialogClose>
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <div className="h-[500px] py-4 space-y-4 overflow-y-scroll" ref={scrollableContainerRef}>
        {input.length === 0 ? (
          <div className="text-center pt-6">Search tracks</div>
          ) : searchTracks.length === 0 ? (
          <div className="text-center pt-6">No Result found</div>
        ) : null}
          {searchTracks.length > 0 &&
            searchTracks.map((track, index) => (
              <div key={track.payload.problemId} className={`p-2 ${index === selectedIndex ? "bg-blue-600/20" : ""}`}>
                <Link
                  className="flex"
                  href={`/tracks/${track.payload.trackId}/${track.payload.problemId}`}
                  target="_blank"
                  passHref
                >
                  <Card className="p-2 w-full mx-2">
                    <div className="flex items-center gap-4 py-1 sm:py-2">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-xl">
                        <img
                          alt={track.payload.problemTitle}
                          src={track.payload.image}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardHeader className="p-0">
                          <CardTitle className="text-base sm:text-lg md:text-xl">{track.payload.problemTitle}</CardTitle>
                          <CardDescription className="text-sm truncate">Track: {track.payload.trackTitle}</CardDescription>
                        </CardHeader>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
