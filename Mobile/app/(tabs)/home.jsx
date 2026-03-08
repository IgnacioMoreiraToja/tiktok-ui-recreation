import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import {useRouter} from "expo-router";
import PostItem from "../../components/PostItem";
import Spinner from '../../components/Spinner';
import {getLatestPost} from '../../service/api';

const { height, } = Dimensions.get('window');

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewableIndex, setViewableIndex] = useState(0);
    const isFocused = useIsFocused();
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            getLatestPost()
                .then(({ data }) => {
                    setPosts(data);
                })
                .catch(() => {
                    router.push(`/networkError`)
                })
                .finally(() => setLoading(false));
        }, []))

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setViewableIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <SafeAreaView style={styles.container}>
            {loading? (            
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
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 48,
    },
    spinnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    listContainer: {
        flexGrow: 1,
    },
    list: {
        flex: 1,
    },
});

export default Home;