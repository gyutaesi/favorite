"use client";

import { Group } from "@/types";
import { DndContext } from "./dnd-context";
import { GroupList } from "../group/group-list";

interface ClientWrapperProps {
  groups: Group[];
  onGroupsChange: (groups: Group[]) => void;
}

export function ClientWrapper({ groups, onGroupsChange }: ClientWrapperProps) {
  return (
    <DndContext groups={groups} onGroupsChange={onGroupsChange}>
      <GroupList groups={groups} />
    </DndContext>
  );
}
