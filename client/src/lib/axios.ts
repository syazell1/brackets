import { AUTH_URL, SERVER_URL } from '@/constants/server-config'
import { AuthDetails } from '@/features/Auth/types/Auth'
import axios, { AxiosError } from 'axios'

export const auth_client = axios.create({
    baseURL: AUTH_URL,
    headers: {
        'Content-Type' : 'application/json',
    },
    withCredentials : true
})

const client = axios.create({
    baseURL: SERVER_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

client.interceptors.response.use(res => res,
    async (err) => {
        const prevRequest = err.config
        if(err.response?.status === 401 && !prevRequest.sent)
        {
            try{
                prevRequest.sent = true
                const res = await axios.get<AuthDetails>(`${SERVER_URL}/api/auth/refresh`, {withCredentials: true})

                if(res.status === 200)
                {
                    client.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
                    prevRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
                }

                return client(prevRequest)
            }
            catch(err)
            {
                // window.location.reload()
                return Promise.reject(err);
            }
        }

        return err
    })


export default client