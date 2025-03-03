import { LoginData, RegisterData, AuthResponse } from '@/types/auth';
import { apiClient } from './api-client';
import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_PERSIST_KEY = 'auth_persist';

export class AuthService {
    static getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;
        const token = Cookies.get(AUTH_TOKEN_KEY);
        return token || null;
    }

    static setAuthToken(token: string | null, rememberMe = false): void {
        if (typeof window === 'undefined') return;

        // Clear existing token
        Cookies.remove(AUTH_TOKEN_KEY);

        if (token) {
            // Set the cookie with appropriate expiration
            Cookies.set(AUTH_TOKEN_KEY, token, {
                expires: rememberMe ? 30 : 1, // 30 days or 1 day
                sameSite: 'strict',
                secure: window.location.protocol === 'https:',
            });
        }
    }

    static async login(data: LoginData): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/login', data);
        return response.data;
    }

    static async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post('/api/auth/register', data);
        return response.data;
    }

    static async forgotPassword(email: string): Promise<void> {
        await apiClient.post('/api/auth/forgot-password', { email });
    }

    static async resetPassword(token: string, password: string): Promise<void> {
        await apiClient.post('/api/auth/reset-password', { token, password });
    }
} 