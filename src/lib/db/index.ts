import { neon } from "@neondatabase/serverless";
import { Group, Bookmark } from "@/types";

const sql = neon(process.env.DATABASE_URL || "");

export async function getGroupsByUserId(userId: string): Promise<Group[]> {
  const groups = await sql`
    SELECT g.*, json_agg(
      json_build_object(
        'id', b.id,
        'title', b.title,
        'description', b.description,
        'url', b.url
      ) ORDER BY b.order_index ASC
    ) as bookmarks
    FROM groups g
    LEFT JOIN bookmarks b ON b.group_id = g.id
    WHERE g.user_id = ${userId}
    GROUP BY g.id
    ORDER BY g.order_index ASC, g.created_at ASC
  `;

  return (groups as Group[]).map((group) => ({
    ...group,
    bookmarks: group.bookmarks[0] === null ? [] : group.bookmarks,
  }));
}

export async function addBookmark(
  groupId: string,
  bookmark: Omit<Bookmark, "id">
) {
  const result = await sql`
    INSERT INTO bookmarks (id, group_id, title, description, url)
    VALUES (gen_random_uuid(), ${groupId}, ${bookmark.title}, ${bookmark.description}, ${bookmark.url})
    RETURNING *
  `;
  return result[0];
}

export async function addGroup(userId: string, title: string) {
  const result = await sql`
    INSERT INTO groups (id, user_id, title)
    VALUES (gen_random_uuid(), ${userId}, ${title})
    RETURNING *
  `;
  return result[0];
}

export async function delBookmark(bookmarkId: string) {
  await sql`
    DELETE FROM bookmarks
    WHERE id = ${bookmarkId}
  `;
}

export async function delGroup(groupId: string) {
  await sql`
    DELETE FROM groups WHERE id = ${groupId}
  `;
}

export async function updateBookmark(
  bookmarkId: string,
  data: {
    title: string;
    description?: string;
    url: string;
  }
) {
  const result = await sql`
    UPDATE bookmarks
    SET 
      title = ${data.title},
      description = ${data.description},
      url = ${data.url}
    WHERE id = ${bookmarkId}
    RETURNING *
  `;
  return result[0];
}

export async function updateBookmarkOrder(
  bookmarkId: string,
  newIndex: number
) {
  await sql`
    WITH bookmark_order AS (
      SELECT group_id, order_index
      FROM bookmarks
      WHERE id = ${bookmarkId}
    )
    UPDATE bookmarks
    SET order_index = 
      CASE 
        WHEN id = ${bookmarkId} THEN ${newIndex}
        WHEN order_index >= ${newIndex} THEN order_index + 1
        ELSE order_index
      END
    WHERE group_id = (SELECT group_id FROM bookmark_order)
  `;
}

export async function updateGroup(
  groupId: string,
  data: {
    title: string;
  }
) {
  const result = await sql`
    UPDATE groups
    SET title = ${data.title}
    WHERE id = ${groupId}
    RETURNING *
  `;
  return result[0];
}

export async function updateGroupOrder(
  groupId: string,
  newIndex: number
) {
  await sql`
    WITH group_order AS (
      SELECT user_id, order_index
      FROM groups
      WHERE id = ${groupId}
    )
    UPDATE groups
    SET order_index = 
      CASE 
        WHEN id = ${groupId} THEN ${newIndex}
        WHEN order_index >= ${newIndex} THEN order_index + 1
        ELSE order_index
      END
    WHERE user_id = (SELECT user_id FROM group_order)
  `;
}
