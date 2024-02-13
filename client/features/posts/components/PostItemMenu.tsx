'use client'

import { MoreVertical } from "lucide-react";
import styles from './PostItemMenu.module.css'
import { PostsDetails } from "../types/posts.types";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { authContextProvider } from "client/providers/AuthContext";

type PostItemMenuType = {
  data: PostsDetails
}

const PostItemMenu = ({ data }: PostItemMenuType) => {
  const router = useRouter();
  const { usersInfo, isLoggedIn } = useContext(authContextProvider);

  return (
    <div className={styles.container}>
      <div className={styles["dropdown-btn"]}>
        <MoreVertical />
      </div>
      <div className={styles["dropdown-content"]}>
        <h4>Post Menu</h4>
        <hr />
        <ul className={styles["menu-container"]}>
          <li>Copy Link</li>
          {(usersInfo.username === data.owner.username && isLoggedIn) && (
            <>
              <li onClick={() => router.push(`/posts/${data.id}/update`)}>Update</li>
              <li>Delete</li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

export default PostItemMenu;
