// @ts-check

import { vfmEndnoteToFootnote } from "@u1f992/vfm-endnote-to-footnote";

import { VFM } from "@vivliostyle/vfm";

/** @type {import('@vivliostyle/cli').VivliostyleConfigSchema} */
const vivliostyleConfig = {
  title: "example",
  author: "u1f992",
  language: "ja",
  theme: "./css",
  image: "ghcr.io/vivliostyle/cli:9.1.0",
  entry: ["manuscript.md"],

  documentProcessor: (opts, meta) =>
    ((p = VFM(opts, meta)) =>
      !!process.env.FOOTNOTE
        ? p.use(vfmEndnoteToFootnote, {
            newTagName: "span",
            newProps: { class: "footnote" },
            transform: (footnote, endnoteCall, endnote) => {
              if (endnote.hasAttribute("id")) {
                footnote.setAttribute("id", endnote.getAttribute("id") || "");
              }
            },
          })
        : p)(),
};

export default vivliostyleConfig;
