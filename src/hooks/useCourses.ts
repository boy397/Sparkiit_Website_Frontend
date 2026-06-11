import { API_BASE_URL } from "@/lib/api-config";
import { useState, useEffect } from 'react';

const API_BASE = API_BASE_URL + '/api/public';

export interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    instructor: string;
    category: string;
    image: string;
    availableSlots?: {
        date: string;
        time: string;
        capacity: number;
        booked: number;
    }[];
}

export function useCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const TTL = 120_000; // 2 minutes Cache TTL
        try {
            const cached = localStorage.getItem('courses_data');
            const cachedTs = localStorage.getItem('courses_data_ts');
            if (cached && cachedTs) {
                const age = Date.now() - parseInt(cachedTs, 10);
                if (age < TTL) {
                    setCourses(JSON.parse(cached));
                    setLoading(false);
                }
            }
        } catch (e) {
            // Silently ignore localStorage/parse errors
        }

        fetch(`${API_BASE}/courses`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    setCourses(json.data);
                    try {
                        localStorage.setItem('courses_data', JSON.stringify(json.data));
                        localStorage.setItem('courses_data_ts', Date.now().toString());
                    } catch (e) {
                        // ignore localStorage write errors
                    }
                } else {
                    setError(json.message || 'Failed to fetch courses');
                }
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { courses, loading, error };
}
