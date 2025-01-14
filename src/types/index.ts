export type Group = {
  id: string;
  title: string;
  bookmarks: {
    id: string;
    title: string;
    description: string;
    url: string;
  }[];
};
