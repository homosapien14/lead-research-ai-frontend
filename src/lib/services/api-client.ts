import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { toast } from '@/components/ui/use-toast';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
    private static instance: ApiClient;
    private api: AxiosInstance;

    private constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.api.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = Cookies.get('auth_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                // Handle MongoDB duplicate key errors
                if (error.response?.status === 400 &&
                    error.response?.data &&
                    (error.response.data as any).code === 11000) {
                    return Promise.reject({
                        ...error,
                        response: {
                            ...error.response,
                            status: 409, // Convert to Conflict status
                            data: {
                                ...error.response.data,
                                message: 'A record with this value already exists.'
                            }
                        }
                    });
                }

                // Handle validation errors
                if (error.response?.status === 400 &&
                    error.response?.data &&
                    Array.isArray((error.response.data as any).message)) {
                    const messages = (error.response.data as any).message;
                    return Promise.reject({
                        ...error,
                        response: {
                            ...error.response,
                            data: {
                                ...error.response.data,
                                message: messages.join(', ')
                            }
                        }
                    });
                }

                // Handle unauthorized errors
                if (error.response?.status === 401) {
                    Cookies.remove('auth_token');
                    window.location.href = '/auth/login';
                    return Promise.reject({
                        ...error,
                        response: {
                            ...error.response,
                            data: {
                                message: 'Your session has expired. Please log in again.'
                            }
                        }
                    });
                }

                return Promise.reject(error);
            }
        );
    }

    public getAxiosInstance(): AxiosInstance {
        return this.api;
    }
}

export const apiClient = ApiClient.getInstance().getAxiosInstance(); 