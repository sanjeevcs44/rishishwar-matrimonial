# Database Setup Guide

This guide will help you set up PostgreSQL database for the Matrimonial app.

## 🚀 Quick Start Options

Choose one of the following options based on your needs:

---

## Option 1: Vercel Postgres (Recommended for Production)

### Why Vercel Postgres?

- ✅ Seamless Vercel deployment
- ✅ Free tier available
- ✅ Serverless, auto-scaling
- ✅ No infrastructure management

### Setup Steps:

1. **Push your code to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"

3. **Add Vercel Postgres**
   - In your Vercel dashboard, go to your project
   - Click on "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Click "Create"

4. **Copy Environment Variables**
   - Vercel will automatically add `DATABASE_URL` to your environment
   - For local development:
     - Click "Copy" on the connection string
     - Create `.env.local` file in your project root
     - Paste the connection string

5. **Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

---

## Option 2: Neon.tech (Great Free Tier)

### Why Neon?

- ✅ Generous free tier (0.5 GB storage)
- ✅ Serverless Postgres
- ✅ Instant branching
- ✅ Auto-suspend when inactive

### Setup Steps:

1. **Create Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub

2. **Create Database**
   - Click "Create Project"
   - Choose region closest to you
   - Copy the connection string

3. **Update .env**

   ```bash
   DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/matrimonial?sslmode=require"
   ```

4. **Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

---

## Option 3: Supabase (All-in-One Platform)

### Why Supabase?

- ✅ Free tier (500 MB database)
- ✅ Built-in authentication
- ✅ Realtime capabilities
- ✅ Storage for images

### Setup Steps:

1. **Create Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up

2. **Create Project**
   - Click "New Project"
   - Enter project details
   - Wait for database provisioning (~2 mins)

3. **Get Connection String**
   - Go to Project Settings → Database
   - Copy "Connection string" (URI format)
   - Replace `[YOUR-PASSWORD]` with your password

4. **Update .env**

   ```bash
   DATABASE_URL="postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres"
   ```

5. **Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

---

## Option 4: Local PostgreSQL

### Prerequisites

- PostgreSQL installed on your machine

### Setup Steps:

1. **Install PostgreSQL**
   - **macOS**: `brew install postgresql`
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)
   - **Linux**: `sudo apt-get install postgresql`

2. **Start PostgreSQL**

   ```bash
   # macOS
   brew services start postgresql

   # Linux
   sudo service postgresql start
   ```

3. **Create Database**

   ```bash
   psql postgres
   CREATE DATABASE matrimonial;
   CREATE USER matrimonial_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE matrimonial TO matrimonial_user;
   \q
   ```

4. **Update .env**

   ```bash
   DATABASE_URL="postgresql://matrimonial_user:your_password@localhost:5432/matrimonial?schema=public"
   ```

5. **Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

---

## 🔧 After Setup - Common Commands

### Generate Prisma Client

```bash
npx prisma generate
```

### Create and apply migrations

```bash
npx prisma migrate dev --name your_migration_name
```

### Push schema without migrations (for prototyping)

```bash
npx prisma db push
```

### Open Prisma Studio (Database GUI)

```bash
npx prisma studio
```

### Reset database (⚠️ DELETES ALL DATA)

```bash
npx prisma migrate reset
```

---

## 📋 Checklist

- [ ] Database created
- [ ] `.env` file updated with `DATABASE_URL`
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma migrate dev --name init`
- [ ] Tested registration at http://localhost:3000/register
- [ ] Verified user created in database (use `npx prisma studio`)

---

## 🚨 Troubleshooting

### Error: "Can't reach database server"

- Check if PostgreSQL is running
- Verify connection string in `.env`
- Check firewall settings

### Error: "Environment variable not found: DATABASE_URL"

- Make sure `.env` file exists in project root
- Restart your development server
- Check `.env` file is not in `.gitignore`

### Error: "P3009: migrate found failed migration"

- Run `npx prisma migrate reset` to reset migrations
- Then run `npx prisma migrate dev` again

### Prisma Client not generating

- Run `npx prisma generate` manually
- Check for syntax errors in `schema.prisma`

---

## 🌐 Vercel Deployment

When deploying to Vercel:

1. ✅ Vercel automatically runs `prisma generate` (via postinstall script)
2. ✅ Add `DATABASE_URL` in Vercel dashboard Environment Variables
3. ✅ In build settings, add:
   ```bash
   npx prisma migrate deploy
   ```
   as a custom build command (or add to `build` script in package.json)

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel Postgres Guide](https://vercel.com/docs/storage/vercel-postgres)
- [Neon Documentation](https://neon.tech/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

## 💡 Next Steps

After setting up the database:

1. Test registration at `/register`
2. Test login at `/login`
3. View users at `/home`
4. Open Prisma Studio to see your data: `npx prisma studio`
5. Deploy to Vercel when ready!
