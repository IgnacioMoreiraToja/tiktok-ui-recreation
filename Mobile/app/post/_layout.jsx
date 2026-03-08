import { Stack } from "expo-router";


const Layout = () => (
    <Stack screenOption={{headerShown: true}}>
        <Stack.Screen
            name = "[p_id]" options={{ title: '' }}
        />
    </Stack>
)

export default Layout