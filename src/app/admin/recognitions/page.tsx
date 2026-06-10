"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect, useCallback } from "react";

const API_BASE = API_BASE_URL + "/api/admin";

interface Recognition {
    _id: string;
    name: string;
    logoUrl: string;
    link: string;
    order: number;
}

export default function RecognitionsPage() {
    const [items, setItems] = useState<Recognition[]>([]);
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

    const [uploadingPdf, setUploadingPdf] = useState(false);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("image", file);
        formData.append("uploadType", "recognitions");

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

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPdf(true);
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("uploadType", "documents");

        const token = localStorage.getItem("adminToken");

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/upload-pdf`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            const json = await res.json();
            if (json.success) {
                setForm(prev => ({ ...prev, link: `${API_BASE_URL}${json.data.url}` }));
            } else {
                alert(json.message || "Upload failed");
            }
        } catch (err) {
            console.error("PDF upload error:", err);
            alert("An error occurred while uploading the PDF.");
        } finally {
            setUploadingPdf(false);
        }
    };

    const fetchItems = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/recognitions`, {
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
        const url = editingId ? `${API_BASE}/recognitions/${editingId}` : `${API_BASE}/recognitions`;
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
        await fetch(`${API_BASE}/recognitions/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchItems();
    };

    const openEdit = (item: Recognition) => {
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
                <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Recognised By Management</h1>
                <button 
                    onClick={openCreate}
                    className="bg-[#00875a] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#006644] transition-colors"
                >
                    Add Recognition
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
                                    <img src={item.logoUrl} alt={item.name} className="h-8 object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
                                ) : (
                                    <div className="h-8 min-w-[40px] flex items-center justify-center text-sm font-black text-white/20 uppercase">
                                        {item.name}
                                    </div>
                                )}
                                <div className="ml-auto">
                                    <h3 className="text-white/50 text-xs font-bold uppercase">{item.name}</h3>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
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
                            {editingId ? "Edit Recognition" : "Add Recognition"}
                        </h2>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Publication Name</label>
                        <input 
                            style={inputStyle}
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                            placeholder="e.g. Times of India"
                        />
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Logo URL (Transparent PNG Best)</label>
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
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Article Link (Optional)</label>
                        <input 
                            style={inputStyle}
                            value={form.link}
                            onChange={e => setForm({...form, link: e.target.value})}
                            placeholder="https://news-site.com/article"
                        />
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Upload Verification PDF</label>
                        <div className="flex items-center gap-4 mb-4">
                            <label className="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all rounded-lg p-3 text-center text-sm text-white/80 hover:text-white font-medium flex items-center justify-center gap-2">
                                {uploadingPdf ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Uploading PDF...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 text-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Upload Verification PDF
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    accept="application/pdf" 
                                    className="hidden" 
                                    onChange={handlePdfUpload}
                                    disabled={uploadingPdf}
                                />
                            </label>
                            {form.link && form.link.endsWith(".pdf") && (
                                <div className="text-[10px] bg-[#00875a]/20 border border-[#00875a]/30 text-[#00875a] px-3 py-2 rounded-lg font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    PDF Attached
                                </div>
                            )}
                        </div>
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
