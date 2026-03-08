import React, {useState} from 'react';
import { Dimensions, Pressable, Text, TextInput, View } from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import LoginModal from '../../components/login.jsx';
import NetworkErrorToast from '../../components/NetworkErrorToast.jsx';
import { useLoggedUser } from "../../context/LoggedUser";
import { addPost } from '../../service/api.js';

const { height, width } = Dimensions.get('window');

const AddPost = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState("");
    const [error, setError] = useState('');
    const navigation = useNavigation();
    const {token} = useLoggedUser();
    const [ loginOpen, setLoginOpen] = useState(false);
    const [networkError, setNetworkError] = useState(false);

    const createPost = async () => {

        const postData = {
            "title": title,
            "description": description,
            "video": video,
        };

        const postString = JSON.stringify(postData);

        title && description && video ?
        addPost(postString, token)
            .then(() => {
                navigation.navigate("profile");
                setTitle('')
                setDescription('')
                setVideo('')
            })
            .catch((e) => {
                if (e.response && e.response.status === 401) {
                    setLoginOpen(true);
                } else {
                    setNetworkError(true)
                    setTimeout(() => setNetworkError(false), 3000);
                }
            })
        : setError("Please, fill all fields.");
    }

    useFocusEffect(
        React.useCallback(() => {
            setError(null);
            setNetworkError(false);
        }, [])
    );

    return(

        <View style={styles.bigbig}>
            {loginOpen ? <LoginModal isModalOpen={loginOpen} setIsModalOpen={setLoginOpen} /> : null}
            <Text style={styles.title}>Add a new post</Text>
        <View style={error ? styles.containerBig : styles.container}>
            <Text style={styles.modalThings}>Title</Text>
            <TextInput style={[styles.modalThings, styles.input]}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <Text style={styles.modalThings}>Description</Text>
            <TextInput style={[styles.modalThings, styles.input]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <Text style={styles.modalThings}>Video</Text>
            <TextInput style={[styles.modalThings, styles.input]}
                placeholder="Video"
                value={video}
                onChangeText={setVideo}
                autoCapitalize="none"
            />

            <Pressable title={"Create Post"}
                       onPress={() => { createPost() } }
                       style = {styles.button}>
                <Text style={styles.textButton}> Create post </Text>
            </Pressable>
                {error &&
                        <View style={styles.error}>
                            <Text style={{color: '#FE2C55',
                                fontSize: 16}}>{error}</Text>
                        </View>
                }
                {networkError && <NetworkErrorToast/>}
            </View>
        </View>
    )
}

const styles = {
    bigbig: {
        width: width,
        height: height,
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        top: -150,
    },
    container: {
        flexDirection: 'column',
        alignSelf: 'center',
        width: 348,
        height: 397,
        padding: 24,
        backgroundColor: '#FFFFFF',
        top: -125,
        borderRadius: 8,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    containerBig: {
        flexDirection: 'column',
        alignSelf: 'center',
        width: 348,
        height: 430,
        padding: 24,
        backgroundColor: '#FFFFFF',
        top: -125,
        borderRadius: 8,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    modalThings: {
        padding: 10,
        width: '95%',
    },
    input: {
        width: 300,
        height: 46,
        borderRadius: 23,
        borderWidth: 1,
        borderColor: '#F1F1F2',
        paddingLeft: 16,
        backgroundColor: '#F1F1F2',
    },
    button: {
        height: 46,
        width: 300,
        borderRadius: 4,
        paddingHorizontal: 8,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#FE2C55',
        top: 20,
    },
    textButton: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    error: {
        color: '#FE2C55',
        fontSize: 16,
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#FE2C55',
        width: 300,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        top: 40
    },
    loginText: {
        color: '#FE2C55',
        fontSize: 16,
    },
    pressableText: {
        color: '#FE2C55',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationStyle: 'double'
    }, 
}

export default AddPost;