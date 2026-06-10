import { API_BASE_URL } from "@/lib/api-config";
import { useState, useEffect } from 'react';

const API_BASE = API_BASE_URL + '/api/public';


export interface Project {
    num: string;
    title: string;
    category: string;
    image: string;
}

export interface Service {
    _id?: string;
    title: string;
    description?: string;
    category?: string;
    link?: string;
    icon?: string;
    thumbnailUrl?: string;
}

export interface HorizontalScrollItem {
    _id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    num: string;
    order: number;
}

export interface Recognition {
    _id: string;
    name: string;
    logoUrl: string;
    link?: string;
    order: number;
}

export interface Brand {
    _id: string;
    name: string;
    logoUrl?: string;
    link?: string;
    order?: number;
}

export interface Testimonial {
    _id: string;
    name: string;
    role: string;
    content: string;
    avatar?: string;
}

export interface Mentor {
    _id: string;
    name: string;
    description: string;
    photo: string;
    order: number;
}

export interface FAQ {
    _id: string;
    question: string;
    answer: string;
    order?: number;
}

export interface BlogItem {
    _id: string;
    title: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    createdAt?: string;
}

export interface EventItem {
    _id: string;
    title: string;
    date?: string;
    description?: string;
    image?: string;
}

export interface SocialLinkItem {
    _id: string;
    platform: string;
    url: string;
    order?: number;
}

export interface MenuItem {
    _id: string;
    label: string;
    href: string;
    order?: number;
}

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
        hero?: {
            word1?: string;
            word2?: string;
            word3?: string;
            tagline?: string;
            ctaText?: string;
            videoThumbnail?: string;
            videoUrl?: string;
        };
        story?: {
            title?: string;
            subtitle?: string;
            description?: string;
        };
        process?: {
            title?: string;
            description?: string;
            step1Title?: string;
            step1Desc?: string;
            step2Title?: string;
            step2Desc?: string;
            step3Title?: string;
            step3Desc?: string;
        };
        site?: {
            logoText?: string;
            footerDesc?: string;
            copyright?: string;
            github?: string;
            twitter?: string;
            linkedin?: string;
            instagram?: string;
        };
        review?: {
            rating?: string;
        };
        testimonials?: {
            title?: string;
            subtitle?: string;
        };
        expertise?: {
            title?: string;
            description?: string;
        };
        insights?: {
            title?: string;
            description?: string;
        };
        mentors?: {
            title?: string;
            subtitle?: string;
        };
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

const normalizeUrls = (data: HomepageData | null): HomepageData | null => {
    if (!data) return data;

    const fixUrl = (url?: string): string => {
        if (!url) return "";
        if (typeof url === 'string' && url.startsWith('/uploads')) {
            return `${API_BASE_URL}${url}`;
        }
        return url;
    };

    const normalizeObject = (obj: any): any => {
        if (!obj) return obj;
        if (typeof obj === 'string') {
            return fixUrl(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map(normalizeObject);
        }
        if (typeof obj === 'object') {
            const newObj: any = {};
            for (const key in obj) {
                newObj[key] = normalizeObject(obj[key]);
            }
            return newObj;
        }
        return obj;
    };

    // Normalize settings values (e.g. siteLogo, siteFavicon) that may start with /uploads
    const normalizedSettings = data.settings ? Object.fromEntries(
        Object.entries(data.settings).map(([key, val]) => [key, typeof val === 'string' ? fixUrl(val) : val])
    ) : data.settings;

    return {
        ...data,
        settings: normalizedSettings,
        brands: data.brands?.map(b => ({
            ...b,
            logoUrl: fixUrl(b.logoUrl)
        })) || [],
        collaborators: data.collaborators?.map(c => ({
            ...c,
            logoUrl: fixUrl(c.logoUrl)
        })) || [],
        recognitions: data.recognitions?.map(r => ({
            ...r,
            logoUrl: fixUrl(r.logoUrl),
            link: fixUrl(r.link)
        })) || [],
        projects: data.projects?.map(p => ({
            ...p,
            image: fixUrl(p.image) || ""
        })) || [],
        services: data.services?.map(s => ({
            ...s,
            thumbnailUrl: fixUrl(s.thumbnailUrl)
        })) || [],
        horizontalScrollItems: data.horizontalScrollItems?.map(h => ({
            ...h,
            image: fixUrl(h.image) || ""
        })) || [],
        mentors: data.mentors?.map(m => ({
            ...m,
            photo: fixUrl(m.photo)
        })) || [],
        testimonials: data.testimonials?.map(t => ({
            ...t,
            avatar: fixUrl(t.avatar)
        })) || [],
        blogs: data.blogs?.map(b => ({
            ...b,
            coverImage: fixUrl(b.coverImage)
        })) || [],
        events: data.events?.map(ev => ({
            ...ev,
            image: fixUrl(ev.image)
        })) || [],
        faqs: data.faqs || [],
        pageStructure: data.pageStructure?.map(s => ({
            ...s,
            content: normalizeObject(s.content)
        })) || []
    };
};

export function invalidateHomepageCache() {
    localStorage.removeItem('homepage_data');
    localStorage.removeItem('homepage_data_ts');
}

export function useHomepageData() {
    const [data, setData] = useState<HomepageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Try to load from cache first (only if less than 2 min old)
        const cached = localStorage.getItem('homepage_data');
        const cachedTs = localStorage.getItem('homepage_data_ts');
        const cacheAge = cachedTs ? Date.now() - parseInt(cachedTs, 10) : Infinity;

        if (cached && cacheAge < 120_000) {
            try {
                setData(normalizeUrls(JSON.parse(cached)));
                setLoading(false);
            } catch (e) {
                console.error("Failed to parse cached homepage data", e);
            }
        }

        fetch(`${API_BASE}/homepage`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    const normalized = normalizeUrls(json.data);
                    setData(normalized);
                    // Store raw data (before normalization) to avoid double-normalizing on cache read
                    try {
                        localStorage.setItem('homepage_data', JSON.stringify(json.data));
                        localStorage.setItem('homepage_data_ts', Date.now().toString());
                    } catch (storageErr) {
                        console.warn("Failed to cache homepage data to localStorage (possibly exceeded quota):", storageErr);
                    }
                } else {
                    setError(json.message);
                }
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { data, loading, error };
}
