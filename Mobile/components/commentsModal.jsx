
import React, { useEffect, useState } from 'react';
import {Dimensions, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Comment from "./Comment";
import Spinner from "./Spinner";
import NetworkErrorToast from "../components/NetworkErrorToast.jsx"
import { useLoggedUser } from "../context/LoggedUser";
import {addComment, getPost} from "../service/api";


const { height, width } = Dimensions.get('window');

const CommentsModal = ({isOpen, setIsOpen, postID, setLoginOpen, setCommentsAmount}) => {
    const {token} = useLoggedUser();
    const [comment, setComment] = useState('');
    const [newComments, setNewComments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [networkError, setNetworkError] = useState(false);


    const handleAddComment = () => {
        if (!token) {
            setLoginOpen(true)
            return;
        }
        comment ? addComment(postID, {text: comment}, token)
            .then((response) => {
                setError(false);
                setComment("")
                const comments = response.data.comments;
                setNewComments(x => [comments[comments.length - 1],...x])
                setCommentsAmount(response.data.comments.length)
            })
            .catch((e) => {
                setError('')
                if (e.response && e.response.status === 401) {
                    setLoginOpen(true);
                } else if (e.response && e.response.status === 400) {
                    setError("Comment can't be empty!")
                } else {
                    setNetworkError(true);
                }
            })
            :
            setError("Comment can't be empty!")
    }

    useEffect(() => {
        getPost(postID)
            .then((response) => {
                setNewComments(response.data.comments)
            })
            .catch(() => {
                setNetworkError(true)
                setTimeout(() => setNetworkError(false), 3000);
            })
            .finally(() => {
                setLoading(false)
            });
    }, []);

    return (
        <Modal visible={isOpen} transparent={true} animationType={'slide'}>
            <TouchableWithoutFeedback onPress={() =>{setIsOpen(false)}}>
                <View style ={styles.modalContainer}>
                    <View style={styles.modalStyle}>
                        <View style={styles.modalThings}>
                            <Text>{newComments.length} Comments</Text>
                            
                        </View>
                        {loading ? <Spinner/> : 
                        <FlatList
                            data={newComments}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) => (<Comment data={item} key={item.id} />)}
                            ListEmptyComponent={!networkError ?
                                <View style={styles.modalThings}>
                                    <Text style={styles.loginText}>Currently there are no comments! Try creating one!</Text>
                                </View> : null}
                            scrollEnabled={true}
                        />}
                        {error &&
                            <View style={styles.error}>
                                    <Text style={styles.loginText} >{error}</Text>
                            </View>
                        }

                        <View style={styles.input}>
                            <TextInput
                                placeholder={"Add a comment"}
                                placeholderTextColor={"#B0B0B4"}
                                style = {[styles.modalThings, styles.inputText]}
                                onChangeText={(text) =>  setComment(text)}
                                value={comment}
                                onSubmitEditing={handleAddComment}
                            />
                            <Pressable style= {styles.pressables} title={'ButtonComment'} onPress={handleAddComment}>
                                {!comment ?
                                <Ionicons name="chatbubble-ellipses-outline" size={18} color="black" /> :
                                <Ionicons name="send" size={18} color="black" /> }
                            </Pressable>
                            {networkError && <NetworkErrorToast/>}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    }, 
    modalStyle: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        borderRadius: 8,
        width: '100%',
        maxHeight: height * 0.8, // Máximo 80% de la pantalla
    },
    modalThings: {
        padding: 10,
        alignItems: 'center',
    },  error: {
        borderWidth: 2,
        borderColor: '#FE2C55',
        width: '100%',
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',

    }, 
    input: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'gray',
        padding: 8,
    }, 
    pressables: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: "center",
        justifyContent: "center",
    }, 
    pressableText: {
        color: '#FE2C55',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationStyle: 'double'
    }, 
    loginText: {
        color: '#FE2C55',
        fontSize: 16,
    }, 
    inputText: {
        width: width - 46,
        height: 46,
        borderRadius: 23,
        borderWidth: 1,
        borderColor: 'gray',
        paddingLeft: 16,
    }
})

export default CommentsModal