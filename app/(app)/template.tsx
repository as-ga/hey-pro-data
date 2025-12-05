import Header from "@/components/header";

function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="overflow-hidden h-screen max-w-[1080px]  sm:mb-0 mb-6 mx-auto overflow-y-auto flex flex-col items-center">
      <Header />
      <div className="mt-26 w-full  ">
        {children}
      </div>


    </div>
  );
}
export default AppLayout;
