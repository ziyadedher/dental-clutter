import Sidebar from "@/components/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="h-full">
    <Sidebar />
    <main className="ml-72 h-full bg-gray-50">{children}</main>
  </div>
);

export default Layout;
