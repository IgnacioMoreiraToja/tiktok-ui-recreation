import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons, FontAwesome6, FontAwesome5 } from '@expo/vector-icons';


const renderIcon = (name) => ({focused}) => {
    if (name === 'home') {
        return <FontAwesome6 name="house-chimney" size={20} color= {focused ? 'red' : 'black'} />
    }
    if (name === 'explore') {
        return <Ionicons name="compass-sharp" size={24} color={focused ? 'red' : 'black'} />
    }
    if (name === 'addPost') {
        return <FontAwesome6 name="plus" size={24} color={focused ? 'red' : 'black'} />
    }
    if (name === 'search') {
        return <MaterialIcons name="search" size={28} color={focused ? 'red' : 'black'} />
    }
    return <FontAwesome5 name="user-alt" size={20} color={focused ? 'red' : 'black'}/>
}

function TabLayout() {
    return (
        <Tabs screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarHideOnKeyboard: true}}>
            <Tabs.Screen name='home'    options={{tabBarIcon: renderIcon('home') }}   />
            <Tabs.Screen name='explore' options={{tabBarIcon: renderIcon('explore')}} />
            <Tabs.Screen name='addPost' options={{tabBarIcon: renderIcon('addPost')} }/>
            <Tabs.Screen name='search'  options={{tabBarIcon: renderIcon('search')}}  />
            <Tabs.Screen name='profile' options={{tabBarIcon: renderIcon('profile') }}/>
        </Tabs>
    );
}


export default TabLayout;