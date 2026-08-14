# Blog Web Push setup

The application stores browser subscriptions in MongoDB and sends one push
notification when a post first moves to `published`. Draft edits and updates to
an already-published post do not notify again.

## Deployment setup

Generate a stable VAPID key pair once:

```powershell
cd backend
npm run push:keys
```

Add the three printed `WEB_PUSH_*` values to the backend deployment environment.
The private key must never be added to Git or exposed to the frontend. Redeploy
the backend after setting the values, then redeploy the frontend.

The frontend service worker is `/sw.js`. A subscription prompt is rendered only
under `/blog` routes, and notifications always open a `/blog/:slug` URL.
