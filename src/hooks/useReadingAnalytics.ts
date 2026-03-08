import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ReadingAnalytics {
  lastPageRead: number;
  totalPages: number;
  pagesRead: number;
  completionPercent: number;
  totalReadingTimeSeconds: number;
}

export function useReadingAnalytics(productSlug: string, productId?: string) {
  const [analytics, setAnalytics] = useState<ReadingAnalytics | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const sessionStartRef = useRef<number>(Date.now());
  const maxPageRef = useRef(0);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // Load existing analytics
  useEffect(() => {
    if (!userId || !productSlug) return;
    (async () => {
      const { data } = await supabase
        .from("reading_analytics" as any)
        .select("*")
        .eq("user_id", userId)
        .eq("product_slug", productSlug)
        .maybeSingle();
      if (data) {
        const d = data as any;
        setAnalytics({
          lastPageRead: d.last_page_read,
          totalPages: d.total_pages,
          pagesRead: d.pages_read,
          completionPercent: d.completion_percent,
          totalReadingTimeSeconds: d.total_reading_time_seconds,
        });
        maxPageRef.current = d.pages_read;
      }
    })();
  }, [userId, productSlug]);

  // Save progress
  const saveProgress = useCallback(
    async (currentPage: number, totalPages: number) => {
      if (!userId || !productSlug) return;
      
      if (currentPage > maxPageRef.current) maxPageRef.current = currentPage;
      const elapsed = Math.round((Date.now() - sessionStartRef.current) / 1000);
      const completion = totalPages > 0 ? Math.round((maxPageRef.current / totalPages) * 100) : 0;

      const record = {
        user_id: userId,
        product_id: productId || productSlug,
        product_slug: productSlug,
        last_page_read: currentPage,
        total_pages: totalPages,
        pages_read: maxPageRef.current,
        completion_percent: Math.min(completion, 100),
        total_reading_time_seconds: elapsed,
        last_read_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await supabase
        .from("reading_analytics" as any)
        .upsert(record as any, { onConflict: "user_id,product_id" });
    },
    [userId, productSlug, productId]
  );

  // Get initial page to resume from
  const getResumePage = useCallback(() => {
    return analytics?.lastPageRead ?? 1;
  }, [analytics]);

  return { analytics, userId, saveProgress, getResumePage };
}
