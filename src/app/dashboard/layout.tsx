import { redirect } from "next/navigation";
import { Navigation } from "@/components/ui/navigation";
import { Header } from "@/components/ui/header";
import { getServerAuthSession } from "@/server/auth";

export default async function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }
  return (
    <div className="grid h-screen max-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Navigation />
      <div className="flex h-full flex-col overflow-auto">
        <Header />
        <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
