# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` - Start Vite development server with HMR
- **Build**: `npm run build` - TypeScript compile + Vite production build
- **Lint**: `npm run lint` - Run ESLint on the codebase
- **Preview**: `npm run preview` - Preview production build locally

## Architecture

This is a React + TypeScript + Vite application for a campus social platform ("Campus Conecta") using Supabase for backend services.

### Tech Stack
- React 19 with React Router DOM v7 for routing
- Tailwind CSS v4 with @tailwindcss/vite plugin
- Supabase for authentication and database
- Radix UI primitives for accessible components
- SWC for fast refresh in development

### Project Structure

**Layouts** (`src/layouts/`):
- `Layout.tsx` - Root layout with toast notifications (Sonner)
- `DashboardLayout.tsx` - Authenticated layout with sidebar navigation

**Routing** (`src/router/router.tsx`):
- Uses `createBrowserRouter` from react-router-dom
- Public routes: `/`, `/login`, `/register`
- Protected routes under DashboardLayout: `/home`, `/create-post`

**Feature Pages** (`src/app/`):
- Each feature has its own folder with `index.tsx` and `components/` subfolder
- Pattern: `src/app/{feature}/index.tsx` for page, `src/app/{feature}/components/` for feature-specific components

**UI Components** (`src/components/ui/`):
- Reusable UI primitives built on Radix UI
- Uses class-variance-authority (cva) for component variants

**Utilities**:
- `src/lib/utils.ts` - Tailwind class merging with `cn()` helper
- `src/lib/supabase.ts` - Supabase client initialization

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json and vite.config.ts)

### Environment Variables
Required Supabase environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
