"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, GripVertical, EditIcon } from "lucide-react";
import { Group } from "@/types";
import { deleteGroup } from "@/lib/actions";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { BookmarkList } from "../bookmark/bookmark-list";
import dynamic from "next/dynamic";

const BookmarkFormDialog = dynamic(
  () =>
    import("../bookmark/bookmark-form-dialog").then(
      (mod) => mod.BookmarkFormDialog
    ),
  {
    ssr: false,
  }
);

const GroupFormDialog = dynamic(
  () => import("./group-form-dialog").then((mod) => mod.GroupFormDialog),
  {
    ssr: false,
  }
);

interface GroupCardProps {
  group: Group;
  isDragging?: boolean;
}

export function GroupCard({ group, isDragging = false }: GroupCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: `group-${group.id}`,
    data: {
      type: "group",
      groupId: group.id,
    },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `group-${group.id}`,
    data: {
      type: "group",
      groupId: group.id,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    try {
      await deleteGroup(group.id);
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  const setRefs = (element: HTMLElement | null) => {
    setSortableRef(element);
    setDroppableRef(element);
  };

  return (
    <>
      <div ref={setRefs} style={style}>
        <Card
          className={`transition-colors ${
            isOver ? "ring-2 ring-blue-500 bg-blue-50" : ""
          }`}
        >
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>
                  <p>{group.title}</p>
                </div>
                <div className="flex gap-1">
                  <BookmarkFormDialog groupId={group.id} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-primary"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col p-4 gap-4">
            <BookmarkList
              bookmarks={group.bookmarks || []}
              groupId={group.id}
            />
          </CardContent>
        </Card>
      </div>
      <GroupFormDialog
        group={group}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
