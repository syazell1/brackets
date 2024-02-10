'use client'

import { MoreVertical } from "lucide-react";
import styles from './PostItemMenu.module.css'
import { PostsDetails } from "../types/posts.types";
import { useRouter } from "next/navigation";

type PostItemMenuType = {
  data: PostsDetails
}

const PostItemMenu = ({ data }: PostItemMenuType) => {
  const router = useRouter();

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
          <li onClick={() => router.push(`/posts/${data.id}/update`)}>Update</li>
          <li>Delete</li>
        </ul>
      </div>
    </div>
  )
}

export default PostItemMenu;
