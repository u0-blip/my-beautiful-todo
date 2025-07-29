"use client";
import React, { useState } from "react";
import { AuthForm } from "../types";

interface AuthModalProps {
    type: "signup" | "login";
    show: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AuthModal({
    type,
    show,
    onClose,
    onSuccess
}: AuthModalProps) {
    const [authForm, setAuthForm] = useState<AuthForm>({ email: "", password: "" });
    const [authError, setAuthError] = useState("");
    const [authLoading, setAuthLoading] = useState(false);

    if (!show) return null;

    const isSignup = type === "signup";
    const title = isSignup ? "Signup" : "Login";
    const buttonText = isSignup ? "Signup" : "Login";
    const loadingText = isSignup ? "Signing up..." : "Logging in...";
    const titleColor = isSignup ? "text-green-900 dark:text-green-100" : "text-blue-900 dark:text-blue-100";
    const buttonColor = isSignup ? "bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700" : "bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setAuthError("");
        setAuthLoading(true);

        try {
            const res = await fetch(`/api/${type}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(authForm),
            });

            if (res.ok) {
                setAuthForm({ email: "", password: "" });
                setAuthError("");
                onSuccess?.();
                onClose();
            } else {
                const data = await res.json();
                setAuthError(data.error || "Failed");
            }
        } catch (error) {
            setAuthError("An error occurred. Please try again.");
        } finally {
            setAuthLoading(false);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setAuthForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <form
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-xs relative flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <button
                    type="button"
                    className="absolute top-3 right-3 text-green-900 dark:text-green-400 hover:text-red-600 dark:hover:text-red-400 text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className={`text-xl font-bold ${titleColor} mb-2`}>{title}</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    value={authForm.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    value={authForm.password}
                    onChange={handleChange}
                    required
                />
                {authError && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{authError}</div>}
                <button
                    type="submit"
                    className={`mt-2 ${buttonColor} text-white font-bold py-2 px-4 rounded-full shadow-lg disabled:opacity-60 transition-colors`}
                    disabled={authLoading}
                >
                    {authLoading ? loadingText : buttonText}
                </button>
            </form>
        </div>
    );
} 