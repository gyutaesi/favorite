"use server";

import { addGroup, updateGroup, delGroup, updateGroupOrder } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createGroup(userId: string, data: FormData) {
  const title = data.get("title") as string;

  if (!title) {
    throw new Error("Title is required");
  }

  await addGroup(userId, title);
  revalidatePath("/");
}

export async function editGroup(groupId: string, data: FormData) {
  const title = data.get("title") as string;

  if (!title) {
    throw new Error("Title is required");
  }

  await updateGroup(groupId, {
    title,
  });

  revalidatePath("/");
}

export async function deleteGroup(groupId: string) {
  await delGroup(groupId);
  revalidatePath("/");
}

export async function reorderGroup(groupId: string, newIndex: number) {
  await updateGroupOrder(groupId, newIndex);
  revalidatePath("/");
}
