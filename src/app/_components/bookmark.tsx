'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useState, useEffect } from "react";

export function Bookmark({
  bookmark,
}: {
  bookmark: {
    id: string;
    title: string;
    url: string;
  };
}) {
  const [favicon, setFavicon] = useState<string | null>(null);

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

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <a
          id={bookmark.id}
          target="_blank"
          href={bookmark.url}
          rel="noreferrer"
        >
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
              <p className="font-bold truncate">{bookmark.title}</p>
            </div>
            <p className="text-sm text-gray-600 truncate">{bookmark.url}</p>
          </div>
        </a>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
