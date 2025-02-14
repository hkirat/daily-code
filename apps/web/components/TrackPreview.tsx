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
        <div className="flex w-full flex-col gap-4">
          <img src={track.image} className="h-[25vh] w-full rounded-lg object-contain" />
          <div className="bg-primary/5 flex flex-col gap-4 rounded-lg p-4">
            <div className="flex flex-col gap-4">
              <h3 className="w-full text-xl font-semibold tracking-tight md:text-2xl">{track.title}</h3>
              <div className="flex items-center gap-4">
                {track.categories.map((item: any, idx: number) => (
                  <p
                    key={item.category.id}
                    className="bg-secondary/25 border-primary/10 w-fit cursor-default rounded-lg border px-3 py-2 text-sm"
                  >
                    {item.category.category}{" "}
                  </p>
                ))}
              </div>
            </div>
            <p className="text-primary/60 line-clamp-3 tracking-tighter md:text-lg">{truncatedDescription}</p>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-2">
              <p className="text-primary flex gap-2 text-lg font-semibold tracking-tighter md:text-xl">
                {track.problems.length} Chapters
              </p>
              <p className="text-primary/60 flex gap-2 tracking-tight md:text-lg">
                {formatDistanceToNow(new Date(track.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex max-h-[25vh] w-full flex-col gap-3 overflow-y-auto py-2">
              {track.problems.map((topic: any, idx: number) => (
                <Link key={topic.id} href={`/tracks/${track.id}/${track.problems[idx]?.id}`}>
                  <div className="bg-primary/5 hover:bg-primary/10 flex w-full cursor-pointer items-center justify-between scroll-smooth rounded-lg px-4 py-3 transition-all duration-300 hover:-translate-y-1">
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
              className="flex items-center justify-center bg-blue-600 text-white transition-all duration-300 hover:bg-blue-500"
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
