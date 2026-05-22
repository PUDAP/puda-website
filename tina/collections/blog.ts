import type { Collection } from "tinacms";

export const BlogCollection: Collection = {

  name: "blog",
  label: "Blogs",
  path: "src/content/blog",
  format: "mdx",
  ui: {
    router({ document }) {
      return `/blog/${document.slug ?? document._sys.filename}`;
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
      name: "description",
      label: "Description",
      type: "string",
    },
    {
      name: "email",
      label: "Email",
      type: "string",
    },
    {
      name: "pubDate",
      label: "Publication Date",
      type: "datetime",
    },
    {
      name: "updatedDate",
      label: "Updated Date",
      type: "datetime",
    },
    {
      name: "heroImage",
      label: "Hero Image",
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
            {
              name: "url",
              label: "Video URL",
              type: "string",
              required: true,
            },
            {
              name: "caption",
              label: "Caption",
              type: "string",
            },
          ],
        },
        {
          name: "Image",
          label: "Image",
          fields: [
            {
              name: "src",
              label: "Source",
              type: "image",
              required: true,
            },
            {
              name: "alt",
              label: "Alt Text",
              type: "string",
            },
            {
              name: "caption",
              label: "Caption",
              type: "string",
            },
          ],
        },
      ],
    },
  ],
}
