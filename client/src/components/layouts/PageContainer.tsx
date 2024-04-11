import { ReactNode } from "react";
import NavBar from "../ui/NavBar";
import SideBar from "../ui/SideBar";

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <NavBar />
      <div className="flex gap-2 justify-between">
        <SideBar />
        <div className="basis-[250px]"></div>
        <main className="basis-[50rem] p-4">
          {children}
        </main>
        <div className="basis-[250px]"></div>
      </div>
    </>
  )
}

export default PageContainer;
