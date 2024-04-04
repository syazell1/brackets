import {useContext, useEffect} from "react";
import {authContextProvider} from "@/providers/AuthContext";
import {useRefreshToken} from "@/hooks/useRefreshToken";
import {client} from "@/lib/axios";

export const useAxios = () => {
    const {usersInfo, setIsLoggedInHandler, setIsLoadingHandler} = useContext(authContextProvider);
    const refresh = useRefreshToken();

    useEffect(() => {
        const reqInterceptor = client.interceptors.request.use(
            config => {

                if(!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${usersInfo.access_token}`
                }

                return config;
            }, (err) => Promise.reject(err)
        )

        const resInterceptor = client.interceptors.response.use(
            res => res,
            async (err) => {
                const prevRequest = err?.config;
                
                if(err?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const res = await refresh();
                    if(res.status === 200) {
                        prevRequest.headers["Authorization"] = `Bearer ${res.data.access_token}`;
                        setIsLoggedInHandler(true)
                        setIsLoadingHandler(false)
                        return client(prevRequest)
                    }
                }


                setIsLoadingHandler(false)
                return Promise.reject(err);
            }
        )

        return () => {
            client.interceptors.request.eject(reqInterceptor);
            client.interceptors.response.eject(resInterceptor);
        }
    }, [usersInfo, refresh]);

    return client;
}