import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * usePushNotifications — Web Push API integration via Supabase.
 *
 * Handles:
 * 1. Checking browser support for push notifications
 * 2. Requesting user permission
 * 3. Subscribing to push notifications
 * 4. Storing the subscription in Supabase `push_subscriptions` table
 *
 * Usage:
 *   const { isSupported, permission, subscribe, unsubscribe } = usePushNotifications();
 */

// Your VAPID public key — generate via: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? '';

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const buffer = new ArrayBuffer(rawData.length);
    const outputArray = new Uint8Array(buffer);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function usePushNotifications() {
    const [isSupported] = useState(() => 'serviceWorker' in navigator && 'PushManager' in window);
    const [permission, setPermission] = useState<NotificationPermission>(
        isSupported ? Notification.permission : 'default'
    );
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check existing subscription on mount
    useEffect(() => {
        if (!isSupported) return;
        navigator.serviceWorker.ready.then(async registration => {
            const sub = await registration.pushManager.getSubscription();
            setIsSubscribed(!!sub);
        });
    }, [isSupported]);

    const subscribe = useCallback(async () => {
        if (!isSupported || !VAPID_PUBLIC_KEY) return;
        setLoading(true);

        try {
            // 1. Request permission
            const perm = await Notification.requestPermission();
            setPermission(perm);
            if (perm !== 'granted') { setLoading(false); return; }

            // 2. Subscribe
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            // 3. Store in Supabase
            const subJson = subscription.toJSON();
            await supabase.from('push_subscriptions').upsert({
                endpoint: subJson.endpoint,
                keys: subJson.keys,
                created_at: new Date().toISOString(),
            }, { onConflict: 'endpoint' });

            setIsSubscribed(true);
        } catch (error) {
            console.error('Push subscription failed:', error);
        } finally {
            setLoading(false);
        }
    }, [isSupported]);

    const unsubscribe = useCallback(async () => {
        if (!isSupported) return;
        setLoading(true);

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                const endpoint = subscription.endpoint;
                await subscription.unsubscribe();
                await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
            }
            setIsSubscribed(false);
        } catch (error) {
            console.error('Push unsubscribe failed:', error);
        } finally {
            setLoading(false);
        }
    }, [isSupported]);

    return { isSupported, permission, isSubscribed, loading, subscribe, unsubscribe };
}
