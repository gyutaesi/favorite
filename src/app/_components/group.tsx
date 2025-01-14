"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Group as GroupType } from "@/types";
import { deleteGroup } from "../actions";
import { AddBookmarkDialog } from "./add-bookmark-dialog";
import { EditGroupDialog, EditGroupButton } from "./edit-group-dialog";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BookmarkList } from "./bookmark-list";

export function Group({ group }: { group: GroupType }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const handleDelete = async () => {
    try {
      await deleteGroup(group.id);
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card id={group.id}>
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between gap-2">
                <p>{group.title}</p>
                <div className="flex gap-1">
                  <AddBookmarkDialog groupId={group.id} />
                  <EditGroupButton onClick={() => setEditDialogOpen(true)} />
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
            <BookmarkList bookmarks={group.bookmarks || []} />
          </CardContent>
        </Card>
      </div>
      <EditGroupDialog
        group={group}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
