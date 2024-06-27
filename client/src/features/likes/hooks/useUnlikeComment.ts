import { useAxios } from "@/hooks/useAxios"
import { useMutation } from "@tanstack/react-query"

export const useUnlikeComment = () => {
    const client = useAxios();

    return useMutation({
        mutationFn: async (id : string) => {
            await client.post(`/comments/${id}/unlike`);
        } 
    })
}