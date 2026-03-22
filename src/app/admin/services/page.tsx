"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Edit2, Save, X, Activity } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";


interface Service {
    _id: string;
    title: string;
    order: number;
}

export default function ServiceManagement() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/services`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setServices(data.data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const isNew = !editingService?._id;
            const url = isNew ? `${API_BASE}/services` : `${API_BASE}/services/${editingService?._id}`;
            const method = isNew ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editingService)
            });

            const data = await res.json();
            if (data.success) {
                fetchServices();
                setEditingService(null);
            }
        } catch (error) {
            console.error("Error saving service:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/services/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchServices();
            }
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-[#00875a]" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Manage Services</h2>
                    <p className="text-white/40">Define the expertise areas displayed on the site.</p>
                </div>
                <button 
                    onClick={() => setEditingService({ title: "", order: services.length + 1 })}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00875a] text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus size={20} />
                    Add Service
                </button>
            </div>

            <div className="space-y-4">
                {services.map((service) => (
                    <div key={service._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:bg-white/8 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#00875a] group-hover:bg-[#00875a]/10 transition-all">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{service.title}</h3>
                                <p className="text-xs text-white/30 font-mono uppercase tracking-widest mt-1">Order Index: {service.order}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setEditingService(service)}
                                className="p-3 bg-white/10 hover:bg-[#00875a] hover:text-white rounded-xl transition-all"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(service._id)}
                                className="p-3 bg-white/10 hover:bg-red-500 rounded-xl transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingService && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">{editingService._id ? 'Edit Service' : 'New Service'}</h3>
                            <button onClick={() => setEditingService(null)} className="text-white/40 hover:text-white"><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Service Title</label>
                                <input 
                                    type="text" 
                                    value={editingService.title}
                                    onChange={e => setEditingService({...editingService, title: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#00875a]/40"
                                    placeholder="UI/UX Strategy"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Display Order</label>
                                <input 
                                    type="number" 
                                    value={editingService.order}
                                    onChange={e => setEditingService({...editingService, order: parseInt(e.target.value)})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#00875a]/40"
                                />
                            </div>
                        </div>
                        <div className="p-8 bg-white/2 flex justify-end gap-4">
                            <button 
                                onClick={() => setEditingService(null)}
                                className="px-6 py-2 rounded-xl text-white/60 hover:text-white transition-all font-bold"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-2 rounded-xl bg-[#00875a] text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Service
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
