# 🚀 Quick Start - Database Setup

## Before You Start

You need a PostgreSQL database. Choose the easiest option for you:

### ⚡ Fastest Option: Neon.tech (30 seconds)

1. Go to https://neon.tech
2. Sign up with GitHub (instant)
3. Click "Create Project"
4. Copy the connection string that appears
5. Paste it into your `.env` file as `DATABASE_URL`
6. Run: `npx prisma migrate dev --name init`
7. Done! ✅

### 🎯 For Vercel Deployment

If you're deploying to Vercel:

1. Deploy your app to Vercel first
2. In Vercel dashboard → Storage → Create Database → Postgres
3. Connection string is automatically added
4. For local development, copy the string to your local `.env` file
5. Run: `npx prisma migrate dev --name init`
6. Done! ✅

### 💻 Local PostgreSQL

If you have PostgreSQL installed locally:

1. Update `.env`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/matrimonial?schema=public"
   ```
2. Run: `npx prisma migrate dev --name init`
3. Done! ✅

---

## After Database Setup

Test your app:

```bash
# Start the dev server
npm run dev

# Open http://localhost:3000
# Register a new account
# Login and view profiles
```

View your data:

```bash
npx prisma studio
```

That's it! Your matrimonial app is now connected to a real database! 🎉

---

For detailed setup instructions, see [DATABASE_SETUP.md](./DATABASE_SETUP.md)
