"use server";

import { addBookmark, addGroup, delBookmark, delGroup, updateBookmark, updateGroup, updateGroupOrder, updateBookmarkOrder } from "@/lib/db";
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

export async function createGroup(userId: string, data: FormData) {
  const title = data.get("title") as string;

  if (!title) {
    throw new Error("Title is required");
  }

  await addGroup(userId, title);
  revalidatePath("/");
}

export async function deleteBookmark(bookmarkId: string) {
  await delBookmark(bookmarkId);
  revalidatePath("/");
}

export async function deleteGroup(groupId: string) {
  await delGroup(groupId);
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

export async function reorderGroup(groupId: string, newIndex: number) {
  await updateGroupOrder(groupId, newIndex);
  revalidatePath("/");
}

export async function reorderBookmark(bookmarkId: string, newIndex: number) {
  await updateBookmarkOrder(bookmarkId, newIndex);
  revalidatePath("/");
}
