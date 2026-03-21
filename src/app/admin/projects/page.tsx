"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Edit2, Save, X, Image as ImageIcon } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";


interface Project {
    _id: string;
    num: string;
    title: string;
    category: string;
    image: string;
    order: number;
}

export default function ProjectManagement() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/projects`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setProjects(data.data);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const isNew = !editingProject?._id;
            const url = isNew ? `${API_BASE}/projects` : `${API_BASE}/projects/${editingProject?._id}`;
            const method = isNew ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editingProject)
            });

            const data = await res.json();
            if (data.success) {
                fetchProjects();
                setEditingProject(null);
            }
        } catch (error) {
            console.error("Error saving project:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/projects/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchProjects();
            }
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-[#a8e03e]" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Manage Projects</h2>
                    <p className="text-white/40">Add, edit or remove projects from the showcase.</p>
                </div>
                <button 
                    onClick={() => setEditingProject({ num: "", title: "", category: "", image: "", order: projects.length + 1 })}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#a8e03e] text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus size={20} />
                    Add Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group">
                        <div className="h-48 relative bg-white/5">
                            {project.image ? (
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/10">
                                    <ImageIcon size={48} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button 
                                    onClick={() => setEditingProject(project)}
                                    className="p-3 bg-white/10 hover:bg-[#a8e03e] hover:text-black rounded-full transition-all"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(project._id)}
                                    className="p-3 bg-white/10 hover:bg-red-500 rounded-full transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-[#a8e03e] text-xs font-bold tracking-widest uppercase mb-1">{project.category}</p>
                            <h3 className="text-lg font-bold text-white mb-4">{project.title}</h3>
                            <div className="flex justify-between items-center text-xs text-white/40 font-mono">
                                <span>#{project.num}</span>
                                <span>Order: {project.order}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">{editingProject._id ? 'Edit Project' : 'New Project'}</h3>
                            <button onClick={() => setEditingProject(null)} className="text-white/40 hover:text-white"><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Number</label>
                                    <input 
                                        type="text" 
                                        value={editingProject.num}
                                        onChange={e => setEditingProject({...editingProject, num: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#a8e03e]/40"
                                        placeholder="01"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Order</label>
                                    <input 
                                        type="number" 
                                        value={editingProject.order}
                                        onChange={e => setEditingProject({...editingProject, order: parseInt(e.target.value)})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#a8e03e]/40"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Title</label>
                                <input 
                                    type="text" 
                                    value={editingProject.title}
                                    onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#a8e03e]/40"
                                    placeholder="Project Title"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Category</label>
                                <input 
                                    type="text" 
                                    value={editingProject.category}
                                    onChange={e => setEditingProject({...editingProject, category: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#a8e03e]/40"
                                    placeholder="WEB3 / BLOCKCHAIN"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Image URL</label>
                                <input 
                                    type="text" 
                                    value={editingProject.image}
                                    onChange={e => setEditingProject({...editingProject, image: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#a8e03e]/40"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>
                        </div>
                        <div className="p-8 bg-white/2 flex justify-end gap-4">
                            <button 
                                onClick={() => setEditingProject(null)}
                                className="px-6 py-2 rounded-xl text-white/60 hover:text-white transition-all font-bold"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-2 rounded-xl bg-[#a8e03e] text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
