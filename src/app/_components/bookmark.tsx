import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function Bookmark({
  bookmark,
}: {
  bookmark: {
    id: string;
    title: string;
    url: string;
  };
}) {
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
            <p className="font-bold">{bookmark.title}</p>
            <p>{bookmark.url}</p>
          </div>
        </a>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>Edit</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
