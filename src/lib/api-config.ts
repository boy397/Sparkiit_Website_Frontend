// Centralized API configuration

/**
 * Gets the API base URL dynamically.
 * In production, uses NEXT_PUBLIC_API_URL.
 * In development, if accessed via a local IP (e.g. on mobile), it automatically points to that IP.
 * Otherwise defaults to http://localhost:5000.
 */
const getApiBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // Auto-detect local network IP for mobile testing
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname.startsWith('192.168.')) {
            return `http://${hostname}:5000`;
        }
    }
    
    return "http://localhost:5000";
};

export const API_BASE_URL = getApiBaseUrl();

// Optional helpers for common API paths
export const API_PUBLIC_URL = `${API_BASE_URL}/api/public`;
export const API_ADMIN_URL = `${API_BASE_URL}/api/admin`;
export const API_USER_URL = `${API_BASE_URL}/api`; // Assuming standard user routes are under /api
