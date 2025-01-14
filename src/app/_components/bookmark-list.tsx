"use client";

import dynamic from "next/dynamic";

interface BookmarkType {
  id: string;
  title: string;
  description?: string;
  url: string;
}

// Dynamically import the entire list component to avoid SSR issues
const DraggableBookmarkList = dynamic(
  () =>
    import("./draggable-bookmark-list").then(
      (mod) => mod.DraggableBookmarkList
    ),
  { ssr: false }
);

export function BookmarkList({
  bookmarks: initialBookmarks,
}: {
  bookmarks: BookmarkType[];
}) {
  return <DraggableBookmarkList bookmarks={initialBookmarks} />;
}
