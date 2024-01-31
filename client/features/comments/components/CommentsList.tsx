'use client'

import { useInView } from "react-intersection-observer";
import { useGetPostsComments } from "../hooks/useGetComments";
import { useEffect } from "react";
import CommentsItem from "./CommentsItem";
import styles from './CommentsList.module.css'

type CommentsListType = {
  postId: string
}

const CommentsList = ({ postId }: CommentsListType) => {
  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useGetPostsComments(postId)

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, inView, fetchNextPage])

  if (!data || isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className={styles.container}>
      <h2>Comments ({data?.pages[0].page_metadata?.totalItemsCount})</h2>
      <ul className={styles.list}>
        {data?.pages.map(grp => {
          return grp.data.map((v, i) => {
            if (grp.data.length === i + 1) {
              return <CommentsItem key={v.id} data={v} ref={ref} />
            }
            return <CommentsItem key={v.id} data={v} />
          })
        })}
      </ul>
      {isFetchingNextPage && <p>Loading...</p>}
    </div>
  )
}

export default CommentsList;
