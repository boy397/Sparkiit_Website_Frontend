"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!res.ok && res.status !== 401 && res.status !== 403) {
                // Server error or deployment issue (not an auth error)
                console.error("Server Error:", res.status, res.statusText);
                setError(`Server error (${res.status}). The backend may not be running.`);
                return;
            }

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("adminToken", data.data.token);
                localStorage.setItem("adminUser", JSON.stringify(data.data));
                router.push("/admin");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err: any) {
            console.error("Login Fetch Error:", err);
            setError(`Connection Error: Could not reach the server. Please check if the backend is deployed correctly.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#050505",
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                width: "100%",
                maxWidth: 400,
                padding: 40,
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(168, 224, 62, 0.1)",
                borderRadius: 24,
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
            }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: "linear-gradient(135deg, #00875a 0%, #006644 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 20,
                        color: "#ffffff",
                        margin: "0 auto 16px"
                    }}>
                        S
                    </div>
                    <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>SparkIIT CRM</h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 8 }}>Please sign in to continue</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                        <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 12,
                                color: "#fff",
                                fontSize: 15,
                                outline: "none",
                                transition: "all 0.2s"
                            }}
                            placeholder="admin@sparkiit.com"
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 12,
                                color: "#fff",
                                fontSize: 15,
                                outline: "none",
                                transition: "all 0.2s"
                            }}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <div style={{ color: "#ff4d4d", fontSize: 13, textAlign: "center" }}>{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: "#00875a",
                            border: "none",
                            borderRadius: 12,
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: 15,
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            marginTop: 10,
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
