import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="container pt-4 pb-4 px-4 print:p-0 print:m-0">{children}</div>
    </div>
  );
}
