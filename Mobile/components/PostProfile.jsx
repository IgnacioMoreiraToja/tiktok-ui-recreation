import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ResizeMode, Video } from "expo-av";


const PostProfile = ({ data: {id,  video } }) => {
    const videoRef = React.useRef(null)
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Pressable onPress={() => router.push(`/post/${id}`)} >
                <Video
                    ref ={videoRef}
                    source = {{uri: video}}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={false}
                    style={styles.video}
                />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 208,
        width: '33.3%',
    }, video: {
        height: "100%",
        width: "100%",
    }
})

export default PostProfile;