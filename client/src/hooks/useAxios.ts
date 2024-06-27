import {useEffect} from "react";
import {useRefreshToken} from "@/hooks/useRefreshToken";
import {client} from "@/lib/axios";
import { authStore } from "@/providers/AuthStore";

export const useAxios = () => {
    const refresh = useRefreshToken();
    const {authInfo, setIsLoggedIn, setIsLoading} = authStore();

    useEffect(() => {
        const reqInterceptor = client.interceptors.request.use(
            config => {

                if(!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${authInfo.access_token}`
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
                    const token = await refresh();
                    
                    if(token !== undefined && token.length > 0) {
                        prevRequest.headers["Authorization"] = `Bearer ${token}`;
                        setIsLoggedIn(true)
                        // setIsLoadingHandler(false)
                        setIsLoading(false)
                        return client(prevRequest)
                    }
                }


                setIsLoggedIn(false)
                setIsLoading(false)
                return Promise.reject(err);
            }
        )

        return () => {
            client.interceptors.request.eject(reqInterceptor);
            client.interceptors.response.eject(resInterceptor);
        }
    }, [authInfo, refresh, setIsLoggedIn]);

    return client;
}