// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  // Get this from tina.io (free for open source)
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: {
    outputFolder: "admin",
    publicFolder: "static"
  },
  media: {
    tina: {
      mediaRoot: "img/uploads",
      publicFolder: "static"
    }
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "devices",
        label: "Device Guides",
        path: "docs/devices",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "sidebar_label",
            label: "Sidebar Label"
          },
          {
            type: "number",
            name: "sidebar_position",
            label: "Sidebar Position"
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            templates: [
              {
                name: "InfoBox",
                label: "Info Box",
                fields: [
                  {
                    name: "type",
                    label: "Type",
                    type: "string",
                    options: ["info", "warning", "tip", "danger"]
                  },
                  {
                    name: "title",
                    label: "Title",
                    type: "string"
                  },
                  {
                    name: "children",
                    label: "Content",
                    type: "rich-text"
                  }
                ]
              },
              {
                name: "CodeBlock",
                label: "Code Block",
                fields: [
                  {
                    name: "language",
                    label: "Language",
                    type: "string",
                    options: [
                      "javascript",
                      "typescript",
                      "python",
                      "bash",
                      "json",
                      "yaml",
                      "markdown",
                      "html",
                      "css"
                    ]
                  },
                  {
                    name: "code",
                    label: "Code",
                    type: "string",
                    ui: {
                      component: "textarea"
                    }
                  }
                ]
              },
              {
                name: "YouTube",
                label: "YouTube Video",
                fields: [
                  {
                    name: "videoId",
                    label: "Video ID",
                    type: "string"
                  }
                ]
              }
            ]
          }
        ],
        ui: {
          router: ({ document }) => {
            return `/docs/devices/${document._sys.filename}`;
          }
        }
      },
      {
        name: "features",
        label: "Features",
        path: "docs/features",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "sidebar_label",
            label: "Sidebar Label"
          },
          {
            type: "number",
            name: "sidebar_position",
            label: "Sidebar Position"
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ],
        ui: {
          router: ({ document }) => {
            return `/docs/features/${document._sys.filename}`;
          }
        }
      },
      {
        name: "platform",
        label: "Platform Documentation",
        path: "docs/platform",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "sidebar_label",
            label: "Sidebar Label"
          },
          {
            type: "number",
            name: "sidebar_position",
            label: "Sidebar Position"
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ],
        ui: {
          router: ({ document }) => {
            return `/docs/platform/${document._sys.filename}`;
          }
        }
      },
      {
        name: "internal",
        label: "Internal Documentation",
        path: "internal_docs",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "sidebar_label",
            label: "Sidebar Label"
          },
          {
            type: "number",
            name: "sidebar_position",
            label: "Sidebar Position"
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ],
        ui: {
          router: ({ document }) => {
            return `/internal/${document._sys.filename}`;
          }
        }
      }
    ]
  }
});
export {
  config_default as default
};
