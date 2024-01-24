'use client'

import { useContext } from "react";
import Input from "./Input";
import styles from './NavBar.module.css'
import { authContextProvider } from "client/providers/AuthContext";
import Link from "next/link";
import Button from "./Button";
import UserLoggedInMenu from "client/features/users/components/UserLoggedInMenu";

const NavBar = () => {
  const { isLoading, isLoggedIn, usersInfo } = useContext(authContextProvider);

  return (
    <header className={styles.container}>
      <nav className={styles["nav-container"]}>
        <div className={styles["title-container"]}>
          <h2>brackets</h2>
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
