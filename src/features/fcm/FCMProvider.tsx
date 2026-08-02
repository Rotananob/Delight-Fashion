"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { getMessagingInstance } from "@/services/firebase/client";
import { getToken, onMessage } from "firebase/messaging";
import { saveFCMTokenAction } from "@/app/actions/notificationActions";
// Assuming we use standard alert or a custom toast UI

export const FCMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    // Only attempt to request notifications if the user is logged in
    if (!user) return;

    let active = true;

    const setupFCM = async () => {
      try {
        if (!("Notification" in window)) {
          console.log("This browser does not support desktop notification");
          return;
        }

        // We only request if it's default or granted
        const permission = Notification.permission;
        
        if (permission === "granted" || permission === "default") {
            const currentPermission = await Notification.requestPermission();
            
            if (currentPermission === "granted" && active) {
              const messaging = await getMessagingInstance();
              if (messaging) {
                // Register service worker if not already
                if ('serviceWorker' in navigator) {
                  // Wait for the window load event to ensure the page has fully loaded before registering the SW
                  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                  
                  // Get the token with VAPID key
                  // We don't have a VAPID key defined in env currently, so we'll just try getting a default token
                  // For production, pass { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY, serviceWorkerRegistration: registration }
                  const currentToken = await getToken(messaging, { serviceWorkerRegistration: registration });
                  
                  if (currentToken) {
                    await saveFCMTokenAction(currentToken);
                    console.log("FCM Token saved successfully.");
                  }

                  // Handle foreground messages
                  onMessage(messaging, (payload) => {
                    console.log('Message received in foreground: ', payload);
                    // Could show a toast here
                    if (payload.notification) {
                       // Custom toast or alert
                       // alert(`${payload.notification.title}\n${payload.notification.body}`);
                    }
                  });
                }
              }
            }
        }
      } catch (error) {
        console.error("FCM setup failed:", error);
      }
    };

    // Add a slight delay so it doesn't block critical rendering
    const timer = setTimeout(() => {
      setupFCM();
    }, 3000);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [user]);

  return <>{children}</>;
};
