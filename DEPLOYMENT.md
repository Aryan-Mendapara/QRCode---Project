# Render Deployment Guide

## PostgreSQL Connection Setup

### Option 1: Using Render PostgreSQL Database (Recommended)

1. **Create PostgreSQL Database in Render:**
   - Go to Render Dashboard → New → PostgreSQL
   - Create a new PostgreSQL database
   - Note the connection details

2. **Link Database to Your Service:**
   - Go to your Web Service → Settings → Environment
   - Click "Link Database" and select your PostgreSQL database
   - Render will automatically add `DATABASE_URL` environment variable

3. **The code will automatically use `DATABASE_URL` if available**

### Option 2: Using External Database (Manual Setup)

If you're using an external PostgreSQL database, set these environment variables in Render:

1. Go to your Web Service → Settings → Environment
2. Add these environment variables:
   - `DATABASE_URL` or `EXTERNAL_DATABASE_URL` - Full connection string
     - Format: `postgresql://user:password@host:port/database`
   - OR use individual variables:
     - `PG_USER` - Database username
     - `PG_HOST` - Database host
     - `PG_DATABASE` - Database name
     - `PG_PASSWORD` - Database password
     - `PG_PORT` - Database port (usually 5432)

### Environment Variables Required

**For Production (Render):**
- `DATABASE_URL` or `EXTERNAL_DATABASE_URL` (automatically set when linking database)
- `PORT` (automatically set by Render)
- `NODE_ENV=production` (optional, but recommended)

**For Local Development:**
- `PG_USER`
- `PG_HOST` (defaults to localhost)
- `PG_DATABASE`
- `PG_PASSWORD`
- `PG_PORT` (defaults to 5432)

## How It Works

The code now supports both connection methods:
1. **Connection String** (`DATABASE_URL`) - Used automatically if available (Render/Heroku style)
2. **Individual Variables** - Used for local development

The code will automatically detect which method to use based on available environment variables.

## Troubleshooting

### Error: `ECONNREFUSED 127.0.0.1:5432`

This means the app is trying to connect to localhost. Fix:
1. Make sure you've linked your PostgreSQL database in Render
2. Or set `DATABASE_URL` environment variable with your database connection string
3. Verify the database is running and accessible

### Check Environment Variables

In Render Dashboard:
1. Go to your service → Settings → Environment
2. Verify `DATABASE_URL` is set (if using linked database)
3. Or verify all `PG_*` variables are set correctly
