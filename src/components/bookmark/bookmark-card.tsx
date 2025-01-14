"use client";

import { deleteBookmark } from "@/lib/actions";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useState, useEffect } from "react";
import { BookmarkFormDialog } from "./bookmark-form-dialog";
import { Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bookmark } from "@/types";

interface BookmarkCardProps {
  bookmark: Bookmark;
  groupId: string;
  isDragging?: boolean;
}

export function BookmarkCard({
  bookmark,
  groupId,
  isDragging = false,
}: BookmarkCardProps) {
  const [favicon, setFavicon] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: bookmark.id,
    data: {
      type: "bookmark",
      bookmark,
      groupId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
    cursor: isSortableDragging ? "grabbing" : "grab",
  };

  useEffect(() => {
    const googleFavicon = `https://www.google.com/s2/favicons?domain=${bookmark.url}`;
    setFavicon(googleFavicon);

    fetch(`/api/favicon?url=${encodeURIComponent(bookmark.url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.favicon) {
          setFavicon(data.favicon);
        }
      })
      .catch(() => {
        // Keep Google Favicon
      });
  }, [bookmark.url]);

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="flex flex-col gap-1 justify-between p-4 border border-stone-400 rounded-lg bg-white">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    favicon ||
                    `https://www.google.com/s2/favicons?domain=${bookmark.url}`
                  }
                  alt="favicon"
                  width={16}
                  height={16}
                  className="w-4 h-4 flex-shrink-0"
                  onError={() =>
                    setFavicon(
                      `https://www.google.com/s2/favicons?domain=${bookmark.url}`
                    )
                  }
                />
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => isSortableDragging && e.preventDefault()}
                  className="flex-1"
                >
                  <p className="font-bold truncate">{bookmark.title}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {bookmark.url}
                  </p>
                </a>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => setEditDialogOpen(true)}>
              Edit
            </ContextMenuItem>
            <ContextMenuItem
              className="text-destructive"
              onClick={() => deleteBookmark(bookmark.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
      <BookmarkFormDialog
        bookmark={bookmark}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
