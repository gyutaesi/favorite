"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bookmark } from "@/types";
import { createBookmark, editBookmark } from "@/lib/actions";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface BookmarkFormDialogProps {
  bookmark?: Bookmark;
  groupId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BookmarkFormDialog({
  bookmark,
  groupId,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: BookmarkFormDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isEdit = !!bookmark;

  const open = controlledOpen ?? uncontrolledOpen;
  const onOpenChange = controlledOnOpenChange ?? setUncontrolledOpen;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (isEdit) {
      await editBookmark(bookmark.id, formData);
    } else if (groupId) {
      await createBookmark(groupId, formData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!isEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary"
          onClick={() => onOpenChange(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
        </Button>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Bookmark" : "Add Bookmark"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={bookmark?.title}
              required
            />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              defaultValue={bookmark?.url}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={bookmark?.description}
            />
          </div>
          <DialogFooter>
            <Button type="submit">{isEdit ? "Save" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
