"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const VisitorTracker = () => {
  const pathname = usePathname();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per session
    if (hasTracked.current) return;
    if (sessionStorage.getItem("delight_visitor_tracked") === "true") {
      hasTracked.current = true;
      return;
    }

    const trackVisitor = async () => {
      try {
        const userAgent = window.navigator.userAgent;
        const referrer = document.referrer;

        await fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userAgent,
            referrer,
            pathname,
          }),
        });

        // Mark as tracked in session storage so we don't spam on page reloads
        sessionStorage.setItem("delight_visitor_tracked", "true");
        hasTracked.current = true;
      } catch (error) {
        console.error("Failed to track visitor:", error);
      }
    };

    // Add a tiny delay to ensure page is fully loaded and not block critical rendering
    const timer = setTimeout(() => {
      trackVisitor();
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null; // This is a completely invisible background component
};
