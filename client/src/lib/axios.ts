import { SERVER_URL } from '@/constants/server-config'
import axios from "axios";

export default axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const client = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// client.interceptors.response.use(res => res,
//   async (err) => {
//     const prevRequest = err.config
//     if (err.response?.status === 401 && !prevRequest.sent) {
//       try {
//         prevRequest.sent = true
//         const res = await axios.get<AuthDetails>(`${SERVER_URL}/auth/refresh`, { withCredentials: true })
//
//         if (res.status === 200) {
//           client.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
//           prevRequest.headers.Authorization = `Bearer ${res.data.access_token}`
//         }
//
//         return client(prevRequest)
//       }
//       catch (err) {
//         // window.location.reload()
//         return Promise.reject(err);
//       }
//     }
//
//     return err
//   })
