"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth';
import { AuthService } from '@/lib/services/auth.service';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, rememberMe?: boolean) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    const login = useCallback(async (newToken: string, rememberMe = false) => {
        try {
            const decoded = jwtDecode<User>(newToken);

            // Update state and storage
            await Promise.all([
                new Promise<void>((resolve) => {
                    setUser(decoded);
                    resolve();
                }),
                new Promise<void>((resolve) => {
                    setToken(newToken);
                    resolve();
                }),
                new Promise<void>((resolve) => {
                    AuthService.setAuthToken(newToken, rememberMe);
                    resolve();
                })
            ]);
        } catch (error) {
            console.error('Invalid token:', error);
            await logout();
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        await Promise.all([
            new Promise<void>((resolve) => {
                setUser(null);
                resolve();
            }),
            new Promise<void>((resolve) => {
                setToken(null);
                resolve();
            })
        ]);
        AuthService.setAuthToken(null);
        router.replace('/auth/login');
    }, [router]);

    useEffect(() => {
        // Check for saved token on mount
        const savedToken = AuthService.getAuthToken();
        if (savedToken) {
            login(savedToken).catch(console.error);
        }
    }, [login]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 