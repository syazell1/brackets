'use client'

import { useLogout } from '@/features/auth/hooks/useLogout'
import styles from './UserLoggedInMenu.module.css'
import { Button } from '@repo/ui/components/button'

type UserLoggedInMenuType = {
  username: string
}

const UserLoggedInMenu = ({ username }: UserLoggedInMenuType) => {
  const { mutate, isPending } = useLogout();

  return (
    <div className={styles.container}>
      <div>
        <p>Welcome, {username}!</p>
      </div>
      <div>
        <Button onClick={() => mutate()}> 
          {isPending ? "Loading..." : "Logout"}
        </Button>
      </div>
    </div>
  )
}

export default UserLoggedInMenu;
