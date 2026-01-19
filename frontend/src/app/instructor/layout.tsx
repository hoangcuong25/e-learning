import InstructorSidebar from "@/components/instructor/InstructorSidebar";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <InstructorSidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">{children}</main>
    </div>
  );
}
