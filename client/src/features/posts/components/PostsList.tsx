'use client'

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useGetAllPosts} from "../hooks/useGetPosts";
import PostItem from "./PostItem";
import { useSearchParams } from "next/navigation";

const PostsLists = () => {
  const searchParam = useSearchParams();
  const { ref, inView } = useInView()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending
  } = useGetAllPosts(searchParam.get("q") ?? "")

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage])


  if(isPending) {
    return <p>Loading...</p>
  }

  if (data?.pages[0].data.length === 0) {
    return <p>No Posts Available</p>
  }

  return (
    <>
      <ul className="space-y-4 pb-4">
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
