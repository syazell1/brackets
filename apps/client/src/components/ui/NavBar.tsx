'use client'

import { useContext } from "react";
import Input from "./Input";
import styles from './NavBar.module.css'
import Link from "next/link";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { authContextProvider } from "@/providers/AuthContext";
import UserLoggedInMenu from "@/features/users/components/UserLoggedInMenu";

const NavBar = () => {
  const { isLoading, isLoggedIn, usersInfo } = useContext(authContextProvider);
  const router = useRouter();

  return (
    <header className={styles.container}>
      <nav className={styles["nav-container"]}>
        <div className={styles["title-container"]}>
          <h2 onClick={() => router.push('/')}>brackets</h2>
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
