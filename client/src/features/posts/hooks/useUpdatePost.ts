import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdatePostInput } from "../types/posts.types"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useAxios } from "@/hooks/useAxios"
import { revalidateTag } from "next/cache"

type useUpdatePostType = {
  id: string,
  data: UpdatePostInput
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const client = useAxios();

  return useMutation({
    mutationFn: async ({id, data}: useUpdatePostType) => {
      const res = await client.patch(`/posts/${id}`, data);

      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"]
      })
      toast.success("Post updated successfully")
      router.push('/');
      revalidateTag('posts')
    },
    onError: (e) => {
      toast.error(e.message)
    }
  })
}
