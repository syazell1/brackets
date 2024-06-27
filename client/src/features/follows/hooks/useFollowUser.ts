import { useAxios } from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query"

export const useFollowUser = () => {
    const client = useAxios();

    return useMutation({
        mutationFn: async (userId : string) => {
            await client.post(`/users/${userId}/follow`) 
        }
    })
}