import { AUTH_URL } from "@/constants/server-config";
import { AuthDetails } from "@/features/Auth/types/Auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getUser = async () => {
    const rt = cookies().get('rt')
    const res = await fetch(`${AUTH_URL}/refresh`, {
        headers: {
            'Cookie': `rt=${rt?.value}`
        },
        credentials: 'include',
        cache: 'no-store'
    })

    if (!res.ok) {
        return null;
    }

    const data = await res.json() as AuthDetails;

    return data;
}