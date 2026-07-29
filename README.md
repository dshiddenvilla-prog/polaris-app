# Polaris Resort — Receipt App

Express + MongoDB app. History is shared across every device (not stuck in one
browser's localStorage), and it installs like a real app:

- **Installable**: on the deployed URL, use "Add to Home Screen" (phone) or the
  install icon in the browser address bar (desktop). It opens full-screen with
  its own icon — no browser bar, no URL bar.
- **Works offline**: the app shell (the whole receipt UI) is cached, so it opens
  with no signal. You can build and save receipts offline — they're queued
  locally and sync to the shared database automatically the moment you're back
  online.

## Run locally

```
npm install
cp .env.example .env   # then paste your MongoDB URI
npm start
```

Open http://localhost:3000

## Deploy on Render (same setup as your other site)

1. Get a free MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
   - Create a cluster → Database Access: add a user/password
   - Network Access: allow 0.0.0.0/0 (or Render's IPs)
   - Copy the connection string, replace `<password>` and add `/polaris_receipts` before the `?`

2. Push this folder to a GitHub repo.

3. On Render:
   - New → Web Service → connect the repo
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variable: `MONGODB_URI` = your Atlas connection string
   - Deploy

Once live, install it from that URL — it behaves like a normal app from then on.

## API

- `GET /api/receipts` — list all saved receipts
- `POST /api/receipts` — save/update a receipt `{ id, savedAt, data }`
- `DELETE /api/receipts/:id` — delete a receipt

## Notes

- HTTPS is required for install-to-home-screen and service workers to work —
  Render gives you this automatically. `localhost` also works for testing.
- Offline saves live in the browser's storage until synced; don't clear site
  data on a device with unsynced receipts.

