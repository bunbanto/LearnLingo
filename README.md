# LearnLingo

LearnLingo is a React application for an online language-learning company. Users can browse teachers, filter them by teaching language, student level and hourly price, open detailed reviews, book a trial lesson, and save favorite teachers after authorization.

## Features

- Home page with company advantages and navigation to the teachers catalog
- Teachers page with local `teachers.json` data
- Pagination by four teacher cards with a Load more action
- Filters by language, level and lesson price
- Private Favorites page for authorized users
- Firebase Authentication registration, login, current user tracking and logout
- Persistent favorites stored per authorized user in localStorage
- Login, registration and booking forms built with react-hook-form and yup
- Modal closing by close button, backdrop click and Escape

## Technologies

- React
- TypeScript
- Vite
- React Router
- Firebase Authentication
- Firebase Realtime Database
- react-hook-form
- yup
- lucide-react

## Data

The teacher catalog is loaded from the repository `teachers.json` file with the fields required by the technical task:

`name`, `surname`, `languages`, `levels`, `rating`, `reviews`, `price_per_hour`, `lessons_done`, `avatar_url`, `lesson_info`, `conditions`, `experience`.

Favorites are stored in localStorage under a per-user key based on the authorized user's `uid`.

## Environment

Create a `.env` file with Firebase project values:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Layout And Task

The interface follows the provided LearnLingo mockup: a desktop-first Home page, teacher cards, auth popups, booking popup and catalog states with a warm yellow accent palette.

The project implements the main technical task and the extra task: routing with React Router and catalog filtering.
