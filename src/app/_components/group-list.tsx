"use client";

import dynamic from "next/dynamic";
import { Group as GroupType } from "@/types";

// Dynamically import the entire list component to avoid SSR issues
const DraggableGroupList = dynamic(
  () => import("./draggable-group-list").then((mod) => mod.DraggableGroupList),
  { ssr: false }
);

export function GroupList({ groups: initialGroups }: { groups: GroupType[] }) {
  return <DraggableGroupList groups={initialGroups} />;
}
