import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRouter } from "expo-router";

const Comment = ({data: {user, text}}) => {

    const router = useRouter();
    
    return (
        <View style={styles.container}>
            <Pressable onPress={() => router.push(`/profile/${user.id}`)} >
            <Image style={styles.image} source={{uri: user.image}} />
            </Pressable>
            <View style={styles.textContainer}>
                <Text>{user.username}</Text>
                <Text>{text}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'gray',
        minHeight: 80,
        width: '90%',
    }, textContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 8,
        textAlign: 'left',
    }, image: {
        width: 56,
        height: 56,
        borderRadius: 28,
    }, username: {
        fontSize: 18,
        fontWeight: 'bold',
    }, text: {
        fontSize: 18,
    }
})

export default Comment