# test-frontend

React frontend for the test application with sign-in flow.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on http://localhost:3000 and proxy API calls to the backend.

## Features

- Sign-in form with email and password
- Form validation
- API integration with backend
- JWT token storage
- Responsive design

## Usage

1. Make sure the backend is running on port 5000
2. Start the frontend with `npm run dev`
3. Open http://localhost:3000 in your browser
4. First create an account using the signup endpoint (via API testing tool)
5. Then use the sign-in form to authenticate
