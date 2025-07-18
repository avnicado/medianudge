# MediaNudge - Social Media Platform for Intellectual Growth

## Overview

MediaNudge is a transparent social media platform designed to cultivate education, wisdom, and meaningful engagement. The platform helps users track their intellectual growth, discover quality content, and connect with others based on shared learning goals. Built with a modern full-stack architecture, it emphasizes accountability through public profiles and transparent rating systems.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite with development optimizations

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

## Key Components

### Database Schema
- **Users**: Profile information, wisdom scores, expertise goals
- **Media Items**: Books, courses, podcasts, movies, debates, games
- **User Ratings**: Star ratings (1-5) with review functionality
- **Guiding Questions**: Personal learning objectives
- **Social Features**: User follows, yearly goals, challenges
- **Sessions**: Authentication session storage

### Authentication System
- Replit Auth integration with OpenID Connect
- Session-based authentication with PostgreSQL persistence
- Mandatory user profile requirements for platform access

### Content Rating System
- 5-star rating system where 1★ = "brainrot" and 5★ = "mind-expanding"
- Public rating history for transparency
- Aggregated ratings with community feedback

### Social Features
- Public user profiles with wisdom scores
- Following system for intellectual mentorship
- Yearly goal tracking and progress monitoring
- Weekly challenges for engagement

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit Auth → Session stored in PostgreSQL → User data retrieved/created
2. **Content Discovery**: Media items fetched from database → Filtered by user preferences → Displayed with community ratings
3. **Rating Flow**: User selects media → Provides rating and review → Stored in database → Aggregated for community display
4. **Social Interaction**: Users can follow others → View public profiles → Track comparative progress

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: UI component primitives
- **passport**: Authentication middleware
- **openid-client**: OpenID Connect implementation

### Development Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Development Environment
- Vite development server for frontend hot reloading
- Express server with TypeScript compilation via tsx
- Database migrations handled by Drizzle Kit
- Replit-specific development tooling integration

### Production Build
- Frontend: Vite builds static assets to dist/public
- Backend: ESBuild bundles server code to dist/index.js
- Database: Drizzle pushes schema changes to production
- Environment: Node.js runtime with PostgreSQL database

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OpenID Connect issuer endpoint

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 18, 2025. **MAJOR**: Complete navigation overhaul with proper detail and category pages
- July 18, 2025. Created MediaDetail page for viewing individual media items with ratings and reviews
- July 18, 2025. Created Category page for browsing all items of a specific type (books, courses, etc.)
- July 18, 2025. Fixed all "View Details" buttons to show proper media detail pages
- July 18, 2025. Fixed all "View All" buttons to show filtered category pages
- July 18, 2025. Fixed guiding questions add/delete functionality with proper dialog management
- July 18, 2025. Enhanced admin page with comprehensive goal management settings
- July 18, 2025. Added admin access button to Progress page for better UX
- July 18, 2025. Updated all API routes to support media filtering by type and individual item fetching
- July 17, 2025. **MAJOR**: Eliminated all Replit environment variable dependencies - app now 100% standalone
- July 17, 2025. Created simplified storage system (storage-simple.ts) with in-memory data for Docker deployment
- July 17, 2025. Created simplified routes (routes-simple.ts) without authentication requirements
- July 17, 2025. Updated Docker configuration to work without database dependencies
- July 17, 2025. Added troubleshooting script for Docker deployment issues
- July 17, 2025. Made PostgreSQL database optional in Docker setup
- July 14, 2025. Added Docker support with production and development containers
- July 14, 2025. Created docker-compose.yml for easy local deployment without sudo privileges
- July 14, 2025. Added comprehensive README with Docker instructions and troubleshooting
- July 14, 2025. Added health check endpoint for container monitoring
- July 14, 2025. Removed mandatory Replit authentication - app now fully accessible without login
- July 14, 2025. Added delete functionality to admin interface for content management
- July 14, 2025. Made all public features (home page, recommendations, media browsing) accessible without authentication
- July 08, 2025. Initial setup