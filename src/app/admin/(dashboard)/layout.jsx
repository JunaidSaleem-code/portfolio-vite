import { auth } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  return (
    <div className="st-admin lg:flex">
      <Sidebar
        userEmail={session?.user?.email}
        userName={session?.user?.name}
      />
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
