# 🚀 Quick Setup Guide

## Step 1: Create Environment File

Create a `.env.local` file in the root directory with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Step 2: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to **Settings > API**
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys > anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API keys > service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Set Up Database

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Copy and paste the SQL commands from `SUPABASE_SETUP.md`
4. Click **Run** to create all the tables

## Step 4: Start Development

```bash
npm run dev
```

Visit `http://localhost:3005` to see your car lending platform!

## Troubleshooting

If you see "supabaseKey is required" error:
- Make sure you've created the `.env.local` file
- Check that all environment variables are set correctly
- Restart the development server after adding environment variables

## What's Next?

Once the environment is set up, you can:
1. Test the user registration functionality
2. Start building vehicle listing components
3. Implement booking management features
4. Add offer/counteroffer system UI
