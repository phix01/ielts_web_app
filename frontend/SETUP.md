# Frontend Setup Instructions

## Prerequisites
- Node.js 16+ and pnpm installed
- Backend running on `http://localhost:8080`

## Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The frontend will run on `http://localhost:3000` (configured to match backend CORS settings).

## Environment Variables

Create a `.env` file in the frontend root (optional):

```
VITE_API_URL=http://localhost:8080/api
```

If not set, defaults to `http://localhost:8080/api`.

## Important Notes

1. **Port Configuration**: Frontend is configured to run on port 3000 to match backend CORS settings.

2. **Backend Must Be Running**: Ensure the Spring Boot backend is running on port 8080 before starting the frontend.

3. **CORS**: Backend CORS is configured to allow `http://localhost:3000`. If you change the frontend port, update the backend CORS configuration.

## Troubleshooting

### POST requests not reaching backend
- Check that backend is running on port 8080
- Verify CORS configuration in backend matches frontend port
- Check browser console for CORS errors

### Authentication not working
- Verify backend is running and accessible
- Check browser network tab to see actual requests/responses
- Ensure JWT token is being stored in localStorage (check Application tab in DevTools)

### Network errors
- Ensure backend is running: `cd backend && mvn spring-boot:run`
- Check backend logs for errors
- Verify database connection in backend

