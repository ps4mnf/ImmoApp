# Real Estate App

A modern real estate application built with Expo Router and Supabase, featuring property listings, user authentication, messaging, and agent profiles.

## Features

- 🏠 Property Listings
  - Browse properties for sale and rent
  - Advanced search and filtering
  - Premium property listings
  - Detailed property views with image galleries

- 👤 User Authentication
  - Secure email/password authentication
  - User profiles
  - Agent registration and verification

- 💬 Messaging System
  - Real-time chat between users and agents
  - Property-specific inquiries
  - Message notifications

- ❤️ Favorites
  - Save favorite properties
  - Quick access to saved listings
  - Property comparison

- 🏢 Agent Dashboard
  - Property management
  - Listing creation and editing
  - Message management
  - Profile customization

## Tech Stack

- **Frontend Framework**: React Native with Expo
- **Routing**: Expo Router v4
- **Database & Auth**: Supabase
- **UI Components**: Native components with custom styling
- **Icons**: Lucide React Native
- **Image Handling**: Expo Image
- **Animations**: React Native Reanimated
- **Gesture Handling**: React Native Gesture Handler

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd real-estate-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
real-estate-app/
├── app/                    # Application routes
│   ├── (tabs)/            # Tab-based navigation
│   ├── auth/              # Authentication routes
│   ├── agent/             # Agent-specific routes
│   └── property/          # Property-related routes
├── components/            # Reusable components
├── constants/             # App constants
├── hooks/                 # Custom React hooks
├── services/             # API and service functions
├── types/                # TypeScript type definitions
└── supabase/            # Supabase configurations
```

## Development

### Running the App

- Web: `npm run web`
- iOS: `npm run ios`
- Android: `npm run android`

### Environment Variables

Create different environment files for different environments:

- `.env` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

### Database Schema

The application uses the following main tables:

- `users` - User profiles and authentication
- `properties` - Property listings
- `favorites` - Saved properties
- `messages` - User-agent communication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Expo](https://expo.dev/) - React Native framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Pexels](https://www.pexels.com/) - Stock photos