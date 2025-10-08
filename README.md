# FlyClim Website

FlyClim offers complete aviation solutions: AI-powered flight optimization and a comprehensive digital eAIP system.

## Quick Start

### Development

```bash
npm install
npm run dev
```

The application will be available at http://localhost:3000

### Docker Deployment (Production)

The application is configured to run on port 3001 in Docker:

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The application will be available at http://localhost:3001

## Environment Variables

Create a `.env.local` file with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000 (or your production URL)
NEXTAUTH_SECRET=your_secret
OPENAI_API_KEY=your_openai_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_ACCESS_TOKEN=your_linkedin_token
NEXT_PUBLIC_BASE_URL=https://www.flyclim.com
```

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Database**: MongoDB
- **Authentication**: NextAuth
- **UI**: shadcn/ui + Tailwind CSS
- **3D Visualization**: Cesium
- **Deployment**: Docker + PM2

## Key Features

### Flight Optimization
- Real-time storm detection and tracking
- AI-powered route optimization
- Airport risk assessment
- Weather delay prediction

### eAIP System
- ICAO Annex 15 compliant
- Automatic NOTAM integration
- Advanced workflow management
- Multi-format export (JSON, XML, HTML)
- Version control with AIRAC cycle management

Learn more at [https://eaip.flyclim.com](https://eaip.flyclim.com)

## Deployment

### Using Docker Compose (Recommended)

1. Ensure `.env.local` is configured with all required environment variables
2. Run: `docker-compose up -d`
3. Access the application at http://localhost:3001

### Using PM2 (Alternative)

1. Build: `npm run build`
2. The build script will automatically reload PM2 using `ecosystem.config.js`

## Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed development documentation.

## License

© 2025 FlyClim. All rights reserved.
