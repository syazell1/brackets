'use client'

import { useContext } from "react";
import styles from './NavBar.module.css'
import Link from "next/link";
import { authContextProvider } from "@/providers/AuthContext";
import UserLoggedInMenu from "@/features/users/components/UserLoggedInMenu";
import { Input } from "@repo/ui/components/input";

const NavBar = () => {
  const { isLoading, isLoggedIn, usersInfo } = useContext(authContextProvider);

  return (
    <header className={styles.container}>
      <nav className={styles["nav-container"]}>
        <div className={styles["title-container"]}>
          <h2 className="">
            <Link href="/" className="no-underline font-semibold text-lg hover:underline">brackets</Link>
          </h2>
        </div>
        <div className={styles["search-container"]}>
          <Input placeholder="Search" />
        </div>
        <div className={styles["menu-container"]}>
          {isLoading ? <p>Loading...</p> : isLoggedIn ? (
            <UserLoggedInMenu username={usersInfo.username} />
          ) : (
            <ul>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>Register</li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  )
}

export default NavBar;
