"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [step, setStep] = useState<"login" | "attendance">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [adminData, setAdminData] = useState<any>(null);
    const router = useRouter();

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (step === "attendance") {
            startCamera();
        }
        return () => stopCamera();
    }, [step]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. You can still skip and enter.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
        }
    };

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

            const data = await res.json();

            if (data.success) {
                setAdminData(data.data);
                setStep("attendance");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err: any) {
            console.error("Login Fetch Error:", err);
            setError(`Connection Error: Could not reach the server.`);
        } finally {
            setLoading(false);
        }
    };

    const captureAndEnter = async (skip: boolean = false) => {
        setLoading(true);
        setError("");
        let photoUrl = "";

        if (!skip && videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                photoUrl = canvas.toDataURL("image/jpeg");
            }
        }

        try {
            // Save attendance
            const attRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/attendance`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminData.token}`
                },
                body: JSON.stringify({ photoUrl, type: "LOGIN" }),
                credentials: "include",
            });

            if (attRes.ok) {
                // Proceed to dashboard
                localStorage.setItem("adminToken", adminData.token);
                localStorage.setItem("adminUser", JSON.stringify(adminData));
                router.push("/admin");
            } else {
                setError("Failed to log attendance. Please try again.");
            }
        } catch (err) {
            console.error("Attendance Error:", err);
            setError("Error logging attendance.");
        } finally {
            setLoading(false);
        }
    };

    if (step === "attendance") {
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
                    maxWidth: 450,
                    padding: 40,
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(168, 224, 62, 0.1)",
                    borderRadius: 24,
                    backdropFilter: "blur(20px)",
                    textAlign: "center"
                }}>
                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Attendance Check</h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 24 }}>Please provide a quick photo for attendance</p>
                    
                    <div style={{ 
                        position: "relative", 
                        width: "100%", 
                        aspectRatio: "4/3", 
                        background: "#000", 
                        borderRadius: 16, 
                        overflow: "hidden",
                        marginBottom: 24,
                        border: "1px solid rgba(255,255,255,0.1)"
                    }}>
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                    </div>

                    {error && <div style={{ color: "#ff4d4d", fontSize: 13, marginBottom: 16 }}>{error}</div>}

                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            onClick={() => captureAndEnter(false)}
                            disabled={loading}
                            style={{
                                flex: 2,
                                padding: "14px",
                                background: "#00875a",
                                border: "none",
                                borderRadius: 12,
                                color: "#ffffff",
                                fontWeight: 700,
                                fontSize: 15,
                                cursor: "pointer",
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? "Processing..." : "Capture & Enter"}
                        </button>
                        <button
                            onClick={() => captureAndEnter(true)}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: "14px",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 12,
                                color: "rgba(255,255,255,0.6)",
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer"
                            }}
                        >
                            Skip
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
