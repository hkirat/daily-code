"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useRecoilValue } from "recoil";
import { useTheme } from "next-themes";

import { Button, Switch } from "@repo/ui";
import { isLegacyViewMode } from "@repo/store";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const isLegacyMode = useRecoilValue(isLegacyViewMode);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDarkMode =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const renderToggle = () =>
    isLegacyMode ? (
      <Button variant="outline" size="icon" onClick={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    ) : (
      <div className="flex items-center gap-2">
        <Sun className={`h-5 w-5 transition-all duration-300 ${isDarkMode ? "text-primary/50" : "text-blue-600"}`} />
        <Switch
          className="outline outline-1 outline-black"
          checked={isDarkMode}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
        <Moon className={`h-5 w-5 transition-all duration-300 ${isDarkMode ? "text-blue-600" : "text-primary/50"}`} />
      </div>
    );

  return renderToggle();
}
