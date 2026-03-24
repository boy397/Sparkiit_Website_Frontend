"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect } from "react";
import { 
    Plus, Search, Edit2, Trash2, Save, X, 
    Monitor, Loader2, CheckCircle2, AlertCircle, ArrowRight
} from "lucide-react";

const API_BASE = API_BASE_URL + "/api/admin";

interface Service {
    _id: string;
    title: string;
    description: string;
    link: string;
    order: number;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);
    
    // Modal/Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentService, setCurrentService] = useState({ 
        title: "", 
        description: "", 
        link: "", 
        order: 0 
    });

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
            if (data.success) setServices(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus(null);
        
        try {
            const token = localStorage.getItem("adminToken");
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_BASE}/services/${editingId}` : `${API_BASE}/services`;
            
            const res = await fetch(url, {
                method,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(currentService)
            });
            
            const data = await res.json();
            if (data.success) {
                setStatus({ type: 'success', msg: `Service ${editingId ? 'updated' : 'created'} successfully` });
                fetchServices();
                setTimeout(() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    setCurrentService({ title: "", description: "", link: "", order: 0 });
                    setStatus(null);
                }, 1500);
            } else {
                throw new Error(data.message);
            }
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.message || "Something went wrong" });
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
                setServices(services.filter(s => s._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (service: Service) => {
        setEditingId(service._id);
        setCurrentService({ 
            title: service.title, 
            description: service.description || "", 
            link: service.link || "", 
            order: service.order || 0 
        });
        setIsFormOpen(true);
    };

    const filteredServices = services.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <Loader2 className="animate-spin" size={32} color="#00875a" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 0" }}>
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-end", 
                marginBottom: 32,
                gap: 20,
                flexWrap: "wrap"
            }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8 }}>MANAGE <span style={{ color: "#00875a" }}>SERVICES</span></h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Configure the expertise cards shown on your home page.</p>
                </div>
                
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 10, 
                        background: "rgba(255,255,255,0.03)", 
                        border: "1px solid rgba(255,255,255,0.06)",
                        padding: "8px 16px",
                        borderRadius: 12,
                        minWidth: 260
                    }}>
                        <Search size={18} color="rgba(255,255,255,0.3)" />
                        <input 
                            type="text" 
                            placeholder="Search services..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                background: "none", 
                                border: "none", 
                                color: "#fff", 
                                fontSize: 14, 
                                outline: "none",
                                width: "100%" 
                            }} 
                        />
                    </div>
                    
                    <button 
                        onClick={() => {
                            setEditingId(null);
                            setCurrentService({ title: "", description: "", link: "", order: services.length });
                            setIsFormOpen(true);
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 20px",
                            borderRadius: 12,
                            background: "#00875a",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 700,
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                    >
                        <Plus size={18} />
                        Add Service
                    </button>
                </div>
            </div>

            {/* Grid View */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                gap: 24 
            }}>
                {filteredServices.length === 0 ? (
                    <div style={{ 
                        gridColumn: "1 / -1",
                        textAlign: "center", 
                        padding: "80px 20px", 
                        borderRadius: 24, 
                        background: "rgba(255,255,255,0.02)",
                        border: "1px dashed rgba(255,255,255,0.1)"
                    }}>
                        <Monitor size={48} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 16px" }} />
                        <p style={{ color: "rgba(255,255,255,0.3)" }}>No services found. Add your first service card!</p>
                    </div>
                ) : (
                    filteredServices.map(service => (
                        <div key={service._id} style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 20,
                            padding: 24,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: 20,
                            transition: "transform 0.2s ease, border-color 0.2s ease",
                            position: "relative"
                        }}>
                            <div style={{ position: "absolute", top: 12, left: 12, fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 800 }}>
                                #{service.order}
                            </div>
                            
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                                    {service.title}
                                    <ArrowRight size={16} color="#00875a" />
                                </h3>
                                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 16 }}>
                                    {service.description || "No description provided."}
                                </p>
                                {service.link && (
                                    <div style={{ fontSize: 12, color: "#00875a", fontWeight: 600 }}>
                                        URL: {service.link}
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ 
                                display: "flex", 
                                gap: 8, 
                                borderTop: "1px solid rgba(255,255,255,0.05)", 
                                paddingTop: 16 
                            }}>
                                <button 
                                    onClick={() => startEdit(service)}
                                    style={{
                                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                        padding: "8px", borderRadius: 10, border: "none",
                                        background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)",
                                        fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,135,90,0.1)"; e.currentTarget.style.color = "#00875a"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(service._id)}
                                    style={{
                                        padding: "8px 12px", borderRadius: 10, border: "none",
                                        background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)",
                                        cursor: "pointer", transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Form Overlay */}
            {isFormOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 1000, padding: 20
                }}>
                    <form 
                        onSubmit={handleSave}
                        style={{
                            width: "100%", maxWidth: 600,
                            background: "#111", border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 24, padding: 40, position: "relative",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
                        }}
                    >
                        <button 
                            type="button" 
                            onClick={() => setIsFormOpen(false)}
                            style={{ 
                                position: "absolute", top: 24, right: 24, 
                                background: "none", border: "none", color: "rgba(255,255,255,0.3)", 
                                cursor: "pointer" 
                            }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 32 }}>
                            {editingId ? "Edit" : "Add"} <span style={{ color: "#00875a" }}>Service Card</span>
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 16 }}>
                                <InputField label="Title" value={currentService.title} onChange={(val: string) => setCurrentService({...currentService, title: val})} placeholder="Application Development" />
                                <InputField label="Order" value={currentService.order.toString()} onChange={(val: string) => setCurrentService({...currentService, order: parseInt(val) || 0})} placeholder="0" />
                            </div>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>Description</label>
                                <textarea 
                                    required
                                    rows={3}
                                    value={currentService.description}
                                    onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                                    placeholder="Brief summary of the expertise..."
                                    style={{
                                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none",
                                        resize: "none"
                                    }}
                                />
                            </div>

                            <InputField label="Link URL" value={currentService.link} onChange={(val: string) => setCurrentService({...currentService, link: val})} placeholder="/services/app-dev" />
                        </div>

                        <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            {status && (
                                <div style={{ 
                                    display: "flex", alignItems: "center", gap: 8, 
                                    color: status.type === 'success' ? '#10b981' : '#ef4444',
                                    fontSize: 14, fontWeight: 500
                                }}>
                                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    {status.msg}
                                </div>
                            )}
                            <div style={{ flex: 1 }} />
                            <div style={{ display: "flex", gap: 12 }}>
                                <button 
                                    type="button" 
                                    onClick={() => setIsFormOpen(false)}
                                    style={{
                                        padding: "12px 24px", borderRadius: 12,
                                        background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)",
                                        fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer"
                                    }}
                                >Cancel</button>
                                <button 
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 10,
                                        padding: "12px 28px", borderRadius: 12,
                                        background: "#00875a", color: "#fff",
                                        fontSize: 14, fontWeight: 700, border: "none",
                                        cursor: saving ? "not-allowed" : "pointer",
                                        opacity: saving ? 0.7 : 1,
                                        boxShadow: "0 10px 20px rgba(0,135,90,0.3)"
                                    }}
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {editingId ? "Update" : "Save"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <style jsx global>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}

function InputField({ label, value, onChange, placeholder }: any) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    color: "#fff",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "#00875a"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
        </div>
    );
}
