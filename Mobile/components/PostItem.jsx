import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import LoginModal from "./login";
import CommentsModal from "./commentsModal";
import { AntDesign, Fontisto, Ionicons } from '@expo/vector-icons';
import { useLoggedUser } from "../context/LoggedUser";
import { addRemoveLike } from "../service/api";
import NetworkErrorToast from './NetworkErrorToast';


const { height, width } = Dimensions.get('window');

const Post = ({data: {id, user, title, description, video, commentsAmount, likes}, shouldPlay}) => {
    const videoRef     = React.useRef(null);

    const { loggedUserID, token } = useLoggedUser();
    const [likesAmount, setLikesAmount]    = useState(likes.length);
    const [liked, setLiked] = useState(loggedUserID && likes.some((like) => like.id === loggedUserID));
    const [commentsLength, setCommentsLength] = useState(commentsAmount);
    const [isCommentsModalOpen, setIsCommentsModalOpen]      = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [networkError, setNetworkError] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setLiked(loggedUserID && likes.some((like) => like.id === loggedUserID));
    }, [loggedUserID]);

    const handleAlterLike = () => {
        token ? addRemoveLike(id, token)
            .then((request) => {
                setLiked(x => !x);
                setLikesAmount(request.data.likes.length)
            })
            .catch((e) => {
                if (e.response && e.response.status === 401) {
                    setIsModalOpen(true);
                } else {
                    setNetworkError(true)
                    setTimeout(() => setNetworkError(false), 3000);
                }
            }) : setIsModalOpen(true);
    }

    const goToComments = () => {
        setIsCommentsModalOpen(true);
    }

    return (
        <SafeAreaView style={styles.container}>
            {isModalOpen ? <LoginModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /> : null}
            {isCommentsModalOpen &&
                <CommentsModal setIsOpen={setIsCommentsModalOpen} isOpen={isCommentsModalOpen} postID={id} setLoginOpen = {setIsModalOpen} setCommentsAmount={setCommentsLength}/>}
            <View>
                <Video
                    ref ={videoRef}
                    source = {{uri: video}}
                    resizeMode={ResizeMode.COVER}
                    isLooping={true}
                    shouldPlay={shouldPlay}
                    style={styles.video}
                />
            </View>
            <View style={[styles.overlay, styles.textContainer]}>
                <Image source={{uri: user.image}} />
                <View>
                    <Pressable onPress={() => router.push(`/profile/${user.id}`)} >
                        <Text style ={[styles.text, styles.username]}>{user.username}</Text>
                    </Pressable>
                    <Text style ={styles.text}>{title}</Text>
                    <Text style ={styles.text}>{description}</Text>
                </View>
            </View>
            <View>
                <View style={[styles.overlay, styles.buttons]}>
                    <Pressable style= {styles.pressables} title={'ButtonLike'} onPress={handleAlterLike}>
                        <AntDesign name="heart" size={20} color= {liked ? "#FE2C55" :"black" } />
                    </Pressable>
                    <Text style={styles.textAmmount} >{likesAmount}</Text>
                    <Pressable style= {styles.pressables} title={'ButtonComment'} onPress={goToComments}>
                        <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
                    </Pressable>
                    <Text style={styles.textAmmount}>{commentsLength}</Text>
                    <Pressable style= {styles.pressables} title={'ButtonShare'}>
                        <Fontisto name="share" size={20} color="black" />
                    </Pressable>
                </View>
            </View>
            {networkError && <NetworkErrorToast/>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height - 60,
        width: width,
    },
    video: {
        width: "100%",
        height: "100%",
        position: "relative",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    overlay: {
        position: "absolute",
        flex: 1,
        padding: 16,
    },
    text: {
        fontSize: 18,
        fontWeight: "700",
        lineHeight: 22,
        textAlign: "left",
        color: "#FFFFFF"
    },
    textContainer: {
        left: 0,
        bottom: 0,
        width: width - 35,
    },
    buttons: {
        bottom: 80,
        right: 0,
        gap: 8,
        alignItems: "center",
    },
    pressables: {
        backgroundColor: '#E7E7E8',
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: "center",
        justifyContent: "center",
    },
    textAmmount: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    username: {
        marginBottom: 20,
    }
});

export default Post;