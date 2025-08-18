# Overview

This is a Korean fortune-telling Progressive Web App (PWA) called "한줄신탁" (One-Line Oracle). The application provides personalized daily, weekly, monthly, and yearly fortunes based on user profiles (name, birthdate, timezone) without storing personal data on servers. All data is stored locally in the browser using localStorage, and fortunes are generated deterministically using seeded randomization for consistency across sessions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: React hooks with custom localStorage hooks for persistence
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom mystical color palette and Korean font support
- **Data Fetching**: TanStack Query for server state management

## Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: Drizzle ORM configured for PostgreSQL (though currently using in-memory storage)
- **API Design**: RESTful endpoints with minimal server functionality
- **Development**: Hot module replacement via Vite middleware integration

## Data Storage Solutions
- **Client-side**: localStorage for all user data (profile, settings, fortune history)
- **Server-side**: In-memory storage with interface for future database integration
- **Data Schemas**: Zod schemas for runtime validation and type safety
- **Persistence Strategy**: Client-only data persistence with optional export/import functionality

## Fortune Generation System
- **Deterministic Generation**: Seeded random number generation based on profile hash and period key
- **Template System**: Pre-defined fortune templates categorized by period (daily/weekly/monthly/yearly)
- **Personalization**: Dynamic text modification based on user's honorific style preference
- **Consistency**: Same fortune guaranteed for same user on same time period

## PWA Features
- **Service Worker**: Caching strategy for offline functionality
- **Manifest**: App installation capabilities with proper metadata
- **Responsive Design**: Mobile-first approach with touch interactions
- **App-like Experience**: Full-screen mode, theme color, and native app behavior

## Authentication and Authorization
- **No Authentication**: Completely client-side application without user accounts
- **Privacy-First**: No personal data transmitted to servers
- **Local Identity**: Profile-based identification using hashed data for fortune generation

# External Dependencies

## Frontend Dependencies
- **UI Framework**: React ecosystem (react, react-dom, @vitejs/plugin-react)
- **UI Components**: Radix UI primitives (@radix-ui/react-*)
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: TanStack React Query for server state
- **Routing**: wouter for client-side navigation
- **Forms**: React Hook Form with Hookform Resolvers
- **Utilities**: 
  - clsx and tailwind-merge for conditional styling
  - date-fns for date manipulation
  - class-variance-authority for component variants

## Backend Dependencies
- **Server Framework**: Express.js
- **Database**: 
  - Drizzle ORM for database operations
  - @neondatabase/serverless for PostgreSQL connection
- **Development Tools**: 
  - tsx for TypeScript execution
  - esbuild for production builds
- **Session Management**: connect-pg-simple for PostgreSQL session store

## Development and Build Tools
- **Build System**: Vite with TypeScript support
- **Code Quality**: TypeScript for type safety
- **Database Migrations**: Drizzle Kit for schema management
- **Development Server**: Vite dev server with Express middleware integration
- **Replit Integration**: Custom Replit plugins for development environment

## Fonts and Assets
- **Typography**: Google Fonts (Noto Sans KR for Korean text support)
- **Icons**: Lucide React for consistent iconography
- **PWA Assets**: Custom manifest and service worker configuration