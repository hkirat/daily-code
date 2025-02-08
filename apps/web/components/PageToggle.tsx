import { useParams } from "next/navigation";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { ArrowUpRight } from "lucide-react";

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui";
import { Track, Problem } from "@prisma/client";
import { isLegacyViewMode } from "@repo/store";
import { cn } from "@repo/ui/utils";

export function PageToggle({
  allProblems,
  isAtHeader = false,
  track,
}: {
  allProblems: Problem[];
  isAtHeader?: boolean;
  track: Track & { problems: Problem[] };
}) {
  const { trackIds }: { trackIds?: string[] } = useParams();
  const currentTrack = trackIds ? trackIds.join("/") : "";

  const isLegacyMode = useRecoilValue(isLegacyViewMode);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`flex gap-2 font-semibold ${isLegacyMode ? "" : "dark:bg-[#323232]"}`}
          variant={isLegacyMode ? "outline" : "secondary"}
        >
          <span className={`hidden ${isAtHeader ? "lg" : "sm"}:block`}>Jump To</span>
          <ArrowUpRight className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn("max-h-[80vh] overflow-y-auto dark:bg-[#151515]")}>
        {allProblems.map((problem: { id: string; title: string }, index: number) => (
          <DropdownMenuItem key={index} disabled={currentTrack === `${track.id}/${problem.id}`}>
            <Link
              key={problem.id}
              prefetch={true}
              className="w-full max-w-screen-md"
              href={`/tracks/${track.id}/${problem.id}`}
            >
              {index + 1} - {problem.title}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
