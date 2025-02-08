"use client";
import { useMemo } from "react";
import { NotionRenderer as NotionRendererLib } from "react-notion-x";
import { useTheme } from "next-themes";
import { useRecoilValue } from "recoil";

import { isLegacyViewMode } from "@repo/store";

import CodeBlock from "./CodeBlock";

// Week-4-1-647987d9b1894c54ba5c822978377910
export const NotionRenderer = ({ recordMap, isPDF = false }: { recordMap: any; isPDF?: boolean }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const isLegacyMode = useRecoilValue(isLegacyViewMode);

  const components = useMemo(
    () => ({
      Code: CodeBlock,
      // can add more components that are supported here
    }),
    []
  );

  return (
    <NotionRendererLib
      bodyClassName={`text-base sm:text-lg ${isPDF && "!pb-0"}`}
      className={isLegacyMode ? "" : `${isPDF ? "pt-0" : "pt-12"} break-before-page dark:!bg-[#0a0a0a]`}
      components={components}
      darkMode={isDarkMode}
      disableHeader
      fullPage
      recordMap={recordMap}
    />
  );
};
