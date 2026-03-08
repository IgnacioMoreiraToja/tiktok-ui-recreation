import { Stack } from "expo-router";

const Layout = () => (
    <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen
            name="[trend]" options={{ title: '' }}
        />
    </Stack>
);

export default Layout