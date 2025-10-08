# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlyClim is an AI-powered aviation weather optimization platform built with Next.js 13 (App Router). The application helps airlines reduce weather-related delays through predictive routing intelligence, storm tracking, and flight planning optimization using Cesium for 3D visualization.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (includes sitemap generation, Next.js build, and PM2 reload)
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Generate sitemap only
npm run generate-sitemap
```

## Docker Deployment

The application is configured to run in Docker on port 3001.

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Build Docker image only
docker build -t flyclim-website .

# Run container manually (without docker-compose)
docker run -d -p 3001:3001 --env-file .env.local --name flyclim-website flyclim-website
```

**Important Notes:**
- The application runs on port 3001 inside and outside the container
- Environment variables are loaded from `.env.local`
- The Docker image uses Next.js standalone output for optimized production builds
- Health checks are configured to ensure container is running properly

## Architecture

### Tech Stack
- **Framework**: Next.js 13.5.1 with App Router and TypeScript
- **Database**: MongoDB (using native driver, not Mongoose in most API routes)
- **Authentication**: NextAuth v4 with credentials provider
- **3D Visualization**: Cesium (via Resium wrapper)
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Real-time Communication**: WebSocket (client-side hook in `lib/websocket.ts`)
- **Deployment**: PM2 for process management

### Directory Structure

- **`/app`**: Next.js 13 App Router pages and layouts
  - `/api`: API routes (NextAuth, flights, weather, posts, calendar, etc.)
  - Route segments: `/about`, `/admin`, `/blog`, `/contact`, `/demo`, `/pilot`, `/solutions`, `/team`

- **`/components`**: React components (~130 components)
  - `/ui`: shadcn/ui components (accordion, button, card, dialog, etc.)
  - Key components: `CesiumViewer.tsx`, `FPLForm.tsx`, `AdminDashboard.tsx`, `FlightPlanList.tsx`

- **`/lib`**: Shared utilities
  - `mongodb.ts`: MongoDB client singleton with dev/prod connection handling
  - `websocket.ts`: Custom WebSocket hook with auto-reconnect and ping/pong
  - `utils.ts`: Utility functions
  - `email.ts`: Email functionality

- **`/scripts`**: Build scripts
  - `generate-sitemap.js`: Generates sitemap from MongoDB posts + static routes

### Key Patterns

**API Routes**:
- Most API routes use MongoDB native driver (not Mongoose)
- Pattern: Connect to MongoDB, perform operation, close connection in finally block
- NextAuth routes must use `runtime = 'nodejs'` (not Edge) due to MongoDB compatibility
- Auth verification done via internal API call to `/api/auth/verify-credentials`

**MongoDB Connection**:
- Use the singleton pattern from `lib/mongodb.ts` for client-side or reusable connections
- In API routes, typically create new connections per request and close in finally blocks
- Database name: `flyclim`
- Common collections: `flight_plans`, `posts`, `pilots`, `leads`, `tasks`, `aircraft_types`

**Authentication**:
- NextAuth with credentials provider + bcryptjs for password hashing
- JWT session strategy (30-day sessions)
- Role-based access control (user roles stored in JWT token and session)
- Admin login at `/admin/login`

**3D Visualization**:
- Cesium loaded via CDN (accessed via `window.Cesium`)
- `CesiumViewer.tsx` handles flight path visualization, storm data, and airport risk display
- GeoJSON features for routes and storm polygons
- WebSocket integration for real-time weather updates

**UI Components**:
- shadcn/ui configuration in `components.json`
- Tailwind CSS with CSS variables for theming
- Path aliases: `@/*` maps to root (configured in `tsconfig.json`)

**Environment Variables**:
- `MONGODB_URI`: MongoDB connection string
- `NEXTAUTH_URL`: Base URL for NextAuth
- `NEXTAUTH_SECRET`: JWT secret
- `OPENAI_API_KEY`: OpenAI integration
- `LINKEDIN_*`: LinkedIn API credentials
- `GOOGLE_*`: Google OAuth/Calendar API credentials

### Build Process

The build script runs three steps:
1. `npm run generate-sitemap`: Generates `public/sitemap.xml` from MongoDB posts and static routes
2. `next build`: Creates production build in `.next/`
3. `pm2 reload ecosystem.config.js`: Reloads PM2-managed production process

PM2 configuration in `ecosystem.config.js` runs the Next.js production server on port 3000.

### Testing & Development

- No test suite currently configured
- Development server runs on port 3000 by default
- Hot reload enabled in development
- Use browser DevTools for debugging Cesium/WebSocket issues

## Important Notes

- **MongoDB Native Driver**: Most API routes use the native MongoDB driver directly rather than Mongoose, so schema validation is minimal.
- **Edge Runtime Incompatibility**: NextAuth and MongoDB routes cannot use Edge runtime - must use Node.js runtime.
- **WebSocket Reconnection**: The WebSocket hook (`lib/websocket.ts`) implements automatic reconnection with 2-second delay and 15-second ping/pong keepalive.
- **Image Optimization**: Next.js configured to allow remote images from all hosts (`hostname: '**'`).
