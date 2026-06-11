/**
 * useHomepageData — backward-compatible hook.
 *
 * This now delegates to the shared HomepageDataProvider context so that
 * all 16+ components share a SINGLE fetch instead of each firing their own.
 *
 * All type exports are preserved for backward compatibility.
 */

// Re-export all types from the provider so existing imports still work
export type {
    Project,
    Service,
    HorizontalScrollItem,
    Recognition,
    Brand,
    Testimonial,
    Mentor,
    FAQ,
    BlogItem,
    EventItem,
    SocialLinkItem,
    MenuItem,
    HomepageData,
} from '@/context/HomepageDataProvider';

export { invalidateHomepageCache } from '@/context/HomepageDataProvider';

import { useHomepageContext } from '@/context/HomepageDataProvider';

/**
 * Returns homepage data from the shared context.
 * Drop-in replacement — same { data, loading, error } shape.
 */
export function useHomepageData() {
    return useHomepageContext();
}
