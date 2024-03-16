'use client'

import { useLogout } from '@/features/auth/hooks/useLogout'
import styles from './UserLoggedInMenu.module.css'
import Button from '@/components/ui/Button'

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
        <Button onClick={() => mutate()} variant="primary">
          {isPending ? "Loading..." : "Logout"}
        </Button>
      </div>
    </div>
  )
}

export default UserLoggedInMenu;
