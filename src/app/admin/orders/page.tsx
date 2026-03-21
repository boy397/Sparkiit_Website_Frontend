"use client";

import React, { useState, useEffect, useCallback } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";


interface Order {
    _id: string;
    candidate: any;
    course: any;
    amount: number;
    currency: string;
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id?: string;
    createdAt: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/orders`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((d) => { setOrders(d.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Manage Orders</h1>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading orders...</div>
                ) : !orders.length ? (
                    <div style={{ padding: 60, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No orders found</div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                {["Order ID", "Candidate", "Course", "Amount", "Status", "Date"].map((h) => (
                                    <th key={h} style={{ padding: "14px 20px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                    <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{order.razorpay_order_id}</td>
                                    <td style={{ padding: "14px 20px", fontWeight: 500, color: "#fff" }}>{order.candidate?.name || order.candidate}</td>
                                    <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.6)" }}>{order.course?.title || "N/A"}</td>
                                    <td style={{ padding: "14px 20px", color: "#a8e03e", fontWeight: 600 }}>₹{order.amount}</td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={{ 
                                            padding: "4px 10px", 
                                            borderRadius: 20, 
                                            fontSize: 10, 
                                            fontWeight: 700,
                                            background: order.status === "success" ? "rgba(168,224,62,0.1)" : "rgba(255,255,255,0.05)",
                                            color: order.status === "success" ? "#a8e03e" : "rgba(255,255,255,0.4)"
                                        }}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}