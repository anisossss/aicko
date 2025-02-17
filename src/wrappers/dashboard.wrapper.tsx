import Navigation from "@/components/layout/navbar";

export default function DashboardWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Navigation />
      <div className="flex flex-col w-full h-full overflow-y-auto">
        {children}
        </div>
    </div>
  );
}
