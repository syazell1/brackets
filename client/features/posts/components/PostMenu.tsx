'use client'

import styles from './PostMenu.module.css'
import { useContext } from 'react';
import { authContextProvider } from 'client/providers/AuthContext';
import LinkButton from 'client/components/ui/LinkButton';

const PostMenu = () => {
  const { isLoggedIn } = useContext(authContextProvider);

  return (
    <header>
      <ul className={styles.menu}>
        <li>All Posts</li>
        <li>Featured</li>
        <li>Rising</li>
        {isLoggedIn && (
          <div className={styles["add-btn"]}>
            <LinkButton href="/posts/create">Add Post</LinkButton>
          </div>
        )}
      </ul>
    </header>
  )
}

export default PostMenu;
