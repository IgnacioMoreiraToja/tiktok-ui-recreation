import React, { useState } from "react";
import {Pressable, SafeAreaView, StyleSheet, Text} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import ProfilePage from "../../components/ProfilePage";
import {AntDesign} from "@expo/vector-icons";
import { getUser } from "../../service/api";

const Profile = () => {
    const [userData, setUserData] = useState(null)
    const navigation = useNavigation()
    const [error, setError] = useState('')
    const { id } = useLocalSearchParams()
    const router = useRouter()

    useFocusEffect(
        React.useCallback(() => {
            getUser(id)
                .then((response) => {
                    setUserData(response.data);
                    navigation.setOptions({
                        title: response.data.username
                    })
                })
                .catch((e) => {
                    if (e.response && e.response.status === 404) {
                        setError("The user you are trying to access couldn't be found.")
                    } else {
                        router.push('/networkError')
                    }
                })
        }, [id]))

    return (
        <SafeAreaView style={styles.container}>
            { error ? (
                <>
                    <Text style={styles.text}>{error}</Text>
                    <Pressable title="Try Again" style={styles.pressable} onPress={() => router.push(`/profile/${id}`)}>
                        <AntDesign name="reload1" size={24} color="#FE2C55" />
                    </Pressable>
                </>
            ) :
                <ProfilePage user={userData} />
            }
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
export default Profile;