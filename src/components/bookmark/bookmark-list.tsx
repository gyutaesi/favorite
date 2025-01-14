"use client";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { BookmarkCard } from "./bookmark-card";
import { Bookmark } from "@/types";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  groupId: string;
}

export function BookmarkList({ bookmarks, groupId }: BookmarkListProps) {
  return (
    <SortableContext items={bookmarks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
      <div className="flex flex-col gap-4">
        {bookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} groupId={groupId} />
        ))}
      </div>
    </SortableContext>
  );
}
