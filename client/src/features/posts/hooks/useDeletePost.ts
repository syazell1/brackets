import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAxios } from "@/hooks/useAxios";

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const client = useAxios();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await client.patch(`/posts/${id}/delete`);

      return res.data
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
