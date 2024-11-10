"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../../packages/ui/src/shad/ui/button";
import { Dialog, DialogContent } from "../../../packages/ui/src/shad/ui/dailog";
import { ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type TrackPreviewProps = {
  showPreview: boolean;
  setShowPreview: (val: boolean) => void;
  track: any;
};

const truncateDescription = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + " ...";
  }
  return text;
};

export function TrackPreview({ showPreview, setShowPreview, track }: TrackPreviewProps) {
  const [isMediumOrLarger, setIsMediumOrLarger] = useState(false);

  const updateScreenSize = () => {
    setIsMediumOrLarger(window.innerWidth >= 768);
  };

  useEffect(() => {
    updateScreenSize(); // Set the initial state
    window.addEventListener("resize", updateScreenSize); // Add resize listener

    return () => {
      window.removeEventListener("resize", updateScreenSize); // Cleanup listener on unmount
    };
  }, []);

  const truncatedDescription = isMediumOrLarger ? track.description : truncateDescription(track.description, 15);

  return (
    <Dialog open={showPreview} onOpenChange={() => setShowPreview(false)}>
      <DialogContent className="flex items-center gap-4">
        <div className="flex flex-col gap-4 w-full">
          <img src={track.image} className="h-[25vh] w-full object-cover rounded-lg" />
          <div className="flex flex-col gap-4 bg-primary/5 rounded-lg p-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl md:text-2xl font-semibold w-full tracking-tight">{track.title}</h3>
              <div className="flex items-center gap-4">
                {track.categories.map((item: any, idx: number) => (
                  <p
                    key={item.category.id}
                    className="bg-secondary/25 border border-primary/10 rounded-lg px-3 py-2 text-sm w-fit cursor-default"
                  >
                    {item.category.category}{" "}
                  </p>
                ))}
              </div>
            </div>
            <p className="md:text-lg tracking-tighter line-clamp-3 text-primary/60">{truncatedDescription}</p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-2 items-center">
              <p className="flex tracking-tighter gap-2 text-primary text-lg md:text-xl font-semibold">
                {track.problems.length} Chapters
              </p>
              <p className="flex tracking-tight gap-2 text-primary/60 md:text-lg">
                {formatDistanceToNow(new Date(track.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="max-h-[25vh] overflow-y-auto flex flex-col gap-3 w-full py-2">
              {track.problems.map((topic: any, idx: number) => (
                <Link key={topic.id} href={`/tracks/${track.id}/${track.problems[idx]?.id}`}>
                  <div className="cursor-pointer hover:-translate-y-1 flex items-center justify-between bg-primary/5 rounded-lg px-4 py-3 hover:bg-primary/10 transition-all duration-300 scroll-smooth w-full">
                    {topic.title}
                    <ArrowRight className="size-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Link href={track.problems.length ? `/tracks/${track.id}/${track.problems[0]?.id}` : ""}>
            <Button
              size={"lg"}
              className="flex items-center justify-center bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 w-full mt-4"
              onClick={(e) => e.stopPropagation()}
            >
              Start
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
