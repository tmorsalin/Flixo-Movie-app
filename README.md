cat > README.md << 'EOF'
# Flixo Movie App

A mobile movie application built with React Native and Expo that allows users to browse, search, and discover movies.

## Features

- Browse trending and popular movies
- Search for movies
- View detailed movie information
- Save favorite movies
- User profiles

## Tech Stack

- React Native
- Expo
- TypeScript
- Tailwind CSS
- Appwrite

## Getting Started

1. Clone the repository
```
git clone https://github.com/tmorsalin/Flixo-Movie-app.git
cd Flixo-Movie-app
```

2. Install dependencies
```
npm install
```

3. Start the app
```
npm start
```

This will open Expo, where you can run the app on:
- Your mobile device using the Expo Go app
- An Android/iOS emulator
- A web browser

## Environment Variables

Create a `.env` file in the root directory with your API keys and configuration.
EOF

git add README.md
git commit -m "Update README"
git push
