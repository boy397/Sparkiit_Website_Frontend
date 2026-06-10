"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect, useCallback } from "react";

const API_BASE = API_BASE_URL + "/api/admin";

interface Brand {
    _id: string;
    name: string;
    logoUrl: string;
    link: string;
    order: number;
}

export default function BrandsPage() {
    const [items, setItems] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    const [form, setForm] = useState({
        name: "",
        logoUrl: "",
        link: "",
        order: 0
    });

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("image", file);
        formData.append("uploadType", "brands");

        const token = localStorage.getItem("adminToken");

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/upload-image`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            const json = await res.json();
            if (json.success) {
                setForm(prev => ({ ...prev, logoUrl: `${API_BASE_URL}${json.data.url}` }));
            } else {
                alert(json.message || "Upload failed");
            }
        } catch (err) {
            console.error("Logo upload error:", err);
            alert("An error occurred while uploading the logo.");
        } finally {
            setUploading(false);
        }
    };

    const fetchItems = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/brands`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(json => {
            if (json.success) setItems(json.data || []);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const handleSave = async () => {
        setSaving(true);
        const url = editingId ? `${API_BASE}/brands/${editingId}` : `${API_BASE}/brands`;
        const method = editingId ? "PUT" : "POST";
        const token = localStorage.getItem("adminToken");

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const json = await res.json();
            if (json.success) {
                setIsFormOpen(false);
                fetchItems();
            }
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/brands/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchItems();
    };

    const openEdit = (item: Brand) => {
        setEditingId(item._id);
        setForm({
            name: item.name,
            logoUrl: item.logoUrl || "",
            link: item.link || "",
            order: item.order || 0
        });
        setIsFormOpen(true);
    };

    const openCreate = () => {
        setEditingId(null);
        setForm({ name: "", logoUrl: "", link: "", order: items.length });
        setIsFormOpen(true);
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        background: "#1a1a1a",
        border: "1px solid #333",
        color: "white",
        marginBottom: "16px"
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Featured In Management</h1>
                <button 
                    onClick={openCreate}
                    className="bg-[#00875a] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#006644] transition-colors"
                >
                    Add Company
                </button>
            </div>

            {loading ? (
                <div className="text-white/50">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item._id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                {item.logoUrl ? (
                                    <img src={item.logoUrl} alt={item.name} className="w-12 h-12 rounded-lg object-contain bg-white/10 p-2" />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-[#00875a]/20 flex items-center justify-center text-xl font-bold text-[#00875a]">
                                        {item.name[0]}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-white font-bold">{item.name}</h3>
                                    {item.link && <p className="text-xs text-white/30 truncate max-w-[150px]">{item.link}</p>}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button onClick={() => openEdit(item)} className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 py-2 rounded-lg text-sm transition-colors">Edit</button>
                                <button onClick={() => handleDelete(item._id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-lg transition-colors">
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-[#141414] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">
                            {editingId ? "Edit Company" : "Add Company"}
                        </h2>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Company Name</label>
                        <input 
                            style={inputStyle}
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                            placeholder="e.g. Google"
                        />
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Logo URL</label>
                        <input 
                            style={inputStyle}
                            value={form.logoUrl}
                            onChange={e => setForm({...form, logoUrl: e.target.value})}
                            placeholder="https://company.com/logo.png"
                        />
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Upload Logo</label>
                        <div className="flex items-center gap-4 mb-4">
                            <label className="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all rounded-lg p-3 text-center text-sm text-white/80 hover:text-white font-medium flex items-center justify-center gap-2">
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 text-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Upload Logo File
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleLogoUpload}
                                    disabled={uploading}
                                />
                            </label>
                            {form.logoUrl && (
                                <div className="w-12 h-12 rounded-lg bg-white/10 p-2 flex items-center justify-center border border-white/10 shrink-0">
                                    <img src={form.logoUrl} alt="Preview" className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Website Link (Optional)</label>
                        <input 
                            style={inputStyle}
                            value={form.link}
                            onChange={e => setForm({...form, link: e.target.value})}
                            placeholder="https://company.com"
                        />
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Order Index</label>
                        <input 
                            style={inputStyle}
                            type="number"
                            value={form.order}
                            onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})}
                        />
                        <div className="flex gap-4 mt-4">
                            <button 
                                onClick={() => setIsFormOpen(false)}
                                className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 px-6 py-3 rounded-xl bg-[#00875a] text-white font-bold hover:bg-[#006644] transition-all disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}