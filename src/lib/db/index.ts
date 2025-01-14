import { neon } from "@neondatabase/serverless";
import { Group, Bookmark } from "@/types";

const sql = neon(process.env.DATABASE_URL || "");

export async function getGroupsByUserId(userId: string): Promise<Group[]> {
  const groups = await sql`
    SELECT g.*, 
      COALESCE(
        json_agg(
          json_build_object(
            'id', b.id,
            'title', b.title,
            'description', b.description,
            'url', b.url,
            'order_index', b.order_index
          ) ORDER BY b.order_index ASC
        ) FILTER (WHERE b.id IS NOT NULL),
        '[]'
      ) as bookmarks
    FROM groups g
    LEFT JOIN bookmarks b ON b.group_id = g.id
    WHERE g.user_id = ${userId}
    GROUP BY g.id
    ORDER BY g.order_index ASC, g.created_at ASC
  `;

  return groups as Group[];
}

export async function addBookmark(
  groupId: string,
  bookmark: Omit<Bookmark, "id" | "order_index">
) {
  const result = await sql`
    WITH max_order AS (
      SELECT COALESCE(MAX(order_index), -1) + 1 as next_order
      FROM bookmarks
      WHERE group_id = ${groupId}
    )
    INSERT INTO bookmarks (id, group_id, title, description, url, order_index)
    VALUES (
      gen_random_uuid(),
      ${groupId},
      ${bookmark.title},
      ${bookmark.description},
      ${bookmark.url},
      (SELECT next_order FROM max_order)
    )
    RETURNING *
  `;
  return result[0];
}

export async function addGroup(userId: string, title: string) {
  const result = await sql`
    WITH max_order AS (
      SELECT COALESCE(MAX(order_index), -1) + 1 as next_order
      FROM groups
      WHERE user_id = ${userId}
    )
    INSERT INTO groups (id, user_id, title, order_index)
    VALUES (
      gen_random_uuid(),
      ${userId},
      ${title},
      (SELECT next_order FROM max_order)
    )
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
  data: Omit<Bookmark, "id" | "order_index">
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

export async function updateBookmarkOrder(
  bookmarkId: string,
  newIndex: number
) {
  await sql`
    WITH moved_bookmark AS (
      SELECT group_id, order_index as old_index
      FROM bookmarks
      WHERE id = ${bookmarkId}
    )
    UPDATE bookmarks b
    SET order_index = 
      CASE 
        WHEN b.id = ${bookmarkId} THEN ${newIndex}
        WHEN b.order_index < (SELECT old_index FROM moved_bookmark) 
          AND b.order_index >= ${newIndex} THEN b.order_index + 1
        WHEN b.order_index > (SELECT old_index FROM moved_bookmark) 
          AND b.order_index <= ${newIndex} THEN b.order_index - 1
        ELSE b.order_index
      END
    WHERE b.group_id = (SELECT group_id FROM moved_bookmark)
  `;
}

export async function updateGroupOrder(
  groupId: string,
  newIndex: number
) {
  await sql`
    WITH moved_group AS (
      SELECT user_id, order_index as old_index
      FROM groups
      WHERE id = ${groupId}
    )
    UPDATE groups g
    SET order_index = 
      CASE 
        WHEN g.id = ${groupId} THEN ${newIndex}
        WHEN g.order_index < (SELECT old_index FROM moved_group) 
          AND g.order_index >= ${newIndex} THEN g.order_index + 1
        WHEN g.order_index > (SELECT old_index FROM moved_group) 
          AND g.order_index <= ${newIndex} THEN g.order_index - 1
        ELSE g.order_index
      END
    WHERE g.user_id = (SELECT user_id FROM moved_group)
  `;
}

export async function moveBookmarkToGroup(
  bookmarkId: string,
  newGroupId: string
) {
  await sql`
    WITH max_order AS (
      SELECT COALESCE(MAX(order_index), -1) + 1 as next_order
      FROM bookmarks
      WHERE group_id = ${newGroupId}
    )
    UPDATE bookmarks
    SET 
      group_id = ${newGroupId},
      order_index = (SELECT next_order FROM max_order)
    WHERE id = ${bookmarkId}
    RETURNING *
  `;
}
