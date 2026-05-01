# Backend Deployment Guide

## Railway Deployment (Recommended)

1. **Create a Railway account** at [railway.com](https://railway.com)

2. **Create a new project** → "Deploy from GitHub Repo" → select your repo

3. **Set the Root Directory** to `backend` in the service settings

4. **Add Environment Variables** in Railway dashboard:
   ```
   MONGO_URL=mongodb+srv://your-atlas-connection-string
   DB_NAME=makia_capital
   JWT_SECRET=your-secret-key-here
   ```
   
   For MongoDB, use [MongoDB Atlas](https://cloud.mongodb.com) (free tier available).

5. **Deploy** — Railway auto-detects the `Procfile` and starts the server

6. **Copy the Railway URL** (e.g., `https://your-app.up.railway.app`)

7. **Update Vercel** — In your Vercel project settings, add environment variable:
   ```
   REACT_APP_BACKEND_URL=https://your-app.up.railway.app
   ```
   Then redeploy the frontend.

## Render Deployment (Alternative)

1. **Create a Render account** at [render.com](https://render.com)

2. **New Web Service** → Connect your GitHub repo

3. **Settings**:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables** (same as Railway above)

5. **Copy the Render URL** and update Vercel's `REACT_APP_BACKEND_URL`

## Important Notes

- The backend needs `MONGO_URL` pointing to a cloud MongoDB (Atlas recommended)
- `JWT_SECRET` should be a strong random string (minimum 32 characters)
- `DB_NAME` defaults to `makia_capital` if not set
- CORS is configured to accept all origins — restrict to your Vercel domain in production
