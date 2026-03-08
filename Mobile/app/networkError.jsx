import {Pressable, View, StyleSheet, Text} from "react-native";
import {useRouter} from "expo-router";
import { AntDesign } from '@expo/vector-icons';

const networkError = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Network error. Try again.</Text>
            <Pressable title="Try Again" style={styles.pressable} onPress={() => router.push('/home')}>
                <AntDesign name="reload1" size={24} color="#FE2C55" />
            </Pressable>
        </View>
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

export default networkError;