import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { type Highlighter, createHighlighter } from "shiki";

class ShikiSingleton {
  private highlighter: Highlighter | null = null;
  private supportedLangs = new Set<string>();
  private readonly themes = ["night-owl", "github-light"];
  private initPromise: Promise<void> | null = null;

  private async initializeHighlighter(initialLang: string): Promise<void> {
    if (this.highlighter) return;

    this.highlighter = await createHighlighter({
      themes: this.themes,
      langs: [initialLang],
    });
    this.supportedLangs.add(initialLang);
  }

  private async ensureLanguageLoaded(lang: string): Promise<void> {
    if (!this.highlighter) {
      throw new Error("Highlighter not initialized");
    }

    if (!this.supportedLangs.has(lang)) {
      try {
        await this.highlighter.loadLanguage(lang as any);
        this.supportedLangs.add(lang);
      } catch {
        if (!this.supportedLangs.has("text")) {
          await this.highlighter.loadLanguage("text" as any);
          this.supportedLangs.add("text");
        }
      }
    }
  }

  async getHighlighter(lang: string): Promise<Highlighter> {
    if (!this.highlighter) {
      if (!this.initPromise) {
        this.initPromise = this.initializeHighlighter(lang);
      }
      await this.initPromise;
    }

    await this.ensureLanguageLoaded(lang);

    if (!this.highlighter) {
      throw new Error("Failed to initialize highlighter");
    }

    return this.highlighter;
  }

  async codeToHtml(
    code: string,
    lang: string,
    isDarkMode: boolean
  ): Promise<string> {
    const highlighter = await this.getHighlighter(lang);

    return highlighter.codeToHtml(code, {
      lang: this.supportedLangs.has(lang) ? lang : "text",
      theme: isDarkMode ? "night-owl" : "github-light",
      transformers: [
        transformerNotationDiff({ matchAlgorithm: "v3" }),
        transformerNotationHighlight({ matchAlgorithm: "v3" }),
        transformerNotationFocus({ matchAlgorithm: "v3" }),
      ],
      meta: {
        showLineNumbers: true,
      },
    });
  }

  dispose(): void {
    if (this.highlighter) {
      this.highlighter.dispose();
      this.highlighter = null;
      this.supportedLangs.clear();
      this.initPromise = null;
    }
  }

  getLoadedLanguages(): string[] {
    return Array.from(this.supportedLangs);
  }
}

export const shikiSingleton = new ShikiSingleton();
