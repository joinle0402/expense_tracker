import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

export interface HttpClient {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>;
    put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const client: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
});

client.interceptors.response.use(
    <T>(response: AxiosResponse<T>) => response.data,
    (error) => {
        return Promise.reject(error);
    },
);

export const http = client as HttpClient;
