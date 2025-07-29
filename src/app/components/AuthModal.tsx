"use client";
import React from "react";
import { AuthForm } from "../types";

interface AuthModalProps {
    type: "signup" | "login";
    show: boolean;
    authForm: AuthForm;
    authError: string;
    authLoading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AuthModal({
    type,
    show,
    authForm,
    authError,
    authLoading,
    onSubmit,
    onClose,
    onChange
}: AuthModalProps) {
    if (!show) return null;

    const isSignup = type === "signup";
    const title = isSignup ? "Signup" : "Login";
    const buttonText = isSignup ? "Signup" : "Login";
    const loadingText = isSignup ? "Signing up..." : "Logging in...";
    const titleColor = isSignup ? "text-green-900" : "text-blue-900";
    const buttonColor = isSignup ? "bg-green-700 hover:bg-green-800" : "bg-blue-700 hover:bg-blue-800";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <form
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs relative flex flex-col gap-4"
                onSubmit={onSubmit}
            >
                <button
                    type="button"
                    className="absolute top-3 right-3 text-green-900 hover:text-red-600 text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className={`text-xl font-bold ${titleColor} mb-2`}>{title}</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="border rounded px-3 py-2"
                    value={authForm.email}
                    onChange={onChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border rounded px-3 py-2"
                    value={authForm.password}
                    onChange={onChange}
                    required
                />
                {authError && <div className="text-red-600 text-sm mt-1">{authError}</div>}
                <button
                    type="submit"
                    className={`mt-2 ${buttonColor} text-white font-bold py-2 px-4 rounded-full shadow-lg disabled:opacity-60`}
                    disabled={authLoading}
                >
                    {authLoading ? loadingText : buttonText}
                </button>
            </form>
        </div>
    );
} 