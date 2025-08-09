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
- Supabase account

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

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Click the "Connect to Supabase" button in Bolt to set up the database
   - Or manually run the migration files in your Supabase SQL editor

4. Create a `.env` file in the root directory:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Important**: Replace the placeholder values with your actual Supabase credentials:
   - Go to your Supabase dashboard
   - Navigate to Settings > API
   - Copy the Project URL and anon/public key
   - Update the `.env` file with these values

5. Start the development server:
   ```bash
   npm run dev
   ```

### Mobile App Setup

To test on your Android device:

1. **Install Expo Go** on your Android device from Google Play Store

2. **For Development Testing:**
   - Make sure your Android device and computer are on the same WiFi network
   - Scan the QR code with Expo Go
   - The app should open in Expo Go

3. **If QR code scanning doesn't work:**
   - Try using the tunnel connection: `npx expo start --tunnel`
   - Or manually enter the URL shown in the terminal into Expo Go

4. **For Production Builds:**
   ```bash
   npx expo install --fix
   npx eas build --platform android --profile preview
   ```

### Deployment

To deploy this app to your Android device:

1. **For Development Testing:**
   ```bash
   npx expo install --fix
   npx eas build --platform android --profile preview
   ```

2. **For Production:**
   ```bash
   npx eas build --platform android --profile production
   ```

3. **Install on Device:**
   - Download and install the APK file
   - Or use Expo Go for development builds

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

- Android: `npm run android`
- Web: `npm run web`

### Environment Variables

Create different environment files for different environments:

- `.env` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

### Database Schema

The application uses Supabase with the following main tables:

- `users` - User profiles and authentication
- `owner_profiles` - Extended profiles for property owners
- `properties` - Property listings
- `property_media` - Images and videos for properties
- `featured_properties` - Premium property listings
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