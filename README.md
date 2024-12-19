# OdoWatch

A React Native application that automatically tracks your car's odometer reading by monitoring Bluetooth connectivity and location. OdoWatch recognizes different vehicles by their Bluetooth signatures and supports shared access, allowing multiple drivers to contribute to accurate odometer tracking for the same vehicle.

## Features

- Multi-vehicle support with Bluetooth device recognition
- Shared vehicle access and tracking
- Automatic distance tracking when connected to car's Bluetooth
- Estimated odometer reading maintenance
- Real-time location tracking during drives
- Drive session tracking by driver
- Current latitude and longitude display

## How It Works

1. Register your car's Bluetooth device(s)
2. Share access with other drivers
3. Automatically recognizes the car when any authorized user connects to the car's Bluetooth
4. Tracks distance for all driving sessions
5. Maintains a single, synchronized odometer reading across all users
6. Logs driving history with driver identification

## Vehicle Sharing Features

- Invite other drivers to track your vehicle
- View driving history by driver
- Manage driver access permissions
- Real-time odometer synchronization across users
- Individual drive session logs

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development)
- Android Studio & Android SDK (for Android development)
- Bluetooth-enabled vehicle

## Installation

1. Clone the repository:

   ```bash
   git clone [your-repo-url]/odowatch
   cd odowatch
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

## Development

### Running in Expo Go

1. Start the development server:

   ```bash
   npx expo start
   ```

2. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

### Creating a Development Build

1. Install the development client:

   ```bash
   npx expo install expo-dev-client
   ```

2. Create platform-specific builds:

   ```bash
   # For iOS
   npx expo prebuild -p ios
   npx expo run:ios

   # For Android
   npx expo prebuild -p android
   npx expo run:android
   ```

## Production Deployment

### iOS

1. Configure app.json:

   ```json
   {
     "expo": {
       "name": "OdoWatch",
       "ios": {
         "bundleIdentifier": "com.yourcompany.odowatch",
         "infoPlist": {
           "NSBluetoothAlwaysUsageDescription": "OdoWatch uses Bluetooth to identify and track your vehicles.",
           "NSLocationWhenInUseUsageDescription": "OdoWatch needs location access to track distance traveled while driving.",
           "UIBackgroundModes": ["location", "bluetooth-central"]
         }
       }
     }
   }
   ```

### Android

1. Configure app.json:

   ```json
   {
     "expo": {
       "name": "OdoWatch",
       "android": {
         "package": "com.yourcompany.odowatch",
         "permissions": [
           "BLUETOOTH",
           "BLUETOOTH_ADMIN",
           "ACCESS_FINE_LOCATION",
           "ACCESS_COARSE_LOCATION"
         ]
       }
     }
   }
   ```

2. Build for either platform:

   ```bash
   eas build --platform ios
   # or
   eas build --platform android
   ```

## Required Permissions

The app requires the following permissions:
- Bluetooth
- Location Services
- Background App Refresh
- Background Location Updates

## Setup Instructions

1. Install the app
2. Create an account
3. Add a vehicle:
   - Enter vehicle details
   - Connect to vehicle's Bluetooth
   - Enter current odometer reading
4. (Optional) Share vehicle:
   - Invite other drivers
   - Manage access permissions
5. Start driving - OdoWatch will automatically track mileage

## Vehicle Management

- Add multiple vehicles
- Share vehicles with other users
- View per-vehicle statistics
- Track maintenance schedules
- View driving history by vehicle and driver
- Allow users to remove vehicles from their shared vehicles list
- Implement a feature to edit vehicle details (e.g., name, odometer)
- Allow owners to remove users from a shared vehicle that they own

## Troubleshooting

If tracking isn't working, check:
1. Bluetooth is enabled and connected to your car
2. Location permissions are granted
3. Device location services are enabled
4. Background app refresh is enabled
5. App has proper permissions in device settings
6. Vehicle sharing permissions are properly configured

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

# TODO List for Upcoming Releases

## User Authentication Enhancements
- [ ] Implement email verification for new users.
- [ ] Add password reset functionality.

## Invitation Management
- [ ] Implement notifications for users when they receive an invitation.
- [ ] Create a UI for users to view and manage their pending invites.

## Vehicle Management
- [ ] Allow users to remove vehicles from their shared vehicles list.
- [ ] Implement a feature to edit vehicle details (e.g., name, odometer).
- [ ] Allow owners to remove users from a shared vehicle that they own.

## Error Handling and Logging
- [ ] Improve error handling in Firebase functions to provide more user-friendly messages.
- [ ] Set up logging for Firebase functions to monitor usage and errors.

## Testing and Validation
- [ ] Write unit tests for Firebase functions to ensure reliability.
- [ ] Implement input validation for user data (e.g., email format, vehicle ID format).

## User Experience Improvements
- [ ] Enhance the UI/UX of the invitation process (e.g., loading indicators, success messages).
- [ ] Add tooltips or help sections for users to understand how to use the app features.

## Performance Optimization
- [ ] Optimize Firestore queries to reduce read costs and improve performance.
- [ ] Review and optimize the structure of Firestore documents for better scalability.

## Documentation
- [ ] Update API documentation for Firebase functions.
- [ ] Create user documentation or guides for using the app features.

## Future Features
- [ ] Consider implementing a feature for users to see a history of their vehicle usage.
- [ ] Explore the possibility of integrating third-party services (e.g., for vehicle maintenance reminders).

## Deployment and CI/CD
- [ ] Set up continuous integration and deployment (CI/CD) for Firebase functions.
- [ ] Automate testing and deployment processes to streamline updates.

---

**Notes**
- Prioritize tasks based on user feedback and business needs.
- Regularly review and update the TODO list as new requirements arise or tasks are completed.
