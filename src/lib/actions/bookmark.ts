"use server";

import { addBookmark, updateBookmark, delBookmark, updateBookmarkOrder, moveBookmarkToGroup } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createBookmark(groupId: string, data: FormData) {
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
  });

  revalidatePath("/");
}

export async function editBookmark(bookmarkId: string, data: FormData) {
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
  });

  revalidatePath("/");
}

export async function deleteBookmark(bookmarkId: string) {
  await delBookmark(bookmarkId);
  revalidatePath("/");
}

export async function reorderBookmark(bookmarkId: string, newIndex: number) {
  await updateBookmarkOrder(bookmarkId, newIndex);
  revalidatePath("/");
}

export async function moveBookmark(bookmarkId: string, newGroupId: string): Promise<{ success: boolean }> {
  await moveBookmarkToGroup(bookmarkId, newGroupId);
  revalidatePath("/");
  return { success: true };
}
