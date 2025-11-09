# Netflix Clone

A React-based Netflix clone with movie browsing, authentication UI, and responsive design.

## Features

- 🎬 Browse movies by categories (Action, Comedy, Horror, etc.)
- 🔥 Trending and top-rated content
- 🎯 Netflix Originals section
- 🔐 Login/Sign-up interface
- 📱 Responsive design
- 🎨 Netflix-style UI/UX

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## API

This app uses The Movie Database (TMDB) API to fetch movie data. The API key is included for demo purposes, but you should get your own from [TMDB](https://www.themoviedb.org/settings/api).

## Project Structure

```
src/
├── components/
│   ├── Nav.js          # Navigation bar
│   ├── Banner.js       # Hero banner
│   └── Row.js          # Movie rows
├── screens/
│   ├── HomeScreen.js   # Main app screen
│   └── LoginScreen.js  # Authentication screen
├── App.js              # Main app component
└── Requests.js         # API endpoints
```

## Technologies Used

- React 18
- React Router
- Axios for API calls
- CSS3 with Flexbox
- TMDB API

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
