import axios from 'axios'
import { AUTH_URL, SERVER_URL } from 'client/constants/server-config'
import { AuthDetails } from 'client/features/auth/types/auth.types'

export const auth_client = axios.create({
  baseURL: AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
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
    if (err.response?.status === 401 && !prevRequest.sent) {
      try {
        prevRequest.sent = true
        const res = await axios.get<AuthDetails>(`${SERVER_URL}/auth/refresh`, { withCredentials: true })

        if (res.status === 200) {
          client.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
          prevRequest.headers.Authorization = `Bearer ${res.data.access_token}`
        }

        return client(prevRequest)
      }
      catch (err) {
        // window.location.reload()
        return Promise.reject(err);
      }
    }

    return err
  })


export default client
