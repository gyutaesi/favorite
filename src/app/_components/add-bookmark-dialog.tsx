"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { createBookmark } from "../actions";
import { useRef, useState } from "react";

export function AddBookmarkDialog({ groupId }: { groupId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      await createBookmark(groupId, formData);
      formRef.current?.reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create bookmark:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bookmark</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="space-y-4"
        >
          <Input name="title" placeholder="Title" required />
          <Input name="description" placeholder="Description" />
          <Input name="url" type="url" placeholder="URL" required />
          <Button type="submit">Add Bookmark</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
