# Matrimonial App

A modern matrimonial web application built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL. Users can register, login, and browse profiles of other users to find their perfect match.

## Features

- 🔐 **Secure Authentication**: Password hashing with bcrypt
- 👤 **User Profiles**: Create detailed profiles with personal information
- 🔍 **Browse Profiles**: View all registered users on the home page
- 💜 **Modern UI**: Beautiful gradient design with Tailwind CSS
- 📱 **Responsive**: Works on desktop, tablet, and mobile devices
- �️ **PostgreSQL Database**: Production-ready data persistence
- 🔄 **Prisma ORM**: Type-safe database access

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: bcryptjs for password hashing
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- PostgreSQL database (local or cloud)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up your database:**

   Choose one of these options:
   - **Vercel Postgres** (recommended for production)
   - **Neon.tech** (great free tier)
   - **Supabase** (all-in-one platform)
   - **Local PostgreSQL**

   See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed setup instructions.

3. **Configure environment variables:**

   Update `.env` file with your database URL:

   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   ```

4. **Run database migrations:**

```bash
npx prisma migrate dev --name init
```

5. **Generate Prisma Client:**

```bash
npx prisma generate
```

6. **Start the development server:**

```bash
npm run dev
```

7. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Project Structure

```
matrimonial/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/   # Registration API
│   │   │   │   └── login/      # Login API
│   │   │   └── users/          # Users API
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── home/               # Home page with profiles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles
│   └── lib/
│       └── prisma.ts           # Prisma client instance
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                     # Static assets
├── .env                        # Environment variables (not in git)
├── .env.example                # Example environment file
├── DATABASE_SETUP.md           # Database setup guide
└── package.json
```

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed with bcrypt
  name      String
  age       Int
  gender    String
  location  String
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users

- `GET /api/users?excludeId=<userId>` - Get all users (excluding specified user)

## User Flow

1. **Landing Page**: Redirects to login if not authenticated, or home if authenticated
2. **Registration**: New users create an account with personal details (password is hashed)
3. **Login**: Existing users sign in with email and password
4. **Home Page**: View all registered user profiles (excluding your own)
5. **Logout**: Sign out and return to login page

## Features Details

### Registration Form

- Full Name
- Email (unique identifier)
- Password (minimum 6 characters, hashed with bcrypt)
- Age
- Gender (Male/Female/Other)
- Location
- Bio (optional)

### Profile Display

- User avatar with first initial
- Name, age, gender, location
- Bio/description
- View Profile button (placeholder for future feature)

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes Prisma generate)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Create and apply database migrations
- `npm run db:push` - Push schema changes to database (no migration)
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

See `.env.example` for more configuration options.

## Deployment to Vercel

1. **Push to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Add Database:**
   - In Vercel dashboard → Storage → Create Database → Postgres
   - Or connect to Neon/Supabase

4. **Set Environment Variables:**
   - Add `DATABASE_URL` in Vercel dashboard
   - Settings → Environment Variables

5. **Deploy!**
   - Vercel automatically runs migrations and builds your app

## Future Enhancements

- ✅ ~~Backend API~~ (Completed)
- ✅ ~~Database storage~~ (Completed - PostgreSQL)
- ✅ ~~Password hashing~~ (Completed - bcrypt)
- 🔲 Advanced profile filtering and search
- 🔲 Messaging system between users
- 🔲 Profile images upload
- 🔲 Email verification
- 🔲 Password reset functionality
- 🔲 User preferences and matching algorithm
- 🔲 Real-time notifications
- 🔲 Social authentication (Google, Facebook)
- 🔲 Profile completeness indicator
- 🔲 Favorite/bookmark profiles

## Security Features

- ✅ Password hashing with bcrypt
- ✅ SQL injection protection (via Prisma)
- ✅ Type-safe API routes
- ✅ Environment variable protection
- 🔲 JWT/Session authentication (consider implementing)
- 🔲 Rate limiting
- 🔲 CSRF protection

## License

MIT
