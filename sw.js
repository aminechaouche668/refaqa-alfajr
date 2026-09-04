self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {}

  const title = data.title || 'رفقاء الفجر 🌅';

  const options = {
    body: data.body || 'حان وقت متابعة صلاة الفجر 🤲',
    icon: data.icon || undefined,
    badge: data.badge || undefined,
    dir: 'rtl',
    lang: 'ar',
    tag: data.tag || 'refaqa-fajr',
    data: {
      url: data.url || './'
    },
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url =
    event.notification.data?.url || './';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(list => {

      for (const client of list) {
        if ('focus' in client) {
          return client.focus();
        }
      }

      return clients.openWindow(url);
    })
  );
});
