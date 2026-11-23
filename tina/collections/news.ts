import type { Collection } from "tinacms";

export const NewsCollection: Collection = {
  name: "news",
  label: "News",
  path: "src/content/news",
  format: "mdx",
  ui: {
    router({ document }) {
      return `/news/${document.slug ?? document._sys.filename}`;
    },
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Title",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      name: "slug",
      label: "Slug",
      description: "Custom URL slug (optional). Defaults to the filename if not set.",
    },
    {
      name: "pubDate",
      label: "Date",
      type: "datetime",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "string",
      options: ["Announcement", "Publication", "Deployment", "Event", "Press", "Release"],
    },
    {
      name: "summary",
      label: "Summary",
      type: "string",
      description: "One or two sentences shown in the news list.",
      ui: { component: "textarea" },
    },
    {
      name: "link",
      label: "Related Link",
      type: "string",
      description: "Optional link to a paper, article, blog post, or event page.",
    },
    {
      name: "linkLabel",
      label: "Related Link Label",
      type: "string",
      description: "Button text for the related link. Defaults to \"Read more\".",
    },
    {
      name: "heroImage",
      label: "Image",
      type: "image",
    },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
      templates: [
        {
          name: "VideoEmbed",
          label: "Video Embed",
          fields: [
            { name: "url", label: "Video URL", type: "string", required: true },
            { name: "caption", label: "Caption", type: "string" },
          ],
        },
        {
          name: "Image",
          label: "Image",
          fields: [
            { name: "src", label: "Source", type: "image", required: true },
            { name: "alt", label: "Alt Text", type: "string" },
            { name: "caption", label: "Caption", type: "string" },
          ],
        },
      ],
    },
  ],
};
