'use client'

import styles from './NavBar.module.css'
import Link from "next/link";
import UserLoggedInMenu from "@/features/users/components/UserLoggedInMenu";
import { useGetCurrentUser } from "@/features/auth/hooks/useGetCurrentUser";
import { Input } from './input';

const NavBar = () => {
  const {isPending, data, isLoggedIn} = useGetCurrentUser();

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
          {isPending ? <p>Loading...</p> : isLoggedIn && data !== undefined ? (
            <UserLoggedInMenu username={data?.username!} />
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
