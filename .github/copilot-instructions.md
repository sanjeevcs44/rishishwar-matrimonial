# Matrimonial App - Copilot Instructions

## Project Overview

This is a matrimonial web application built with Next.js, TypeScript, and Tailwind CSS. Users can register, login, and browse profiles of other users to find their perfect match.

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Storage: Browser localStorage (demo)

## Project Structure

- `/src/app/login` - Login page with authentication
- `/src/app/register` - Registration page with form validation
- `/src/app/home` - Home page displaying all user profiles
- `/src/app/page.tsx` - Landing page with auth redirect logic
- `/src/app/layout.tsx` - Root layout component
- `/src/app/globals.css` - Global styles with Tailwind

## Features Implemented

✅ User registration with validation
✅ User login with credential verification
✅ Home page displaying all registered users
✅ Profile cards with user information
✅ Logout functionality
✅ Automatic routing based on authentication status
✅ Responsive design with Tailwind CSS
✅ LocalStorage for data persistence

## Development

- Run dev server: `npm run dev`
- App runs on: http://localhost:3000
- VS Code task configured for development server

## User Flow

1. Landing page redirects to login/home based on auth status
2. New users register with personal details
3. Login with email and password
4. Browse all user profiles on home page
5. Logout returns to login page
