import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost } from "../services/posts.api.services"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => {
      return deletePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"]
      })
      router.push('/')
      toast.success("Post successfully deleted.")
    },
    onError: (e) => {
      toast.error(e.message)
    }
  })
}
