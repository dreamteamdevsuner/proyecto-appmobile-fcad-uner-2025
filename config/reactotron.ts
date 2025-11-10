import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';

// Only configure Reactotron in development
// if (__DEV__) {
Reactotron.setAsyncStorageHandler(AsyncStorage) // Enable AsyncStorage inspection
  .configure({
    name: 'YourAppName',
    host: 'localhost', // Change to your IP if using a physical device
  })
  .useReactNative({
    asyncStorage: true, // Track AsyncStorage changes
    networking: {
      ignoreUrls: /symbolicate/, // Ignore symbolication requests
    },
    editor: false,
    errors: { veto: () => false },
    overlay: false,
  })
  .connect();

// Clear Reactotron on app load for a fresh start
Reactotron.clear!();

console.log('Reactotron Configured');
// }

export default Reactotron;
