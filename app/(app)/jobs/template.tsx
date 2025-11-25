import JobsHeader from "./components/jobheader";


function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="overflow-hidden">
            <JobsHeader />
            <div className="mt-24">
                {children}
            </div>


        </div>
    );
}
export default AppLayout;
