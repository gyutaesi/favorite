import { Bookmark } from "@/app/_components/bookmark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";

export function Group({
  group,
}: {
  group: {
    id: string;
    title: string;
    bookmarks: {
      id: string;
      title: string;
      url: string;
    }[];
  };
}) {
  return (
    <Card id={group.id}>
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between gap-2">
            <p>{group.title}</p>
            <Button variant="ghost" size="icon">
              <PlusIcon />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col p-4 gap-4">
        {group.bookmarks.map((bookmark) => (
          <Bookmark key={bookmark.id} bookmark={bookmark} />
        ))}
      </CardContent>
    </Card>
  );
}
