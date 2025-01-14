"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { editBookmark } from "../actions";
import { useRef } from "react";
import { ContextMenuItem } from "@/components/ui/context-menu";

interface EditBookmarkDialogProps {
  bookmark: {
    id: string;
    title: string;
    description?: string;
    url: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBookmarkDialog({ bookmark, open, onOpenChange }: EditBookmarkDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          action={async (formData) => {
            await editBookmark(bookmark.id, formData);
            formRef.current?.reset();
            onOpenChange(false);
          }}
          className="space-y-4"
        >
          <Input
            name="title"
            placeholder="Title"
            defaultValue={bookmark.title}
            required
          />
          <Input
            name="description"
            placeholder="Description"
            defaultValue={bookmark.description}
          />
          <Input
            name="url"
            type="url"
            placeholder="URL"
            defaultValue={bookmark.url}
            required
          />
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditBookmarkTrigger({ onClick }: { onClick: () => void }) {
  return (
    <ContextMenuItem onSelect={onClick}>
      <Pencil className="mr-2 h-4 w-4" />
      Edit
    </ContextMenuItem>
  );
}
