import { useAuth } from "@clerk/clerk-react";
import axios, { type AxiosInstance } from "axios";
import { useMemo } from "react";

export const useApiClient = (): AxiosInstance  => {
    
    // Get the getToken function from Clerk's useAuth hook
    const { getToken } = useAuth(); 

    //returning the apiClient instance
    return useMemo(() => {
        const apiClient = axios.create({
            baseURL: "http://localhost:3000/api",
            headers: {
                "Content-Type": "application/json",
            },
        });

        apiClient.interceptors.request.use(
            async (config) => {
                const token = await getToken();
                
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        return apiClient;
    }, [getToken])
    
    

}

export default useApiClient;