'use client'

import Link from "next/link";
import UserLoggedInMenu from "@/features/users/components/UserLoggedInMenu";
import { useGetCurrentUser } from "@/features/auth/hooks/useGetCurrentUser";
import { Input } from './input';
import { Button } from "./button";
import SearchPostBar from "@/features/posts/components/SearchPostBar";

const NavBar = () => {
  const { isPending, isLoggedIn, authInfo} = useGetCurrentUser();

  return (
    <header className="fixed top-0 left-0 bg-[#fff] border border-b-2 z-50 w-full p-2">
      <div className="max-w-[90rem] mx-auto px-1">
        <nav className="flex justify-between items-center gap-1">
          {/* title-container */}
          <div className="basis-[250px]">
            <h2 className="">
              <Link href="/" className="no-underline font-semibold text-lg hover:underline">brackets</Link>
            </h2>
          </div>
          {/* search-container */}
          <div className="basis-[50rem]">
            <SearchPostBar />
          </div>
          {/* menu-contaienr */}
          <div className="basis-[250px]">
            {isPending ? <p>Loading...</p> : isLoggedIn && authInfo.username.length > 0? (
              <UserLoggedInMenu username={authInfo.username} />
            ) : (
              <ul className="flex gap-6">
                <li>
                  <Button asChild variant="outline">
                    <Link href="/login" className="font-sm font-semibold">Login</Link>
                  </Button>
                </li>
                <li>
                  <Button asChild>
                    <Link href="/register" className="font-sm font-semibold">Register</Link>
                  </Button>
                </li>
              </ul>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default NavBar;
