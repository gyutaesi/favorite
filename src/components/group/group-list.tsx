"use client";

import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { GroupCard } from "./group-card";
import { Group } from "@/types";

interface GroupListProps {
  groups: Group[];
}

export function GroupList({ groups }: GroupListProps) {
  return (
    <SortableContext
      items={groups.map((g) => `group-${g.id}`)}
      strategy={rectSortingStrategy}
    >
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </SortableContext>
  );
}
