import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const usePageViewTracker = () => {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const pagePath = window.location.pathname;
        const referrer = document.referrer || null;
        const userAgent = navigator.userAgent || null;

        await supabase.from('page_views').insert({
          page_path: pagePath,
          referrer: referrer,
          user_agent: userAgent,
        });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, []);
};
