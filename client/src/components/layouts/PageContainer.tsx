import { ReactNode } from "react";
import NavBar from "../ui/NavBar";
import SideBar from "../ui/SideBar";

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <NavBar />
      <div className="max-w-[90rem] mx-auto px-1 h-screen">
        <div className="h-full">
          <div className="flex gap-2 justify-between pt-14">
            {/* <SideBar /> */}
            <div className="basis-[250px]"></div>
            <main className="basis-[50rem] mt-4">
              {children}
            </main>
            <div className="basis-[250px]"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PageContainer;
