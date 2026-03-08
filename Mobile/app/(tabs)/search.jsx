import React, { useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import {useRouter} from "expo-router";
import PostProfile from '../../components/PostProfile';
import Spinner from '../../components/Spinner';
import { MaterialIcons } from '@expo/vector-icons';
import { getSearch } from '../../service/api';

const Search = () => {
    const [searchedPosts, setSearchedPosts] = useState([]);
    const [query, setQuery] = useState('');
    const [invalidArgument, setInvalidArgument] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const search = () => {
        setLoading(true)
        getSearch(query)
            .then(({ data }) => {
                if (data === "Search term was empty." || data === "No users or posts found with that filter." || data.posts.length === 0) {
                    setInvalidArgument(true);
                    setSearchedPosts([]);
                } else {
                    setInvalidArgument(false);
                    setSearchedPosts(data.posts);
                }
            })
            .catch(() => {
                router.push('/networkError')

            })
            .finally(() => setLoading(false));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.searchBarContainer}>
                    <TextInput
                        placeholder="Search"
                        onChangeText={setQuery}
                        value={query}
                        style={styles.searchBarInput}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        onSubmitEditing={search}
                    />
                    <Pressable onPress={search} style={styles.button}>
                        <MaterialIcons name="search" size={28} color="gray" />
                    </Pressable>
                </View>
                <View style={styles.line} />

                {loading ? (
                    <Spinner/>
                ) : (
                    <View>
                        {invalidArgument ? (
                            <Text style={styles.text}>No results found</Text>
                        ) : (
                            <FlatList
                                data={searchedPosts}
                                renderItem={({ item }) => <PostProfile key={item.id} data={item} />}
                                numColumns={3}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        )}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        marginTop: 50,
    },
    searchBarContainer: {
        width: '91%',
        height: 46,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: '#F1F1F2',
        borderRadius: 40,
        paddingHorizontal: 10,
    },
    searchBarInput: {
        flex: 1,
        backgroundColor: '#F1F1F2',
        height: '100%',
        fontSize: 16,
        borderRadius: 40,
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
    button: {
        alignSelf: 'center',
    },
    line: {
        height: 1,
        width: '75%',
        alignSelf: 'center',
        backgroundColor: '#F1F1F2',
        marginTop: 20,
        marginBottom: 20,
    },
    text: {
        textAlign: 'center',
        marginTop: 20,
        color: '#AAAAAE',
        fontSize: 16,
    },
});

export default Search;