import { Stack } from 'expo-router';

export default function App() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' options={{ title: 'Inicio' }} />
    </Stack>
  );
}
