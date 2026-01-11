# IELTS Prep Backend API Documentation
## For Figma UI/UX Design Reference

---

## 1. AUTHENTICATION & AUTHORIZATION

### Authentication Flow
- **JWT-based authentication** (Bearer token)
- All endpoints except `/auth/**` require authentication
- Token sent in `Authorization: Bearer <token>` header
- Token expiration: 24 hours

### User Roles
1. **Normal User** (`isPremium: false`)
   - Access to all practice content (Reading, Writing, Listening, Speaking)
   - Access to Vocabulary, Quiz, Blog
   - Cannot access Forums/Discussions
   - May see ads

2. **Premium User** (`isPremium: true`)
   - All normal user features
   - Access to Forums/Discussions
   - No ads
   - Premium status tracked in `premium_users` table

3. **Admin** (Not explicitly defined in backend - may be future feature)

---

## 2. REST API ENDPOINTS

### 2.1 Authentication Endpoints (`/api/auth`)

#### POST `/api/auth/signin`
- **Purpose**: Email/password login
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "string (required, valid email)",
    "password": "string (required)"
  }
  ```
- **Response**: `AuthResponse`
  ```json
  {
    "token": "JWT token string",
    "type": "Bearer",
    "id": "user ID (Long)",
    "uid": "user UID (string)",
    "email": "user email",
    "firstName": "user first name",
    "userImage": "profile image URL",
    "isPremium": "boolean"
  }
  ```

#### POST `/api/auth/signup`
- **Purpose**: User registration
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "string (required, valid email)",
    "password": "string (required, min 6 chars)",
    "firstName": "string (required)"
  }
  ```
- **Response**: `AuthResponse` (same as signin)

#### POST `/api/auth/google`
- **Purpose**: Google OAuth sign-in
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "idToken": "string (required, Google ID token)",
    "displayName": "string (optional)",
    "photoUrl": "string (optional)"
  }
  ```
- **Response**: `AuthResponse`

#### POST `/api/auth/anonymous`
- **Purpose**: Anonymous/guest sign-in
- **Auth Required**: No
- **Request Body**: None
- **Response**: `AuthResponse` (isPremium always false)

#### POST `/api/auth/reset-password`
- **Purpose**: Password reset (placeholder - not fully implemented)
- **Auth Required**: No
- **Request Body**: `String email`
- **Response**: 200 OK

---

### 2.2 Reading Endpoints (`/api/readings`)

#### GET `/api/readings/type/{type}`
- **Purpose**: Get readings filtered by type
- **Auth Required**: Yes
- **Path Parameters**: 
  - `type`: ReadingType enum (SENTENCE, TRUE_OR_FALSE, HEADING_COMPLETION, SUMMARY_COMPLETION, PARAGRAPH_COMPLETION, MCQS, LIST_SELECTION, TITLE_SELECTION, CATEGORIZATION, ENDING_SELECTION, SAQS)
- **Response**: `List<Reading>`

#### GET `/api/readings/{id}`
- **Purpose**: Get single reading by ID
- **Auth Required**: Yes
- **Path Parameters**: `id` (Long)
- **Response**: `Reading` or 404

#### GET `/api/readings/level/{level}`
- **Purpose**: Get readings filtered by level
- **Auth Required**: Yes
- **Path Parameters**: `level` (easy, medium, hard)
- **Response**: `List<Reading>`

**Reading Entity Fields**:
- `id`: Long
- `title`: String
- `level`: String (easy, medium, hard)
- `indicatorValue`: Double
- `type`: ReadingType enum
- `paragraph`: String (TEXT)
- `initialQuestions`: List<String>
- `endingQuestions`: List<String>
- `answers`: List<String>
- `initialQuestionNumbers`: String
- `endingQuestionNumbers`: String
- `whatToDo`: String (TEXT) - Instructions
- `summary`: String (TEXT)
- `extraData`: Boolean
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

---

### 2.3 Writing Endpoints (`/api/writings`)

#### GET `/api/writings`
- **Purpose**: Get all writing exercises
- **Auth Required**: Yes
- **Response**: `List<Writing>`

#### GET `/api/writings/{id}`
- **Purpose**: Get single writing by ID
- **Auth Required**: Yes
- **Path Parameters**: `id` (Long)
- **Response**: `Writing` or 404

#### GET `/api/writings/level/{level}`
- **Purpose**: Get writings filtered by level
- **Auth Required**: Yes
- **Path Parameters**: `level` (easy, medium, hard)
- **Response**: `List<Writing>`

**Writing Entity Fields**:
- `id`: Long
- `title`: String
- `level`: String (easy, medium, hard)
- `indicatorValue`: Double
- `question`: String (TEXT) - Writing prompt/question
- `answer`: String (TEXT) - Sample answer
- `image`: String - Image URL/path
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

---

### 2.4 Listening Endpoints

**Note**: No explicit controller found. Likely accessed via repository pattern or needs implementation.

**Expected Endpoints** (based on entity structure):
- `GET /api/listenings` - Get all listening exercises
- `GET /api/listenings/{id}` - Get single listening by ID

**Listening Entity Fields** (4 sections structure):
- `id`: Long
- `title`: String
- `level`: String (easy, medium, hard)
- `indicatorValue`: Double

**Section 1 Fields**:
- `whatToDo`: String (TEXT)
- `firstSectionAudio`: String (URL)
- `firstQuestionImage`: String (URL)
- `s1SubQuestions1`: List<String>
- `s1SubQuestions1Bool`: Boolean
- `s1SubQuestions1Numbers`: String
- `s1SubQuestions2`: List<String>
- `s1SubQuestions2Bool`: Boolean
- `s1SubQuestions2Numbers`: String
- `secondQuestionImage`: String
- `secondQuestionImageBool`: Boolean
- `initialQuestionNumbers`: String
- `answers`: List<String>

**Section 2 Fields**:
- `s2WhatToDo`: String (TEXT)
- `section2Audio`: String (URL)
- `section2Image1`: String (URL)
- `section2Image1Bool`: Boolean
- `section2Image2`: String (URL)
- `section2Image2Bool`: Boolean
- `s2SubQuestions1`: List<String>
- `s2SubQuestions1Bool`: Boolean
- `s2SubQuestion1Numbers`: String
- `s2SubQuestions2`: List<String>
- `s2SubQuestions2Bool`: Boolean
- `s2SubQuestion2Numbers`: String
- `section2Answers`: List<String>

**Section 3 Fields**:
- `s3WhatToDo`: String (TEXT)
- `section3Audio`: String (URL)
- `section3Image1`: String (URL)
- `section3Image1Bool`: Boolean
- `section3Image2`: String (URL)
- `section3Image2Bool`: Boolean
- `section3Image3`: String (URL)
- `section3Image3Bool`: Boolean
- `section3Question1`: List<String>
- `section3Question1Bool`: Boolean
- `section3Question1Numbers`: String
- `section3Question2`: List<String>
- `section3Questions2Bool`: Boolean
- `section3Question2Numbers`: String
- `section3Question3`: List<String>
- `section3Question3Bool`: Boolean
- `section3Question3Numbers`: String
- `section3Answers`: List<String>

**Section 4 Fields**:
- `s4WhatToDo`: String (TEXT)
- `section4Audio`: String (URL)
- `section4Question1Numbers`: String
- `section4Image1`: String (URL)
- `section4Image1Bool`: Boolean
- `section4Image2`: String (URL)
- `section4Image2Bool`: Boolean
- `section4Question1`: List<String>
- `section4Question1Bool`: Boolean
- `section4Question2`: List<String>
- `section4Question2Bool`: Boolean
- `section4Question2Numbers`: String
- `section4Question3`: List<String>
- `section4Question3Bool`: Boolean
- `section4Question3Numbers`: String
- `section4Answers`: List<String>

- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

---

### 2.5 Speaking Endpoints

**Note**: No explicit controller found. Likely accessed via repository pattern.

**Expected Endpoints**:
- `GET /api/speakings` - Get all speaking exercises
- `GET /api/speakings/{id}` - Get single speaking by ID

**Speaking Entity Fields**:
- `id`: Long
- `title`: String
- `level`: String (easy, medium, hard)
- `indicatorValue`: Double
- `thingsToSpeak`: List<String> - Topics/prompts to speak about
- `vocabulary`: List<String> - Suggested vocabulary words
- `answer`: String (TEXT) - Sample answer
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

---

### 2.6 Quiz Endpoints

**Note**: No explicit controller found. Likely accessed via repository pattern.

**Expected Endpoints**:
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/{id}` - Get single quiz by ID

**Quiz Entity Fields**:
- `id`: Long
- `quizTitle`: String
- `indicatorValue`: Double
- `question`: List<String> - List of questions
- `optionsJson`: String (TEXT) - JSON string for Map<Integer, List<String>> (options per question)
- `answers`: List<String> - Correct answers
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

**QuizCompletion Entity** (for tracking):
- `id`: Long
- `user`: User (ManyToOne)
- `quiz`: Quiz (ManyToOne)
- `completed`: Boolean
- `completedAt`: LocalDateTime

---

### 2.7 Blog Endpoints

**Note**: No explicit controller found. Likely accessed via repository pattern.

**Expected Endpoints**:
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/{id}` - Get single blog by ID

**Blog Entity Fields**:
- `id`: Long
- `title`: String (required)
- `imageUrl`: String
- `time`: LocalDateTime (required)
- `tags`: String (comma-separated)
- `content`: String (TEXT, required)
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

---

### 2.8 Vocabulary Endpoints

**Note**: No explicit controller found. Likely accessed via repository pattern.

**Expected Endpoints**:
- `GET /api/vocabularies` - Get all vocabulary words

**Vocabulary Entity Fields**:
- `id`: Long
- `word`: String (required)
- `description`: String (TEXT)
- `sentence`: String (TEXT) - Example sentence

---

### 2.9 Forum Endpoints (Premium Only)

**Note**: No explicit controller found. Based on README, expected endpoints:

**Expected Endpoints**:
- `GET /api/forums` - Get all forums (premium only)
- `POST /api/forums` - Create forum post (premium only)
- `GET /api/forums/{id}/messages` - Get messages for a forum
- `POST /api/forums/{id}/messages` - Post message to forum

**Forum Entity Fields**:
- `id`: Long
- `title`: String (required)
- `user`: User (ManyToOne, required)
- `firstName`: String - Denormalized user first name
- `userImage`: String - Denormalized user image
- `tags`: List<String>
- `sentAt`: LocalDateTime
- `updatedAt`: LocalDateTime

**Message Entity Fields**:
- `id`: Long
- `text`: String (TEXT, required)
- `user`: User (ManyToOne, required)
- `forum`: Forum (ManyToOne, required)
- `uid`: String - Denormalized user UID
- `createdAt`: LocalDateTime
- `updatedAt`: LocalDateTime

---

## 3. FRONTEND SCREENS REQUIRED

### 3.1 Authentication Screens

#### Login Screen
- **Fields**:
  - Email (text input, email validation)
  - Password (password input)
  - "Sign In" button
  - "Sign Up" link/button
  - "Continue as Guest" button
  - "Sign in with Google" button
- **Actions**:
  - Submit login form → POST `/api/auth/signin`
  - Navigate to signup
  - Anonymous sign-in → POST `/api/auth/anonymous`
  - Google sign-in → POST `/api/auth/google`
- **Response Handling**:
  - Store JWT token in localStorage
  - Store user data (id, email, firstName, userImage, isPremium)
  - Redirect to home screen

#### Sign Up Screen
- **Fields**:
  - First Name (text input, required)
  - Email (text input, email validation, required)
  - Password (password input, min 6 chars, required)
  - "Sign Up" button
  - "Already have account? Sign In" link
- **Actions**:
  - Submit registration → POST `/api/auth/signup`
- **Response Handling**:
  - Store JWT token and user data
  - Redirect to home screen

#### Password Reset Screen (if implemented)
- **Fields**:
  - Email (text input)
  - "Reset Password" button
- **Actions**:
  - Submit → POST `/api/auth/reset-password`

---

### 3.2 Home/Dashboard Screen

- **Navigation**:
  - Side menu/drawer with:
    - Home
    - Vocabulary
    - Blog
    - Quiz
    - Discussions (only if isPremium = true)
    - Premium
    - Settings
- **Main Content**:
  - 4 category cards:
    - Reading
    - Writing
    - Listening
    - Speaking
  - Each card clickable → navigates to respective practice screen
- **Header**:
  - App title/logo
  - Menu icon
  - Settings icon
  - User profile indicator (if applicable)

---

### 3.3 Reading Practice Screens

#### Reading List Screen
- **Data Source**: Multiple API calls to get readings by type
- **Display**:
  - Grid/list of reading cards
  - Each card shows:
    - Title
    - Level badge (easy/medium/hard)
    - Type badge
    - Summary preview (first 100 chars)
- **Filters** (optional):
  - Filter by type (dropdown)
  - Filter by level (dropdown)
- **Actions**:
  - Click card → Navigate to Reading Detail Screen
  - Fetch data: `GET /api/readings/type/{type}` for each type

#### Reading Detail Screen
- **Data Source**: `GET /api/readings/{id}`
- **Display Sections**:
  1. **Header**:
     - Title
     - Level badge
     - Type badge
     - Back button
  2. **Instructions**:
     - `whatToDo` field (full text)
  3. **Reading Passage**:
     - `paragraph` field (full text, scrollable)
  4. **Initial Questions**:
     - List of `initialQuestions` with question numbers
  5. **Ending Questions**:
     - List of `endingQuestions` with question numbers
  6. **Summary** (if available):
     - `summary` field
- **Actions**:
  - View passage
  - Answer questions (UI only - no submission endpoint)
  - View answers (if answers field available)
- **Note**: No answer submission endpoint exists - this is read-only practice

---

### 3.4 Writing Practice Screens

#### Writing List Screen
- **Data Source**: `GET /api/writings`
- **Display**:
  - Grid/list of writing cards
  - Each card shows:
    - Title
    - Level badge
    - Question preview (first 150 chars)
    - Image thumbnail (if available)
- **Filters** (optional):
  - Filter by level
- **Actions**:
  - Click card → Navigate to Writing Detail Screen

#### Writing Detail Screen
- **Data Source**: `GET /api/writings/{id}`
- **Display Sections**:
  1. **Header**:
     - Title
     - Level badge
     - Back button
  2. **Image** (if available):
     - `image` field (full-size display)
  3. **Question/Prompt**:
     - `question` field (full text)
  4. **Sample Answer** (expandable/collapsible):
     - `answer` field
- **Actions**:
  - View prompt
  - Write response (text area - local only, no submission)
  - View sample answer
- **Note**: No answer submission endpoint exists

---

### 3.5 Listening Practice Screens

#### Listening List Screen
- **Data Source**: `GET /api/listenings` (expected)
- **Display**:
  - Grid/list of listening cards
  - Each card shows:
    - Title
    - Level badge
    - Instructions preview (`whatToDo` first 150 chars)
- **Filters** (optional):
  - Filter by level
- **Actions**:
  - Click card → Navigate to Listening Detail Screen

#### Listening Detail Screen
- **Data Source**: `GET /api/listenings/{id}` (expected)
- **Display Structure**: 4 Sections (Section 1, 2, 3, 4)
- **Each Section Contains**:
  1. **Instructions**:
     - `whatToDo` / `s2WhatToDo` / `s3WhatToDo` / `s4WhatToDo`
  2. **Audio Player**:
     - Audio URL (`firstSectionAudio` / `section2Audio` / `section3Audio` / `section4Audio`)
  3. **Images** (if available):
     - Multiple images per section (with boolean flags)
  4. **Questions**:
     - Sub-questions lists (1, 2, 3 per section)
     - Question numbers
  5. **Answers**:
     - Answers list (if available)
- **Actions**:
  - Play audio
  - View images
  - Answer questions (UI only)
  - View answers
- **Note**: Complex structure with multiple sub-questions per section

---

### 3.6 Speaking Practice Screens

#### Speaking List Screen
- **Data Source**: `GET /api/speakings` (expected)
- **Display**:
  - Grid/list of speaking cards
  - Each card shows:
    - Title
    - Level badge
    - Topics preview (first 3 items from `thingsToSpeak`)
- **Filters** (optional):
  - Filter by level
- **Actions**:
  - Click card → Navigate to Speaking Detail Screen

#### Speaking Detail Screen
- **Data Source**: `GET /api/speakings/{id}` (expected)
- **Display Sections**:
  1. **Header**:
     - Title
     - Level badge
     - Back button
  2. **Things to Speak About**:
     - List of `thingsToSpeak` items
  3. **Vocabulary Suggestions**:
     - Chips/tags of `vocabulary` words
  4. **Sample Answer** (expandable):
     - `answer` field
- **Actions**:
  - View topics
  - Practice speaking (no recording endpoint)
  - View vocabulary
  - View sample answer
- **Note**: No recording/submission endpoint exists

---

### 3.7 Vocabulary Screen

- **Data Source**: `GET /api/vocabularies`
- **Display**:
  - Flash card interface (swipeable or paginated)
  - Each card shows:
    - **Word** (large, prominent)
    - **Description** (definition)
    - **Sentence** (example usage, italic)
- **Navigation**:
  - Previous/Next buttons
  - Card counter (e.g., "1 / 50")
- **Actions**:
  - Navigate through cards
  - Text-to-speech (frontend only - no backend endpoint)
- **Note**: Static data, no user progress tracking

---

### 3.8 Quiz Screens

#### Quiz List Screen
- **Data Source**: `GET /api/quizzes`
- **Display**:
  - Grid/list of quiz cards
  - Each card shows:
    - Quiz title
    - Number of questions
    - Completion indicator (if user has completed)
- **Actions**:
  - Click card → Navigate to Quiz Detail Screen

#### Quiz Detail Screen
- **Data Source**: `GET /api/quizzes/{id}`
- **Display**:
  - Quiz title
  - Questions list:
    - Each question from `question` array
    - Options from `optionsJson` (parsed JSON)
    - Radio buttons or checkboxes for selection
- **Actions**:
  - Select answers
  - Submit quiz (if endpoint exists)
  - View results (compare with `answers` array)
- **Note**: `optionsJson` needs parsing - format: `Map<Integer, List<String>>`

#### Quiz Results Screen
- **Display**:
  - Score (correct/total)
  - Per-question feedback
  - Correct answers shown
- **Actions**:
  - Mark as completed (if `QuizCompletion` endpoint exists)
  - Retake quiz
  - Return to quiz list

---

### 3.9 Blog Screens

#### Blog List Screen
- **Data Source**: `GET /api/blogs`
- **Display**:
  - Grid/list of blog cards
  - Each card shows:
    - Title
    - Image thumbnail (`imageUrl`)
    - Date (`time` formatted)
    - Tags (chips from `tags` string, comma-separated)
    - Content preview (first 150 chars)
- **Filters** (optional):
  - Filter by tags
  - Sort by date
- **Actions**:
  - Click card → Navigate to Blog Detail Screen

#### Blog Detail Screen
- **Data Source**: `GET /api/blogs/{id}`
- **Display**:
  1. **Header**:
     - Title
     - Date (formatted)
     - Back button
  2. **Image** (if available):
     - Full-width `imageUrl`
  3. **Tags**:
     - Chips from `tags`
  4. **Content**:
     - Full `content` text (formatted, scrollable)
- **Actions**:
  - Read article
  - Share (if implemented)

---

### 3.10 Forum/Discussions Screens (Premium Only)

#### Forum List Screen
- **Data Source**: `GET /api/forums`
- **Access**: Premium users only (`isPremium: true`)
- **Display**:
  - List of forum posts
  - Each post shows:
    - Title
    - Author (firstName, userImage)
    - Tags (chips)
    - Date (`sentAt`)
- **Actions**:
  - Click post → Navigate to Forum Detail Screen
  - Create new post → Navigate to Create Forum Screen

#### Create Forum Screen
- **Data Source**: `POST /api/forums`
- **Fields**:
  - Title (text input, required)
  - Tags (multi-select or comma-separated input)
  - "Create Post" button
- **Actions**:
  - Submit → POST `/api/forums`
  - Redirect to Forum Detail Screen

#### Forum Detail Screen
- **Data Source**: 
  - Forum: `GET /api/forums/{id}` (expected)
  - Messages: `GET /api/forums/{id}/messages`
- **Display**:
  1. **Forum Post**:
     - Title
     - Author info
     - Tags
     - Date
  2. **Messages List**:
     - Each message shows:
       - Text
       - Author (user info)
       - Timestamp (`createdAt`)
  3. **Message Input**:
     - Text area
     - "Post Message" button
- **Actions**:
  - View messages
  - Post message → POST `/api/forums/{id}/messages`
  - Refresh messages list

---

### 3.11 Premium Screen

- **Display**:
  - Premium features list
  - Pricing information
  - "Upgrade to Premium" button
- **Actions**:
  - Initiate payment (integration with payment gateway)
  - After payment: Create `PremiumUser` record
  - Update user `isPremium` status
- **Note**: Payment processing not in backend - handled by payment gateway

---

### 3.12 Settings Screen

- **Sections**:
  1. **Profile**:
     - First Name (editable)
     - Email (read-only or editable)
     - Profile Image (upload/change)
  2. **Preferences**:
     - Dark theme toggle (localStorage only)
  3. **Support**:
     - Contact support link/button
     - Feedback form
  4. **About**:
     - App version
     - Credits
  5. **Account**:
     - Sign out button
- **Actions**:
  - Update profile (if endpoint exists)
  - Toggle theme
  - Submit feedback
  - Sign out (clear token, redirect to login)

---

## 4. DATA FLOW SUMMARY

### Authentication Flow
1. User submits login/signup → POST `/api/auth/*`
2. Backend returns JWT token + user data
3. Frontend stores token in localStorage
4. All subsequent requests include: `Authorization: Bearer <token>`
5. JWT filter validates token on each request

### Content Access Flow
1. User navigates to practice screen
2. Frontend calls GET endpoint (e.g., `/api/writings`)
3. Backend validates JWT token
4. Backend returns content data
5. Frontend displays cards/list
6. User clicks item → Navigate to detail screen
7. Frontend calls GET by ID endpoint
8. Display full content

### Premium Feature Flow
1. Check `isPremium` from user data
2. If false: Show premium upgrade prompt
3. If true: Allow access to forums
4. Premium status checked on forum endpoints

---

## 5. UI/UX DESIGN CONSIDERATIONS

### Color Coding by Module
- Reading: Blue (#4A90E2)
- Writing: Green (#50C878)
- Listening: Red (#FF6B6B)
- Speaking: Purple (#9B59B6)

### Level Indicators
- Easy: Green badge
- Medium: Orange/Yellow badge
- Hard: Red badge

### Premium Indicators
- Premium badge/icon for premium users
- Lock icon for premium-only features
- Upgrade prompts for non-premium users

### Loading States
- Show loading spinner during API calls
- Skeleton screens for content loading

### Error States
- 401: Redirect to login
- 403: Show premium upgrade message
- 404: Show "Not found" message
- 500: Show error message with retry

### Empty States
- "No content available" messages
- Empty state illustrations

---

## 6. MISSING ENDPOINTS (Need Implementation)

Based on entity structure, these endpoints are expected but controllers not found:
- `GET /api/listenings`
- `GET /api/listenings/{id}`
- `GET /api/speakings`
- `GET /api/speakings/{id}`
- `GET /api/quizzes`
- `GET /api/quizzes/{id}`
- `GET /api/blogs`
- `GET /api/blogs/{id}`
- `GET /api/vocabularies`
- `GET /api/forums`
- `POST /api/forums`
- `GET /api/forums/{id}`
- `GET /api/forums/{id}/messages`
- `POST /api/forums/{id}/messages`

**Note**: These may be accessed via repository pattern or need controller implementation.

---

## 7. API BASE URL

- **Development**: `http://localhost:8080/api`
- **Context Path**: `/api` (configured in application.yml)
- **CORS**: Enabled for `http://localhost:3000`

---

## END OF DOCUMENTATION

This document provides complete backend API structure for Figma UI/UX design.
All endpoints, data structures, and user flows are documented as they exist in the backend.

