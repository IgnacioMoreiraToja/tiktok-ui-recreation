import React from "react";
import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

const {width} = Dimensions.get('window');

const TagButton = ({tag}) => {
    const router = useRouter()
    const tagWithoutHash = tag.slice(1)
    return (
        <Pressable onPress={() => {router.push(`/trends/${tagWithoutHash}`)}} style={styles.tag}>
            <Text style={styles.tagText}>
                {tag}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    tag: {
        paddingVertical: 8,
        paddingHorizontal: 0,
        margin: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        width: width - 50,
        alignSelf: "center",
        height: 46,
        borderWidth: 1,
        borderColor: '#AAAAAE',
        marginVertical: 15,
    }, tagText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: '700'
    }
})

export default TagButton;