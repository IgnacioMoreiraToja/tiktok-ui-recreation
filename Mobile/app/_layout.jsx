import { Stack } from 'expo-router';

import LoggedUserProvider from '../context/LoggedUser';

const Layout = () => (

    <LoggedUserProvider>
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="(tabs)"/>
            <Stack.Screen name="post"/>
            <Stack.Screen name="profile"/>
            <Stack.Screen name="trends" />
            <Stack.Screen name="networkError"/>
        </Stack>
    </LoggedUserProvider>

);

export default Layout;