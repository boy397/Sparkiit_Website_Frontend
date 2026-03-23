"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Trash2, Camera, User, Clock, Globe } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";

interface AttendanceRecord {
    _id: string;
    user: {
        username: string;
        email: string;
    };
    photoUrl?: string;
    timestamp: string;
    type: string;
    ip?: string;
}

export default function AttendancePage() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    const fetchRecords = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${API_BASE}/attendance`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setRecords(data.data);
            } else {
                setError(data.message || "Failed to fetch records");
            }
        } catch (err) {
            setError("Connection error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this attendance record?")) return;
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${API_BASE}/attendance/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setRecords(prev => prev.filter(r => r._id !== id));
            } else {
                alert(data.message || "Failed to delete record");
            }
        } catch (err) {
            alert("Error deleting record");
        }
    };

    if (loading && records.length === 0) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px", color: "rgba(255,255,255,0.4)" }}>
                Loading records...
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: 80 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>Attendance Logs</h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 4 }}>Monitor admin CMS login activity and captures</p>
                </div>
                <button 
                    onClick={fetchRecords}
                    style={{
                        padding: "10px 18px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer"
                    }}
                >
                    Refresh
                </button>
            </div>

            {error && <div style={{ color: "#ff4d4d", background: "rgba(255,77,77,0.1)", padding: "12px 16px", borderRadius: 12, marginBottom: 24 }}>{error}</div>}

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <th style={tableHeaderStyle}>User</th>
                            <th style={tableHeaderStyle}>Capture</th>
                            <th style={tableHeaderStyle}>Timestamp</th>
                            <th style={tableHeaderStyle}>IP Address</th>
                            <th style={{ ...tableHeaderStyle, textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                <td style={tableCellStyle}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,135,90,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00875a" }}>
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <div style={{ color: "#fff", fontWeight: 500, fontSize: 14 }}>{record.user?.username || "Unknown"}</div>
                                            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{record.user?.email || "N/A"}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={tableCellStyle}>
                                    {record.photoUrl ? (
                                        <div 
                                            onClick={() => setSelectedPhoto(record.photoUrl!)}
                                            style={{ cursor: "pointer", width: 48, height: 36, borderRadius: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", position: "relative" }}
                                        >
                                            <img src={record.photoUrl} alt="Attendance" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }} onMouseOver={(e) => e.currentTarget.style.opacity = "1"} onMouseOut={(e) => e.currentTarget.style.opacity = "0"}>
                                                <Camera size={14} color="#fff" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 4 }}>
                                            <Camera size={12} />
                                            Skipped
                                        </div>
                                    )}
                                </td>
                                <td style={tableCellStyle}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                                        <Clock size={14} />
                                        {new Date(record.timestamp).toLocaleString()}
                                    </div>
                                </td>
                                <td style={tableCellStyle}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
                                        <Globe size={14} />
                                        {record.ip || "Unknown"}
                                    </div>
                                </td>
                                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                                    <button 
                                        onClick={() => handleDelete(record._id)}
                                        style={{ color: "rgba(248,113,113,0.5)", background: "none", border: "none", cursor: "pointer", transition: "all 0.2s" }}
                                        onMouseOver={(e) => e.currentTarget.style.color = "#f87171"}
                                        onMouseOut={(e) => e.currentTarget.style.color = "rgba(248,113,113,0.5)"}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {records.length === 0 && (
                    <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>
                        No attendance records found
                    </div>
                )}
            </div>

            {/* Photo Modal */}
            {selectedPhoto && (
                <div 
                    onClick={() => setSelectedPhoto(null)}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 40 }}
                >
                    <div style={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }} onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={selectedPhoto} 
                            alt="Full Attendance" 
                            style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)" }} 
                        />
                        <button 
                            onClick={() => setSelectedPhoto(null)}
                            style={{ position: "absolute", top: -40, right: 0, background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const tableHeaderStyle: React.CSSProperties = {
    padding: "16px 20px",
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    textAlign: "left",
    fontWeight: 600,
    letterSpacing: "0.05em"
};

const tableCellStyle: React.CSSProperties = {
    padding: "16px 20px",
    verticalAlign: "middle"
};
