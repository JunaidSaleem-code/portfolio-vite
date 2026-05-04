import Providers from "@/components/admin/Providers";

export const metadata = {
  title: "Admin · Junaid Saleem",
};

export default function AdminLayout({ children }) {
  return <Providers>{children}</Providers>;
}
