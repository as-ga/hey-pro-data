import Header from "@/components/header";

function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="overflow-hidden">
      <Header />
      <div className="mt-16 w-full max-w-[1080px] mx-auto ">
        {children}
      </div>


    </div>
  );
}
export default AppLayout;
