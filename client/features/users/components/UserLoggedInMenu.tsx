'use client'

import Button from "client/components/ui/Button"
import styles from './UserLoggedInMenu.module.css'
import { useLogout } from "client/features/auth/hooks/useLogout"

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
