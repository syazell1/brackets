'use client'

import { useLogout } from '@/features/auth/hooks/useLogout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

type UserLoggedInMenuType = {
  username: string
}

const UserLoggedInMenu = ({ username }: UserLoggedInMenuType) => {
  const { mutate, isPending } = useLogout();

  return (
    <div className='flex gap-6 items-center'>
      <div>
        <Button asChild >
          <Link href="/posts/create">Add New Post</Link>
        </Button>
      </div>
      <div>
        {/* <p className='text-sm font-semibold'>{username}</p> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">@{username}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/profile/${username}`}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Dashboard</DropdownMenuItem>
            <DropdownMenuItem>Reading List</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => mutate()}>
              {isPending ? "Loading..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default UserLoggedInMenu;
