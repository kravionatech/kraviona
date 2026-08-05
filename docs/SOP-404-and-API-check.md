# SOP: 404 Page and API Link Check

Use this SOP when a page returns 404, a navigation link is broken, or a frontend section shows empty data because an API endpoint is missing.

## 1. Confirm the page route

1. Check the frontend page exists under `frontend/app`.
2. Check redirects in `frontend/next.config.mjs`.
3. For dynamic routes, confirm the slug exists in the local catalogue or backend data.
4. Test the live URL:

```powershell
curl.exe -I --max-time 15 https://kraviona.com/services/mern-stack-development
```

Expected result: `200 OK` for a valid page, or `308` only when the URL intentionally redirects.

## 2. Confirm the API endpoint

All public frontend API calls should use the normalized `API_URL` from `frontend/utils/api.js` and call the backend directly.

Test important endpoints:

```powershell
curl.exe -I --max-time 15 https://api.kraviona.com/api/v1/public/posts?page=1
curl.exe -I --max-time 15 https://api.kraviona.com/api/v1/categories
curl.exe -I --max-time 15 https://api.kraviona.com/api/v1/services
curl.exe -I --max-time 15 https://api.kraviona.com/api/v1/projects
```

Expected result: `200 OK`. If an endpoint returns `404`, add a backend route or change the frontend to call the correct existing endpoint.

## 3. Keep frontend links clean

Use canonical public routes:

- Blog listing: `/blog`
- Blog detail: `/blog/[slug]`
- Services listing: `/services`
- Service detail: `/services/[slug]`
- Contact: `/contact`
- Terms: `/terms`
- Privacy: `/privacy-policy`

Old paths such as `/contact-us`, `/privacy`, and `/terms-and-conditions` should stay in `next.config.mjs` redirects so older links continue to work.

## 4. Verify before deployment

Run these checks from the repository root:

```powershell
npm --prefix frontend run lint
npm --prefix frontend run build
```

If build or lint is slow, check for stuck Node processes before retrying:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Select-Object Id,ProcessName,CPU,StartTime
```

Only stop processes that belong to the current check.

## 5. What was fixed here

- Added backend `GET /api/v1/services`.
- Added backend `GET /api/v1/projects`.
- Centralized frontend backend URL normalization.
- Removed the frontend `app/api` proxy layer because backend CORS is configured.
