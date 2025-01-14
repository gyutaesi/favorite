"use server";

import { addBookmark, addGroup, delBookmark, delGroup, updateBookmark, updateGroup, updateGroupOrder, updateBookmarkOrder, moveBookmarkToGroup } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Bookmark } from "@/types";

export async function createBookmark(groupId: string, data: FormData): Promise<void> {
  const title = data.get("title") as string;
  const description = data.get("description") as string;
  const url = data.get("url") as string;

  if (!title || !url) {
    throw new Error("Title and URL are required");
  }

  await addBookmark(groupId, {
    title,
    description,
    url,
  } as Bookmark);

  revalidatePath("/");
}

export async function createGroup(userId: string, data: FormData): Promise<void> {
  const title = data.get("title") as string;

  if (!title) {
    throw new Error("Title is required");
  }

  await addGroup(userId, title);
  revalidatePath("/");
}

export async function deleteBookmark(bookmarkId: string): Promise<void> {
  await delBookmark(bookmarkId);
  revalidatePath("/");
}

export async function deleteGroup(groupId: string): Promise<void> {
  await delGroup(groupId);
  revalidatePath("/");
}

export async function editBookmark(bookmarkId: string, data: FormData): Promise<void> {
  const title = data.get("title") as string;
  const description = data.get("description") as string;
  const url = data.get("url") as string;

  if (!title || !url) {
    throw new Error("Title and URL are required");
  }

  await updateBookmark(bookmarkId, {
    title,
    description,
    url,
  } as Bookmark);

  revalidatePath("/");
}

export async function editGroup(groupId: string, data: FormData): Promise<void> {
  const title = data.get("title") as string;

  if (!title) {
    throw new Error("Title is required");
  }

  await updateGroup(groupId, {
    title,
  });

  revalidatePath("/");
}

export async function moveBookmark(bookmarkId: string, newGroupId: string): Promise<{ success: boolean }> {
  await moveBookmarkToGroup(bookmarkId, newGroupId);
  revalidatePath("/");
  return { success: true };
}

export async function reorderBookmark(bookmarkId: string, newIndex: number): Promise<void> {
  await updateBookmarkOrder(bookmarkId, newIndex);
  revalidatePath("/");
}

export async function reorderGroup(groupId: string, newIndex: number): Promise<void> {
  await updateGroupOrder(groupId, newIndex);
  revalidatePath("/");
}
