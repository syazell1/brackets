import { ReactNode } from "react";
import NavBar from "../ui/NavBar";
import SideBar from "../ui/SideBar";
import styles from './PageContainer.module.css'

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <SideBar />
        <main className={styles["main-container"]}>
          {children}
        </main>
        <div className={styles.side}></div>
      </div>
    </>
  )
}

export default PageContainer;
