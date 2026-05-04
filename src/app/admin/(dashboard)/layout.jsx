import { auth } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-black text-white lg:flex">
      <Sidebar userEmail={session?.user?.email} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
