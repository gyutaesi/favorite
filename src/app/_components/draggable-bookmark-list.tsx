"use client";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { Bookmark } from "./bookmark";
import { reorderBookmark } from "../actions";

interface BookmarkType {
  id: string;
  title: string;
  description?: string;
  url: string;
}

export function DraggableBookmarkList({ bookmarks: initialBookmarks }: { bookmarks: BookmarkType[] }) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = bookmarks.findIndex((bookmark) => bookmark.id === active.id);
      const newIndex = bookmarks.findIndex((bookmark) => bookmark.id === over.id);

      const newBookmarks = arrayMove(bookmarks, oldIndex, newIndex);
      setBookmarks(newBookmarks);

      // Update the order in the database
      await reorderBookmark(active.id as string, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={bookmarks} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-4">
          {bookmarks.map((bookmark) => (
            <Bookmark key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
