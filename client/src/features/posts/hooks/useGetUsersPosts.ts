import axios from "@/lib/axios"
import { PageList } from "@/types/page-lists.types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { PostsDetails } from "../types/posts.types"

export const useGetUsersPost = (username : string) => {
    return useInfiniteQuery({
        queryKey: ["users-posts", {username}],
        queryFn: async ({pageParam}) => {
            const res = await axios.get<PageList<PostsDetails[]>>(`/users/${username}/posts?page=${pageParam}`) 

            return res.data; 
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.data.length === 10 ? allPages.length + 1 : undefined; 
        }
    })
}