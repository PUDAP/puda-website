import { useEffect, useState } from "react";
import "./code-block.css";
import { FaCheck } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { CodeBlockSkeleton } from "./code-block-skeleton";
import { shikiSingleton } from "./shiki-singleton";

function useIsDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setIsDarkMode(root.getAttribute("data-theme") !== "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}

function escapeHtml(source: string) {
  return source
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function CodeBlock({
  value,
  lang = "ts",
  showCopyButton = true,
  showBorder = true,
  setIsTransitioning,
}: {
  value: string;
  lang?: string;
  showCopyButton?: boolean;
  showBorder?: boolean;
  setIsTransitioning?: (isTransitioning: boolean) => void;
}) {
  const [html, setHtml] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isDarkMode = useIsDarkMode();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);

      if (!value || typeof value !== "string") {
        if (isMounted) {
          setHtml("");
          setIsLoading(false);
        }
        return;
      }

      try {
        const code = await shikiSingleton.codeToHtml(value, lang, isDarkMode);

        if (isMounted) {
          setHtml(code);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setHtml(`<pre class="shiki"><code>${escapeHtml(value)}</code></pre>`);
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [value, lang, isDarkMode]);

  useEffect(() => {
    if (setIsTransitioning && html !== "") {
      setTimeout(() => setIsTransitioning(false), 200);
    }
  }, [html, setIsTransitioning]);

  if (isLoading && showCopyButton) {
    return <CodeBlockSkeleton />;
  }

  return (
    <div className="relative w-full my-2">
      <div className="absolute top-0 left-0 z-10 px-4 py-1 text-xs font-mono text-neutral-text-secondary">
        {lang}
      </div>
      <div
        className={`absolute top-0 right-0 z-10 mx-2 my-1 text-xs font-mono cursor-pointer ${
          showCopyButton ? "" : "hidden"
        }`}
      >
        <button
          type="button"
          aria-label={isCopied ? "Copied" : "Copy code"}
          onClick={() => {
            navigator.clipboard.writeText(value);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000);
          }}
          className="px-2 py-1 text-neutral-text-secondary rounded transition cursor-pointer flex items-center gap-1"
        >
          {isCopied ? <FaCheck size={12} /> : <MdOutlineContentCopy />}
        </button>
      </div>
      <div
        className={`shiki w-full overflow-x-auto py-5 px-2 text-sm ${
          showBorder ? "border border-neutral-border-subtle/50 shadow-sm" : ""
        } ${showCopyButton ? "rounded-lg" : "rounded-b-xl"}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
