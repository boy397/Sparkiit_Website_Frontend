import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api/public';

export interface Project {
    num: string;
    title: string;
    category: string;
    image: string;
}

export interface Service {
    title: string;
}

export interface Recognition {
    num: string;
    title?: string;
    category?: string;
    image: string;
}

export interface Testimonial {
    _id: string;
    name: string;
    role: string;
    content: string;
    avatar?: string;
}

export interface HomepageData {
    projects: Project[];
    services: Service[];
    testimonials?: Testimonial[];
    recognitions?: Recognition[];
    content: {
        hero?: {
            word1?: string;
            word2?: string;
            word3?: string;
            tagline?: string;
            ctaText?: string;
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
    };
}

export function useHomepageData() {
    const [data, setData] = useState<HomepageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API_BASE}/homepage`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    setData(json.data);
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
