# Architecture Documentation

## Overview

This is a complete greenfield rewrite of the IELTS Prep mobile application as a web-based system. All existing functionalities remain exactly the same - only the technology stack has changed.

## Technology Migration

| Original | New |
|----------|-----|
| Flutter (Mobile) | React (Web) |
| Firebase Firestore | PostgreSQL |
| Firebase Auth | Spring Security + JWT |
| Firebase Storage | Local/Cloud Storage |
| AdMob | Web Ad Integration |
| In-App Purchases | Payment Gateway Integration |

## Backend Architecture

### Layered Architecture

```
Controller Layer (REST API)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Entity Layer (Database)
```

### Key Components

1. **Entities** (`com.ielts.entity`)
   - JPA entities representing database tables
   - All entities extend auditing capabilities
   - Relationships properly mapped

2. **Repositories** (`com.ielts.repository`)
   - Spring Data JPA repositories
   - Custom query methods
   - Transaction management

3. **Services** (`com.ielts.service`)
   - Business logic implementation
   - Transaction boundaries
   - Validation and error handling

4. **Controllers** (`com.ielts.controller`)
   - REST API endpoints
   - Request/Response handling
   - Authentication/Authorization

5. **Security** (`com.ielts.security`)
   - JWT token generation and validation
   - Spring Security configuration
   - CORS configuration

## Frontend Architecture

### Component Structure

```
Pages (Route Components)
    ↓
Components (Reusable UI)
    ↓
Services (API Calls)
    ↓
Context (State Management)
```

### Key Features

1. **Routing**
   - React Router for navigation
   - Private routes for authenticated pages
   - Exact route matching

2. **State Management**
   - React Context API for global state
   - AuthContext for user authentication
   - ThemeContext for theme management

3. **API Integration**
   - Axios for HTTP requests
   - Interceptors for token management
   - Error handling

4. **UI Components**
   - Material-UI for components
   - Custom styled components
   - Responsive design

## Database Schema

### Entity Relationships

- `User` → `PremiumUser` (One-to-One)
- `User` → `Forum` (One-to-Many)
- `User` → `Message` (One-to-Many)
- `User` → `QuizCompletion` (One-to-Many)
- `Forum` → `Message` (One-to-Many)
- `Quiz` → `QuizCompletion` (One-to-Many)

### Key Tables

1. **users** - Core user information
2. **premium_users** - Premium subscription tracking
3. **writings** - Writing exercises
4. **readings** - Reading exercises (with type enum)
5. **speakings** - Speaking exercises
6. **listenings** - Listening exercises (complex 4-section structure)
7. **quizzes** - Quiz data with JSON options
8. **blogs** - Blog posts
9. **forums** - Forum discussions (premium only)
10. **messages** - Forum messages
11. **vocabularies** - Vocabulary flash cards
12. **quiz_completions** - User progress tracking

## API Design

### RESTful Principles

- GET for retrieval
- POST for creation
- PUT for updates
- DELETE for removal

### Authentication

- JWT tokens in Authorization header
- Token expiration: 24 hours
- Refresh token mechanism (to be implemented)

### Response Format

```json
{
  "data": {},
  "message": "Success",
  "status": 200
}
```

## Security

### Authentication Flow

1. User submits credentials
2. Backend validates and generates JWT
3. Token stored in localStorage
4. Token sent in Authorization header for subsequent requests
5. Backend validates token on each request

### Authorization

- Premium features protected by backend checks
- User roles (to be extended)
- Resource-level permissions

## Migration Notes

### Firebase to PostgreSQL Mapping

- Firestore collections → PostgreSQL tables
- Document IDs → Auto-increment primary keys + UUIDs
- Nested documents → Separate tables with foreign keys
- Arrays → Element collections or JSON columns
- Timestamps → LocalDateTime with auditing

### Feature Parity

All original features maintained:
- ✅ All authentication methods
- ✅ All content modules (Reading, Writing, Listening, Speaking)
- ✅ Quiz system with completion tracking
- ✅ Vocabulary flash cards
- ✅ Blog posts
- ✅ Premium forums (with premium check)
- ✅ Settings and theme management

## Deployment Considerations

### Backend
- Spring Boot JAR deployment
- PostgreSQL database
- Environment variables for configuration
- JWT secret management

### Frontend
- React build (static files)
- Nginx or similar web server
- Environment variables for API URL
- CDN for static assets

## Future Enhancements

1. WebSocket support for real-time forum updates
2. File upload for images/audio
3. Payment gateway integration for premium
4. Email service for password reset
5. Admin panel for content management
6. Analytics and reporting
7. Caching layer (Redis)
8. Search functionality (Elasticsearch)


