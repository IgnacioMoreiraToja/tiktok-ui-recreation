import React, { useState } from "react";
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import LoginModal from "./login";
import { useLoggedUser } from "../context/LoggedUser";
import { addRemoveFollow } from "../service/api";
import NetworkErrorToast from './NetworkErrorToast';

const {width} = Dimensions.get('window');

const UserProfile = ({data: {id, username, followers, following, image}, setLoggedUser}) => {
    const { loggedUserID, logOut, token } = useLoggedUser();
    const [isFollowing, setIsFollowing] = useState(loggedUserID && followers.some((follower) => follower.id === loggedUserID))
    const [followersAmount, setFollowersAmount] = useState(followers.length);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [networkError, setNetworkError] = useState(false);

    const handleAlterFollow = () => {
        token ? addRemoveFollow(id, token)
            .then(() =>{
                setIsFollowing(x => !x);
                setFollowersAmount(x => isFollowing ? x -1 : x + 1);
            })
            .catch((e) => {
                if (e.response && e.response.status === 401) {
                    setIsModalOpen(true)
                } else {
                    setNetworkError(true)
                    setTimeout(() => setNetworkError(false), 3000);
                }
            }
            ) : setIsModalOpen(true)
    }

    return (
        <SafeAreaView style={styles.container}>
            {isModalOpen ? <LoginModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /> : null}
            <View style={styles.user}>
                <Image source = {{uri: image}} style={styles.image}/>
                <Text style={styles.username}> {username} </Text>
            </View>
            { loggedUserID === id ?
            <Pressable style = {[styles.buttons, styles.unfollow]}
                        onPress = {() => { logOut()
                        setLoggedUser(null)}}>
                <Text style={styles.textUnfollow}> Log Out</Text>
            </Pressable> :
            <Pressable style = {[styles.buttons, isFollowing ? styles.unfollow : styles.follow]}
                       onPress={handleAlterFollow}>
                <Text style={ isFollowing ? styles.textUnfollow : styles.textFollow}> {isFollowing ? 'Unfollow' : 'Follow'}</Text>
            </Pressable>
            }
            <View style = {styles.followsAmmounts}>
                <Text style={styles.followersText}> {followers ? followersAmount : 0} Followers</Text>
                <Text style={styles.followersText}> {following.length} Following</Text>
            </View>
            {networkError && <NetworkErrorToast/>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width - 20,
        right: 10,
        left: 10,
        top: 40,
        height: 186,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 1,
        shadowColor: "#00000040",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    user : {
        flexDirection: 'row',
        width: 180,
        height: 48,
        alignItems: 'center',
        justifyContent: 'flex-start',
    }, 
    image: {
        width: 48,
        height: 48,
        borderRadius: 24,
    }, 
    username: {
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 8,
    }, 
    buttons: {
        width: 100,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginTop: 20,
    },
    follow: {
        backgroundColor: '#FE2C55',
    }, 
    textFollow: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    }, 
    unfollow: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FE2C55',
        borderWidth: 1,
    }, 
    textUnfollow: {
        color: '#FE2C55',
        fontSize: 16,
        fontWeight: '700',
    },
    followsAmmounts: {
        flexDirection: 'row',
        marginTop: 20,
    },
    followersText: {
        fontSize: 18,
        fontWeight: '700',
    }
})
export default UserProfile;