import React from "react";
import { FlatList, View } from "react-native";
import PostProfile from "./PostProfile";
import Spinner from "./Spinner";
import UserProfile from "./UserProfile";

const ProfilePage = ({ user, setLoggedUser }) => {

    return (
        !user ? <Spinner/> :
            <View>
                <UserProfile data={user} setLoggedUser={setLoggedUser}/>
                <View style={{width: '100%', height: 100, backgroundColor: 'transparent'}}/>
                <FlatList
                    data={user.posts.slice(0, 15)}
                    renderItem={({item}) => <PostProfile key={item.id} data={item}/>}
                    numColumns={3}
                    ListEmptyComponent={EmptyRenderItem}
                />
            </View>
    )
}

const EmptyRenderItem = () => {
    return <View style={{ flex: 1 }} />;
};

export default ProfilePage;