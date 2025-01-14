import { getGroupsByUserId } from "@/lib/db";
import { ClientPage } from "./_components/client-page";

export default async function Page() {
  const userId = "0d0578f8-7801-4625-8a93-2568fc5da2d0";
  const initialGroups = await getGroupsByUserId(userId);

  return <ClientPage initialGroups={initialGroups} userId={userId} />;
}
