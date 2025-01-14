export interface Bookmark {
  id: string;
  title: string;
  description?: string;
  url: string;
  order_index: number;
}

export interface Group {
  id: string;
  title: string;
  order_index: number;
  bookmarks: Bookmark[];
}
