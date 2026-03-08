import { Stack } from 'expo-router';

const Layout = () => (
    <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen
            name="[id]" options={{ title: '' }}
        />
    </Stack>
);

export default Layout;