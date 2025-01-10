import { AppSidebar } from "@/components/app-sidebar";
import { Group } from "@/app/_components/group";
import { ThemeSwitch } from "@/components/theme-switch";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const data = {
  groups: [
    {
      id: "1",
      title: "Group 1",
      bookmarks: [
        {
          id: "1",
          title: "Bookmark 1",
          description: "This is a bookmark description",
          url: "https://example.com",
        },
        {
          id: "2",
          title: "Bookmark 2",
          description: "This is another bookmark description",
          url: "https://example.com",
        },
      ],
    },
    {
      id: "2",
      title: "Group 2",
      bookmarks: [
        {
          id: "3",
          title: "Bookmark 3",
          description: "This is a bookmark description",
          url: "https://example.com",
        },
        {
          id: "4",
          title: "Bookmark 4",
          description: "This is another bookmark description",
          url: "https://example.com",
        },
      ],
    },
  ],
};
export default function Page() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <ThemeSwitch />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {data.groups.map((group) => (
              <Group key={group.id} group={group} />
            ))}
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
