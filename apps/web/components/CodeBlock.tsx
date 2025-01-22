import React, { useEffect } from "react";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

import { useToast } from "@repo/ui";

import "highlight.js/styles/github-dark.css";
import { Copy } from "lucide-react";

export default function CodeBlock({ block }: { block: any }) {
  const { toast } = useToast();

  const code: string = block.properties.title[0].toString();
  hljs.registerLanguage("javascript", javascript);

  useEffect(() => {
    hljs.highlightAll();
  }, []);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        description: "Copied to clipboard",
      });
    });
  };

  return (
    <div className="w-full relative">
      <div className="absolute rounded-s-md w-1 inset-y-0 bg-gradient-to-b from-blue-400 to-blue-700" />
      <pre className="rounded-md text-sm sm:text-base !bg-[#151515] px-4 sm:px-6 md:px-8 whitespace-pre-wrap break-word flex justify-between">
        <code className="language-javascript">{code}</code>
      </pre>
      <button className="p-2 absolute top-2 right-2 hover:opacity-80" onClick={handleCopyClick}>
        <Copy className="size-5 text-gray-500" />
      </button>
    </div>
  );
}
