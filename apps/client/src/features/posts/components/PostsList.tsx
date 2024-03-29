'use client'

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useGetPosts } from "../hooks/useGetPosts";
import PostItem from "./PostItem";
import styles from './PostsList.module.css'

const PostsLists = () => {
  const { ref, inView } = useInView()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetPosts()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage])

  if (data?.pages[0].data.length === 0) {
    return <p>No Posts Available</p>
  }

  return (
    <>
      <ul className={styles.list}>
        {data?.pages.map(grp => {
          return grp.data.map((v, i) => {
            if (grp.data.length === i + 1) {
              return <PostItem key={v.id} data={v} ref={ref} />
            }
            return <PostItem key={v.id} data={v} />
          })
        })}
      </ul>
      {isFetchingNextPage ?? <p>Loading...</p>}
    </>
  )
}

export default PostsLists;
