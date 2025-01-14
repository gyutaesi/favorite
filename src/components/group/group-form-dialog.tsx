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
import { Group } from "@/types";
import { createGroup, editGroup } from "@/lib/actions";
import { Plus } from "lucide-react";
import { useState } from "react";

interface GroupFormDialogProps {
  group?: Group;
  userId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GroupFormDialog({
  group,
  userId,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: GroupFormDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isEdit = !!group;

  const open = controlledOpen ?? uncontrolledOpen;
  const onOpenChange = controlledOnOpenChange ?? setUncontrolledOpen;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (isEdit) {
      await editGroup(group.id, formData);
    } else if (userId) {
      await createGroup(userId, formData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!isEdit && (
        <Button onClick={() => onOpenChange(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Group" : "Add Group"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={group?.title}
              required
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

export function GroupFormButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      Edit
    </Button>
  );
}
