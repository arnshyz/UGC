<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/15c3Pysqrd701fDnzbfCEWn5wBl3rQDdv

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` (or create a new `.env` file) and set the following values:

   ```bash
   VITE_FREEPIK_API_KEY=<your_freepik_api_key>
   # Optional: point to a custom proxy if Freepik blocks browser requests
   # VITE_FREEPIK_API_BASE_URL=https://your-proxy.example.com/v1
   ```

   > **Tip:** When developing locally, the Vite dev server proxies `/api/freepik` to the official Freepik API so Anda tidak kena batasan CORS di browser. Kalau proxy lokal tersebut gagal dijangkau, aplikasi kini otomatis mencoba langsung ke `https://api.freepik.com/v1` sehingga proses generate tetap bisa berjalan.

3. Run the app:
   `npm run dev`
