"use client";

import { deleteBookmark } from "@/app/actions";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useState, useEffect } from "react";
import {
  EditBookmarkDialog,
  EditBookmarkTrigger,
} from "./edit-bookmark-dialog";
import { Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function Bookmark({
  bookmark,
}: {
  bookmark: {
    id: string;
    title: string;
    description?: string;
    url: string;
  };
}) {
  const [favicon, setFavicon] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bookmark.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  useEffect(() => {
    // 1. 먼저 Google Favicon 서비스 사용
    const googleFavicon = `https://www.google.com/s2/favicons?domain=${bookmark.url}`;
    setFavicon(googleFavicon);

    // 2. 백그라운드에서 실제 favicon 가져오기 시도
    fetch(`/api/favicon?url=${encodeURIComponent(bookmark.url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.favicon) {
          setFavicon(data.favicon);
        }
      })
      .catch(() => {
        // Google Favicon 유지
      });
  }, [bookmark.url]);

  if (!bookmark.id) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="flex flex-col gap-1 justify-between p-4 border border-stone-400 rounded-lg">
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
                  onClick={handleClick}
                  className="flex-1"
                >
                  <p className="font-bold truncate">{bookmark.title}</p>
                  <p className="text-sm text-gray-600 truncate">{bookmark.url}</p>
                </a>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <EditBookmarkTrigger onClick={() => setEditDialogOpen(true)} />
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
      <EditBookmarkDialog
        bookmark={bookmark}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
