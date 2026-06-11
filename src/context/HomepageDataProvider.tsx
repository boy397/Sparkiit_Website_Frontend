"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api-config";

// ─── Types (re-exported from useHomepageData for compatibility) ─────────────

export interface Project { num: string; title: string; category: string; image: string; }
export interface Service { _id?: string; title: string; description?: string; category?: string; link?: string; icon?: string; thumbnailUrl?: string; }
export interface HorizontalScrollItem { _id: string; title: string; description: string; category: string; image: string; num: string; order: number; }
export interface Recognition { _id: string; name: string; logoUrl: string; link?: string; order: number; }
export interface Brand { _id: string; name: string; logoUrl?: string; link?: string; order?: number; }
export interface Testimonial { _id: string; name: string; role: string; content: string; avatar?: string; }
export interface Mentor { _id: string; name: string; description: string; photo: string; order: number; }
export interface FAQ { _id: string; question: string; answer: string; order?: number; }
export interface BlogItem { _id: string; title: string; slug?: string; content?: string; excerpt?: string; coverImage?: string; createdAt?: string; }
export interface EventItem { _id: string; title: string; date?: string; description?: string; image?: string; }
export interface SocialLinkItem { _id: string; platform: string; url: string; order?: number; }
export interface MenuItem { _id: string; label: string; href: string; order?: number; }

export interface HomepageData {
    projects: Project[];
    services: Service[];
    horizontalScrollItems: HorizontalScrollItem[];
    testimonials?: Testimonial[];
    recognitions?: Recognition[];
    brands?: Brand[];
    collaborators?: Brand[];
    mentors?: Mentor[];
    faqs?: FAQ[];
    blogs?: BlogItem[];
    events?: EventItem[];
    socialLinks?: SocialLinkItem[];
    menus?: MenuItem[];
    footerSettings?: any[];
    content: {
        hero?: { word1?: string; word2?: string; word3?: string; tagline?: string; ctaText?: string; videoThumbnail?: string; videoUrl?: string; };
        story?: { title?: string; subtitle?: string; description?: string; };
        process?: { title?: string; description?: string; step1Title?: string; step1Desc?: string; step2Title?: string; step2Desc?: string; step3Title?: string; step3Desc?: string; };
        site?: { logoText?: string; footerDesc?: string; copyright?: string; github?: string; twitter?: string; linkedin?: string; instagram?: string; };
        review?: { rating?: string; };
        testimonials?: { title?: string; subtitle?: string; };
        expertise?: { title?: string; description?: string; };
        insights?: { title?: string; description?: string; };
        mentors?: { title?: string; subtitle?: string; };
        [key: string]: any;
    };
    settings?: {
        contact_email?: string;
        contact_phone?: string;
        contact_address?: string;
        slot_booking_url?: string;
        full_registration_url?: string;
        [key: string]: string | number | boolean | null | undefined | object;
    };
    pageStructure: {
        name: string;
        enabled: boolean;
        order: number;
        content?: any;
    }[];
}

// ─── URL normalization ───────────────────────────────────────────────────────

const fixUrl = (url?: string): string => {
    if (!url) return "";
    if (typeof url === 'string' && url.startsWith('/uploads')) {
        return `${API_BASE_URL}${url}`;
    }
    return url;
};

const normalizeObject = (obj: any): any => {
    if (!obj) return obj;
    if (typeof obj === 'string') return fixUrl(obj);
    if (Array.isArray(obj)) return obj.map(normalizeObject);
    if (typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
            newObj[key] = normalizeObject(obj[key]);
        }
        return newObj;
    }
    return obj;
};

const normalizeUrls = (data: HomepageData | null): HomepageData | null => {
    if (!data) return data;

    const normalizedSettings = data.settings ? Object.fromEntries(
        Object.entries(data.settings).map(([key, val]) => [key, typeof val === 'string' ? fixUrl(val) : val])
    ) : data.settings;

    return {
        ...data,
        settings: normalizedSettings,
        brands: data.brands?.map(b => ({ ...b, logoUrl: fixUrl(b.logoUrl) })) || [],
        collaborators: data.collaborators?.map(c => ({ ...c, logoUrl: fixUrl(c.logoUrl) })) || [],
        recognitions: data.recognitions?.map(r => ({ ...r, logoUrl: fixUrl(r.logoUrl), link: fixUrl(r.link) })) || [],
        projects: data.projects?.map(p => ({ ...p, image: fixUrl(p.image) || "" })) || [],
        services: data.services?.map(s => ({ ...s, thumbnailUrl: fixUrl(s.thumbnailUrl) })) || [],
        horizontalScrollItems: data.horizontalScrollItems?.map(h => ({ ...h, image: fixUrl(h.image) || "" })) || [],
        mentors: data.mentors?.map(m => ({ ...m, photo: fixUrl(m.photo) })) || [],
        testimonials: data.testimonials?.map(t => ({ ...t, avatar: fixUrl(t.avatar) })) || [],
        blogs: data.blogs?.map(b => ({ ...b, coverImage: fixUrl(b.coverImage) })) || [],
        events: data.events?.map(ev => ({ ...ev, image: fixUrl(ev.image) })) || [],
        faqs: data.faqs || [],
        pageStructure: data.pageStructure?.map(s => ({ ...s, content: normalizeObject(s.content) })) || []
    };
};

// ─── Cache helpers (stores RAW data, normalizes on read) ─────────────────────

const CACHE_KEY = 'homepage_data_v2';
const CACHE_TS_KEY = 'homepage_data_v2_ts';
const CACHE_TTL = 120_000; // 2 minutes

function readCache(): HomepageData | null {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedTs = localStorage.getItem(CACHE_TS_KEY);
        if (!cached || !cachedTs) return null;
        const age = Date.now() - parseInt(cachedTs, 10);
        if (age > CACHE_TTL) return null;
        const raw = JSON.parse(cached);
        return normalizeUrls(raw);
    } catch {
        return null;
    }
}

function writeCache(rawData: any): void {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(rawData));
        localStorage.setItem(CACHE_TS_KEY, Date.now().toString());
    } catch (e) {
        // Silently fail — localStorage may be full or unavailable (Safari private)
    }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface HomepageContextType {
    data: HomepageData | null;
    loading: boolean;
    error: string | null;
}

const HomepageDataContext = createContext<HomepageContextType>({
    data: null,
    loading: true,
    error: null,
});

const API_BASE = API_BASE_URL + '/api/public';

export function HomepageDataProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<HomepageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchedRef = useRef(false);

    useEffect(() => {
        // Prevent double-fetch in StrictMode
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        // 1. Try cache for instant first paint
        const cached = readCache();
        if (cached) {
            setData(cached);
            setLoading(false);
        }

        // 2. Always fetch fresh data in background (SWR pattern)
        const controller = new AbortController();

        fetch(`${API_BASE}/homepage`, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(json => {
                if (json.success) {
                    const normalized = normalizeUrls(json.data);
                    setData(normalized);
                    writeCache(json.data); // Store RAW data to avoid double-normalization
                } else {
                    setError(json.message || 'Failed to load homepage data');
                }
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <HomepageDataContext.Provider value={{ data, loading, error }}>
            {children}
        </HomepageDataContext.Provider>
    );
}

/**
 * Hook to consume shared homepage data.
 * Must be used within HomepageDataProvider.
 * API-compatible with the old useHomepageData() hook.
 */
export function useHomepageContext() {
    return useContext(HomepageDataContext);
}

/**
 * Invalidate the homepage data cache.
 */
export function invalidateHomepageCache() {
    try {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TS_KEY);
        // Also clear the old cache keys
        localStorage.removeItem('homepage_data');
        localStorage.removeItem('homepage_data_ts');
    } catch {
        // ignore
    }
}
