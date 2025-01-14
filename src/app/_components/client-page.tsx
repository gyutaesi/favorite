"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ThemeSwitch } from "@/components/theme-switch";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Group } from "@/types";
import { useState } from "react";
import dynamic from "next/dynamic";

const GroupFormDialog = dynamic(() => import("@/components/group/group-form-dialog").then(mod => mod.GroupFormDialog), {
  ssr: false
});

const ClientWrapper = dynamic(() => import("@/components/dnd/client-wrapper").then(mod => mod.ClientWrapper), {
  ssr: false
});

interface ClientPageProps {
  initialGroups: Group[];
  userId: string;
}

export function ClientPage({ initialGroups, userId }: ClientPageProps) {
  const [groups, setGroups] = useState(initialGroups);

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
          <div className="flex justify-end">
            <GroupFormDialog userId={userId} />
          </div>
          <ClientWrapper groups={groups} onGroupsChange={setGroups} />
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
