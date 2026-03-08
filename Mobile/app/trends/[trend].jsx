import { useIsFocused } from "@react-navigation/native";
import {useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {Dimensions, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View} from "react-native";
import PostItem from "../../components/PostItem";
import Spinner from "../../components/Spinner";
import {AntDesign} from "@expo/vector-icons";
import { getPostsByTrend } from "../../service/api";

const { height } = Dimensions.get('window');

const Trend = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewableIndex, setViewableIndex] = useState(0);

    const [error, setError] = useState('');
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { trend } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        getPostsByTrend(trend)
            .then(({ data }) => {
                setPosts(data.slice(0, 10));
                navigation.setOptions({
                    title: '#'+trend
                })
            })
            .catch((e) => {
                if (e.response && e.response.status === 404) {
                    setError("The trend you are trying to access doesn't exist.")
                } else {
                router.push('/networkError')
                }
            })
            .finally(() => setLoading(false));
    }, [trend]);

    const viewabilityConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

    const onViewableItemsChanged = useRef(({viewableItems}) => {
        if (viewableItems.length > 0) {
            setViewableIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <SafeAreaView style={styles.container}>
            {error ?  (
                <>
                    <Text style={styles.text}>{error}</Text>
                    <Pressable title="Try Again" style={styles.pressable} onPress={() => router.push(`/post/${p_id}`)}>
                        <AntDesign name="reload1" size={24} color="#FE2C55" />
                    </Pressable>
                </>
            ) : (
                 loading ? (
                <View style={styles.spinnerContainer}>
                    <Spinner />
                </View>            
                ) : ( 
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={posts}
                    renderItem={({item, index}) => <PostItem key={item.id} data={item} shouldPlay={isFocused && index === viewableIndex} />}
                    style={styles.list}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={false}
                    decelerationRate="fast"
                    snapToInterval={height - 60}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                /> 
                    )
                )
            }
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    listContainer: {
    },
    list: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    }, text: {
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
});

export default Trend