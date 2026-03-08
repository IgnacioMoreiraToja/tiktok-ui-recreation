import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {useRouter} from "expo-router";
import {useFocusEffect} from "@react-navigation/native";
import Spinner from '../../components/Spinner';
import TagButton from "../../components/tagButton";
import {getTopTrends} from "../../service/api";


const Explore = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            getTopTrends()
                .then((response) => {
                    const data = response.data
                    setTags(data);
                })
                .catch(() => {
                    router.push(`/networkError`)
                })
                .finally(() => {
                    setLoading(false);
                });
        }, []))

    return (
        <SafeAreaView>
        {loading ? <Spinner/> :
                <View style={styles.container}>
                    <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Explore</Text>
                    <View>
                        {tags.map((tag) => <TagButton key={tag} tag={tag}/>)}
                    </View>
                </View>

        }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
    }
})

export default Explore;