const DEFAULT_URL = "/blog";

const getSafeDestination = (value) => {
  try {
    const destination = new URL(value || DEFAULT_URL, self.location.origin);
    return destination.origin === self.location.origin
      ? destination.href
      : new URL(DEFAULT_URL, self.location.origin).href;
  } catch {
    return new URL(DEFAULT_URL, self.location.origin).href;
  }
};

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let payload = {};

  try {
    payload = event.data?.json() || {};
  } catch {
    payload = { body: event.data?.text() || "A new Kraviona article is live." };
  }

  const title = payload.title || "New article on Kraviona";
  const options = {
    body: payload.body || "Read the latest Kraviona insight.",
    icon: payload.icon || "/icon-192.png",
    badge: payload.badge || "/favicon-32x32.png",
    image: payload.image,
    tag: payload.tag || "kraviona-blog",
    renotify: Boolean(payload.renotify),
    data: {
      topic: "blog",
      url: payload.data?.url || DEFAULT_URL,
    },
    actions: [{ action: "read", title: "Read article" }],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const destination = getSafeDestination(event.notification.data?.url);

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(
      async (clients) => {
        for (const client of clients) {
          if (new URL(client.url).origin === self.location.origin) {
            if (client.url === destination) return client.focus();

            await client.navigate(destination);
            await client.focus();
            return client;
          }
        }

        return self.clients.openWindow(destination);
      },
    ),
  );
});
