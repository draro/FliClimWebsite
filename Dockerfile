# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables needed during build
ARG MONGODB_URI
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_METADATA_BASE
ARG OPENAI_API_KEY
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_PROJECT_ID
ARG GOOGLE_AUTH_URI
ARG GOOGLE_TOKEN_URI
ARG GOOGLE_AUTH_PROVIDER_CERT_URL
ARG LINKEDIN_CLIENT_ID
ARG LINKEDIN_ACCESS_TOKEN
ARG LINKEDIN_ORGANIZATION_ID
ARG LINKEDIN_REDIRECT_URI

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV MONGODB_URI=$MONGODB_URI
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXT_PUBLIC_METADATA_BASE=$NEXT_PUBLIC_METADATA_BASE
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV GOOGLE_PROJECT_ID=$GOOGLE_PROJECT_ID
ENV GOOGLE_AUTH_URI=$GOOGLE_AUTH_URI
ENV GOOGLE_TOKEN_URI=$GOOGLE_TOKEN_URI
ENV GOOGLE_AUTH_PROVIDER_CERT_URL=$GOOGLE_AUTH_PROVIDER_CERT_URL
ENV LINKEDIN_CLIENT_ID=$LINKEDIN_CLIENT_ID
ENV LINKEDIN_ACCESS_TOKEN=$LINKEDIN_ACCESS_TOKEN
ENV LINKEDIN_ORGANIZATION_ID=$LINKEDIN_ORGANIZATION_ID
ENV LINKEDIN_REDIRECT_URI=$LINKEDIN_REDIRECT_URI

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]
