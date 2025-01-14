"use client";

import {
  DndContext as DndKitContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { useState } from "react";
import { moveBookmark, reorderBookmark, reorderGroup } from "@/lib/actions";
import { Bookmark, Group } from "@/types";
import { arrayMove } from "@dnd-kit/sortable";
import { BookmarkCard } from "../bookmark/bookmark-card";
import { GroupCard } from "../group/group-card";

interface DraggingItem {
  type: "bookmark" | "group";
  data: Bookmark | Group;
}

interface Props {
  children: React.ReactNode;
  groups: Group[];
  onGroupsChange: (groups: Group[]) => void;
}

export function DndContext({ children, groups, onGroupsChange }: Props) {
  const [activeItem, setActiveItem] = useState<DraggingItem | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current as {
      bookmark?: Bookmark;
      type?: string;
      groupId?: string;
    };

    if (activeData?.bookmark) {
      setActiveItem({ type: "bookmark", data: activeData.bookmark });
    } else if (active.id.toString().startsWith("group-")) {
      const groupId = active.id.toString().replace("group-", "");
      const group = groups.find((g) => g.id === groupId);
      if (group) {
        setActiveItem({ type: "group", data: group });
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const activeData = active.data.current as {
      type?: string;
      bookmark?: Bookmark;
      groupId?: string;
    };
    const overData = over.data.current as {
      type?: string;
      groupId?: string;
      bookmark?: Bookmark;
    };

    // Handle group reordering
    if (activeId.startsWith("group-") && overId.startsWith("group-")) {
      const oldIndex = groups.findIndex((g) => `group-${g.id}` === activeId);
      const newIndex = groups.findIndex((g) => `group-${g.id}` === overId);

      if (oldIndex !== newIndex) {
        const newGroups = arrayMove(groups, oldIndex, newIndex);
        onGroupsChange(newGroups);
        await reorderGroup(activeId.replace("group-", ""), newIndex);
      }
      return;
    }

    // Handle bookmark reordering within the same group
    if (
      activeData?.bookmark &&
      overData?.bookmark &&
      activeData.groupId === overData.groupId
    ) {
      const group = groups.find((g) => g.id === activeData.groupId);
      if (!group) return;

      const oldIndex = group.bookmarks.findIndex(
        (b) => b.id === activeData.bookmark!.id
      );
      const newIndex = group.bookmarks.findIndex(
        (b) => b.id === overData.bookmark!.id
      );

      if (oldIndex !== newIndex) {
        const newGroups = groups.map((g) => {
          if (g.id === group.id) {
            return {
              ...g,
              bookmarks: arrayMove(g.bookmarks, oldIndex, newIndex),
            };
          }
          return g;
        });

        onGroupsChange(newGroups);
        await reorderBookmark(activeData.bookmark.id, newIndex);
      }
      return;
    }

    // Handle moving bookmark to another group
    if (
      activeData?.bookmark &&
      overData?.type === "group" &&
      overData.groupId &&
      activeData.groupId !== overData.groupId
    ) {
      const sourceGroupId = activeData.groupId;
      const targetGroupId = overData.groupId;
      const bookmark = activeData.bookmark;

      // Optimistically update the UI
      const newGroups = groups.map((group) => {
        if (group.id === sourceGroupId) {
          return {
            ...group,
            bookmarks: (group.bookmarks || []).filter(
              (b) => b.id !== bookmark.id
            ),
          };
        }
        if (group.id === targetGroupId) {
          return {
            ...group,
            bookmarks: [...(group.bookmarks || []), bookmark],
          };
        }
        return group;
      });

      onGroupsChange(newGroups);

      try {
        await moveBookmark(bookmark.id, targetGroupId);
      } catch (error) {
        console.error("Failed to move bookmark:", error);
        // Revert on error
        onGroupsChange(groups);
      }
    }
  };

  return (
    <DndKitContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeItem?.type === "bookmark" && (
          <BookmarkCard
            bookmark={activeItem.data as Bookmark}
            groupId=""
            isDragging
          />
        )}
        {activeItem?.type === "group" && (
          <GroupCard group={activeItem.data as Group} isDragging />
        )}
      </DragOverlay>
    </DndKitContext>
  );
}
