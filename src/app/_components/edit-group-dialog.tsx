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
import { editGroup } from "../actions";
import { useRef } from "react";

interface EditGroupDialogProps {
  group: {
    id: string;
    title: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGroupDialog({ group, open, onOpenChange }: EditGroupDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          action={async (formData) => {
            await editGroup(group.id, formData);
            formRef.current?.reset();
            onOpenChange(false);
          }}
          className="space-y-4"
        >
          <Input
            name="title"
            placeholder="Group Title"
            defaultValue={group.title}
            required
          />
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditGroupButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:text-blue-600"
      onClick={onClick}
    >
      <Pencil className="h-4 w-4" />
    </Button>
  );
}
