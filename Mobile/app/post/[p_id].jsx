import React, { useEffect, useState } from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import PostItem from "../../components/PostItem";
import Spinner from '../../components/Spinner';
import {AntDesign} from "@expo/vector-icons";
import { getPost } from "../../service/api";


const Post = () => {
    const [post, setPost] = useState(null);
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true)
    const { p_id } = useLocalSearchParams()
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        getPost(p_id)
            .then((response) => {
                setPost(response.data);
                navigation.setOptions({
                    title: response.data.title
                })
            })
            .catch((e) => {
                if (e.response && e.response.status === 404) {
                    setError("The post you are trying to access couldn't be found.")
                } else {
                    router.push('/networkError')
                }
            })
            .finally(() => {
                setLoading(false)
            });
    }, [p_id]);

    return (
        <SafeAreaView style={styles.container}>
            {error ? (
                <>
                    <Text style={styles.text}>{error}</Text>
                    <Pressable title="Try Again" style={styles.pressable} onPress={() => router.push(`/post/${p_id}`)}>
                        <AntDesign name="reload1" size={24} color="#FE2C55" />
                    </Pressable>
                </>
            ) : loading ? (
                    <Spinner />
            ) : (
                <View style={{ flex: 1 }}>
                    <PostItem data={post} shouldPlay={true} />
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FE2C55',
        marginBottom: 20,
    }, pressable: {
        backgroundColor: '#E7E7E8',
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: "center",
        justifyContent: "center",
    }
})

export default Post;