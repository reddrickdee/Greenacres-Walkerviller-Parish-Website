// flutter_bootstrap.js — GW Parish PWA source template
// Placeholders are replaced at build time by the Flutter toolchain.

{ { flutter_js } }
{ { flutter_build_config } }

_flutter.loader.load({
  serviceWorkerSettings: {
    serviceWorkerVersion: "{{flutter_service_worker_version}}",
    timeoutMillis: 10000,
  },
  onEntrypointLoaded: async function (engineInitializer) {
    const appRunner = await engineInitializer.initializeEngine();
    await appRunner.runApp();

    // Aggressive offline precache: tell Flutter's SW to cache ALL RESOURCES
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration.active) {
          registration.active.postMessage('downloadOffline');
          console.log('[GW Parish] Offline precache triggered.');
        }
      } catch (err) {
        console.warn('[GW Parish] Could not trigger offline precache:', err);
      }
    }
  },
});
