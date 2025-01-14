"use client";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { Group } from "./group";
import { Group as GroupType } from "@/types";
import { reorderGroup } from "../actions";

export function DraggableGroupList({ groups: initialGroups }: { groups: GroupType[] }) {
  const [groups, setGroups] = useState(initialGroups);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = groups.findIndex((group) => group.id === active.id);
      const newIndex = groups.findIndex((group) => group.id === over.id);

      const newGroups = arrayMove(groups, oldIndex, newIndex);
      setGroups(newGroups);

      // Update the order in the database
      await reorderGroup(active.id as string, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={groups} strategy={rectSortingStrategy}>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {groups.map((group) => (
            <Group key={group.id} group={group} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
