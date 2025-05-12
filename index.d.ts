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

// Handwritten type definition of index.js

export const vfmEndnoteToFootnote: import("unified").Plugin<
  [
    {
      newTagName: string;
      newProps?: Record<string, string>;
      transform?: (
        footnote: Element,
        endnoteCall: Element,
        endnote: Element,
      ) => void;
      endnoteSelector?: string;
      ignoreRoles?: boolean;
    },
  ],
  import("unified").Settings
>;
