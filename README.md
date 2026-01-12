# IELTS Prep Web Application

IELTS preparation  web-based system.

## Technology Stack

### Backend
- **Framework**: Spring Boot 2.7.18
- **Language**: Java 11
- **Database**: PostgreSQL
- **Security**: Spring Security with JWT
- **Architecture**: RESTful API with layered architecture (Controller/Service/Repository)

### Frontend
- **Framework**: React (with modern hooks)
- **UI Library**: Material-UI or Ant Design (dashboard-style)
- **State Management**: React Context API / Redux
- **HTTP Client**: Axios
- **Routing**: React Router

## Project Structure

```
ielts-prep-web/
├── backend/                    # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ielts/
│   │   │   │   ├── entity/     # JPA Entities
│   │   │   │   ├── repository/ # Data Access Layer
│   │   │   │   ├── service/    # Business Logic Layer
│   │   │   │   ├── controller/ # REST Controllers
│   │   │   │   ├── dto/        # Data Transfer Objects
│   │   │   │   ├── security/   # Security Configuration
│   │   │   │   └── util/       # Utility Classes
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   └── pom.xml
│
└── frontend/                   # React Application
    ├── src/
    │   ├── components/        # Reusable Components
    │   ├── pages/             # Page Components
    │   ├── services/          # API Services
    │   ├── context/           # Context API
    │   ├── utils/             # Utilities
    │   └── App.js
    ├── package.json
    └── public/
```

## Database Schema

### Core Tables
- `users` - User accounts (email, Google OAuth, anonymous)
- `premium_users` - Premium subscription tracking
- `writings` - Writing exercises
- `speakings` - Speaking exercises
- `readings` - Reading exercises (with type enum)
- `listenings` - Listening exercises (4 sections)
- `quizzes` - Quiz data
- `blogs` - Blog posts
- `forums` - Forum discussions (premium only)
- `messages` - Forum messages
- `vocabularies` - Vocabulary flash cards
- `quiz_completions` - User quiz completion tracking

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Email/password login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/google` - Google OAuth sign-in
- `POST /api/auth/anonymous` - Anonymous guest sign-in
- `POST /api/auth/reset-password` - Password reset

### Content
- `GET /api/writings` - Get all writing exercises
- `GET /api/writings/{id}` - Get writing by ID
- `GET /api/readings/type/{type}` - Get readings by type
- `GET /api/speakings` - Get all speaking exercises
- `GET /api/listenings` - Get all listening exercises
- `GET /api/quizzes` - Get all quizzes
- `GET /api/blogs` - Get all blog posts
- `GET /api/vocabularies` - Get all vocabulary words

### Premium Features
- `GET /api/forums` - Get forums (premium only)
- `POST /api/forums` - Create forum post (premium only)
- `GET /api/forums/{id}/messages` - Get forum messages
- `POST /api/forums/{id}/messages` - Post message to forum

## Features (Exact Match with Original)

### 1. Authentication
- ✅ Email/Password sign up and login
- ✅ Google Sign-In
- ✅ Anonymous sign-in (Guest mode)
- ✅ Password reset
- ✅ User profile management

### 2. Home Screen
- ✅ 4 main categories: Reading, Writing, Listening, Speaking
- ✅ Side menu navigation
- ✅ Premium user check (ads shown for non-premium)

### 3. Reading Module
- ✅ Multiple question types: Sentence Completion, True/False, Heading Completion, Summary Completion, Paragraph Completion, MCQs, List Selection, Title Selection, Categorization, Ending Selection, Short Answers
- ✅ Each reading has: title, level, paragraph, questions, answers, whatToDo instructions

### 4. Writing Module
- ✅ Writing prompts with questions
- ✅ Sample answers
- ✅ Images for prompts
- ✅ Level indicators

### 5. Listening Module
- ✅ 4 sections per listening exercise
- ✅ Each section has: audio, images, questions, answers
- ✅ Complex structure with multiple sub-questions per section

### 6. Speaking Module
- ✅ Speaking prompts
- ✅ Things to speak about
- ✅ Vocabulary suggestions
- ✅ Sample answers

### 7. Vocabulary
- ✅ Flash card system (swipe cards)
- ✅ Word, description, sentence
- ✅ Text-to-speech for pronunciation
- ✅ Static data (hardcoded vocabulary list)

### 8. Quiz
- ✅ Multiple quizzes
- ✅ Each quiz has multiple questions with options
- ✅ Answers tracking
- ✅ Completion tracking (checkboxes)
- ✅ Quiz results

### 9. Blog
- ✅ Blog posts with title, image, content, tags, timestamp
- ✅ Blog detail view

### 10. Forums/Discussions (Premium only)
- ✅ Create discussion posts
- ✅ Tags system
- ✅ Chat/messaging functionality
- ✅ User interactions

### 11. Premium Features
- ✅ In-app purchase integration (web equivalent: payment gateway)
- ✅ Remove ads
- ✅ Unlock forums
- ✅ Premium user tracking

### 12. Settings
- ✅ Dark theme toggle
- ✅ Contact support
- ✅ Feedback form
- ✅ About/Credits
- ✅ Sign out

## Setup Instructions

### Backend Setup

1. **Prerequisites**
   - Java 11 or higher
   - Maven 3.6+
   - PostgreSQL 12+

2. **Database Setup**
   ```sql
   CREATE DATABASE ielts_prep;
   ```

3. **Configuration**
   - Update `backend/src/main/resources/application.yml` with your database credentials
   - Set `JWT_SECRET` environment variable (minimum 32 characters)

4. **Run Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Prerequisites**
   - Node.js 16+ and npm

2. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Run Frontend**
   ```bash
   npm start
   ```

## Development Notes

- All existing functionalities remain exactly the same
- Application logic, modules, and user flow stay identical
- Only technology stack changed: Flutter → React, Firebase → Spring Boot + PostgreSQL
- Architecture follows RESTful, layered design (Controller/Service/Repository)

## Migration from Firebase

The original Firebase collections have been mapped to PostgreSQL tables:
- `users` → `users` table
- `writing` → `writings` table
- `speaking` → `speakings` table
- `reading/{type}` → `readings` table with `type` enum
- `listening` → `listenings` table
- `quiz` → `quizzes` table
- `blogs` → `blogs` table
- `forums` → `forums` table
- `premium_users` → `premium_users` table




