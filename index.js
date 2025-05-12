// @ts-check

/*
 * Copyright (C) 2025  Koutaro Mukai
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { JSDOM } from "jsdom";
import rehype from "rehype";

const ENDNOTE_SELECTOR = "a.footnote-ref[href]";
const ENDNOTE_SELECTOR_ROLE = '[role="doc-noteref"]';

export const vfmEndnoteToFootnote =
  (
    /** @type {{ newTagName: string; newProps?: Record<string, string>; transform?: (footnote: Element, endnoteCall: Element, endnote: Element) => void; endnoteSelector?: string; ignoreRoles?: boolean; }} */ options,
  ) =>
  (
    /** @type {import("unist").Node} */ tree,
    /** @type {import("vfile").VFile} */ file,
  ) => {
    const ignoreRoles =
      typeof options.ignoreRoles === "boolean" ? options.ignoreRoles : false;
    const endnoteSelector =
      typeof options.endnoteSelector === "string"
        ? options.endnoteSelector
        : ENDNOTE_SELECTOR + (ignoreRoles ? "" : ENDNOTE_SELECTOR_ROLE);

    const jsdom = new JSDOM(rehype().stringify(tree));
    const document = jsdom.window.document;

    const endnoteCalls = document.querySelectorAll(endnoteSelector);
    for (const endnoteCall of endnoteCalls) {
      const endnoteId = endnoteCall.getAttribute("href");
      if (endnoteId === null) {
        throw new Error("endnoteId must not be null");
      }
      const endnote = document.querySelector(endnoteId);
      if (!endnote) {
        throw new Error(`endnoteElem:${endnoteId} not found`);
      }
      if (
        !ignoreRoles &&
        (!endnote.hasAttribute("role") ||
          endnote.getAttribute("role") !== "doc-endnote")
      ) {
        throw new Error('endnoteElem must have role="doc-endnote"');
      }

      const backLinks = endnote.querySelectorAll(
        `a${ignoreRoles ? "" : '[role="doc-backlink"]'}`,
      );
      for (const backLink of backLinks) {
        backLink.parentNode?.removeChild(backLink);
      }

      const footnote = document.createElement(options.newTagName);
      footnote.innerHTML = endnote.innerHTML;
      if (options.newProps) {
        for (const [key, value] of Object.entries(options.newProps)) {
          footnote.setAttribute(key, value);
        }
      }
      if (options.transform) {
        options.transform(footnote, endnoteCall, endnote);
      }

      endnoteCall.parentNode?.replaceChild(footnote, endnoteCall);
    }

    const footnoteSections = document.querySelectorAll(
      `section.footnotes${ignoreRoles ? "" : '[role="doc-endnotes"]'}`,
    );
    for (const section of footnoteSections) {
      section.parentNode?.removeChild(section);
    }

    return rehype().parse(jsdom.serialize());
  };
