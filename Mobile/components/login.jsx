import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLoggedUser } from "../context/LoggedUser";
import {getLoggedUser, postLogin, postRegister} from "../service/api";
import NetworkErrorToast from "../components/NetworkErrorToast.jsx"

const LoginModal = ({ isModalOpen, setIsModalOpen }) => {
    const { logIn, token } = useLoggedUser();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');
    const [email, setEmail] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [registerMode, setRegisterMode] = useState(false);
    const [error, setError] = useState('');
    const [networkError, setNetworkError] = useState(false);

    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    const regexImg = /^(http|https|ftp):\/\/.*/;

    // useEffect to check if token is valid. If user has a token and it is valid, modal closes. If token is invalid it notifies a session expired. If user doesn't have token, nothing happens.
    useEffect(() => {
        token && getLoggedUser(token)
            .then(() => setIsModalOpen(false))
            .catch((e) => {
                if (e.response && e.response.status === 401) {
                    setError("Session expired, please log in again.");
                } else {
                    setNetworkError(true)
                }
            });
    }, [isModalOpen]);

    const tryLogIn = () => {
        const userData = {
            username: username,
            password: password,
        };

        const userDataString = JSON.stringify(userData);

        username && password ?
            postLogin(userDataString)
            .then((request) => {
                logIn(request.data.id, request.headers.get('Authorization'))
                setIsModalOpen(false);
            })
            .catch((e) => {
                if (e.response && e.response.status === 400) {
                    setError("Invalid username or password")
                } else {
                    setNetworkError(true)
                    setTimeout(() => setNetworkError(false), 3000);
                }
            })
            :
            setError("Please fill all fields")
    }

    const tryRegister = () => {
        const userData = {
            username: username,
            email: email,
            password: password,
            image: image
        };

        const userDataString = JSON.stringify(userData);

        (username && password && email && image) ? (
            !regex.test(email) ? setError("Invalid email. Try writing one with @ and .com") :
                !regexImg.test(image) ? setError("Invalid image. Try writing one with http:// or https://") :
        postRegister(userDataString)
            .then((request) => {
                logIn(request.data.id, request.headers.get('Authorization'))
                setIsModalOpen(false);
            })
            .catch((e) => {
                if (e.response && e.response.status === 400) {
                    setError("Username or email already in use")
                } else {
                    setNetworkError(true)
                    setTimeout(() => setNetworkError(false), 3000);
                }
            })
        ) : setError("Please fill all fields")
    }

    useEffect(() => {
        setError('');
        setRegisterMode(false);
        setNetworkError(false);
    }, [isModalOpen]);

    return (
        <Modal visible={isModalOpen} transparent={true} animationType={'slide'}>
            <TouchableWithoutFeedback onPress={() => setIsModalOpen(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalStyle}>
                        <Text style={styles.modalThings}> Username </Text>
                        <TextInput
                            placeholder={"username"}
                            placeholderTextColor={"#B0B0B4"}
                            style={[styles.modalThings, styles.input]}
                            autoCapitalize="none"
                            onChangeText={(text) => setUsername(text)}
                        />
                        <Text style={styles.modalThings}> Password </Text>
                        <View style={[styles.passwordContainer, styles.input, styles.modalThings]}>
                            <TextInput
                                placeholder={"password"}
                                placeholderTextColor={"#B0B0B4"}
                                autoCapitalize="none"
                                style={styles.inputPassword}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={hidePassword}
                            />
                            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.eyeButton}>
                                <Icon name={hidePassword ? "visibility-off" : "visibility"} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>
                        {registerMode ?
                            <View>
                                <Text style={styles.modalThings}> Email </Text>
                                <TextInput
                                    placeholder={"email"}
                                    placeholderTextColor={"#B0B0B4"}
                                    style={[styles.modalThings, styles.input]}
                                    onChangeText={(text) => setEmail(text)}
                                    autoCapitalize="none"
                                />
                                <Text style={styles.modalThings}> Image </Text>
                                <TextInput
                                    placeholder={"image"}
                                    placeholderTextColor={"#B0B0B4"}
                                    style={[styles.modalThings, styles.input]}
                                    onChangeText={(text) => setImage(text)}
                                    autoCapitalize="none"
                                />
                            </View> : null
                        }
                        <Pressable
                            onPress={() => { registerMode ? tryRegister() : tryLogIn() }}
                            style={[styles.buttons, styles.buttonLogin]}>
                            <Text style={styles.textLogin}> {registerMode ? 'Register' : 'Login'}</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => { setRegisterMode((x) => !x); setError('') }}
                            style={[styles.buttons, styles.buttonRegister]}>
                            <Text style={styles.textRegister}>{registerMode ? 'Login' : 'Register'}</Text>
                        </Pressable>
                        {error ? (
                            <View style={styles.error}>
                                <Text style={{ color: '#FE2C55', fontSize: 16, textAlign: 'center' }}> {error} </Text>
                            </View>
                        ) : null}
                        {networkError && <NetworkErrorToast/>}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalStyle: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        borderRadius: 8,
        padding: 20,
    },
    modalThings: {
        marginBottom: 10,
    },
    buttons: {
        height: 46,
        width: '100%',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    buttonLogin: {
        backgroundColor: '#FE2C55',
    },
    textLogin: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonRegister: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FE2C55',
        borderWidth: 1,
    },
    textRegister: {
        color: '#FE2C55',
        fontSize: 16,
    },
    error: {
        borderWidth: 2,
        borderColor: '#FE2C55',
        borderRadius: 4,
        padding: 10,
        marginTop: 10,
        width: '100%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    eyeButton: {
        position: 'absolute',
        right: 10,
    },
    input: {
        width: '100%',
        height: 46,
        borderRadius: 23,
        borderWidth: 1,
        borderColor: '#F1F1F2',
        paddingLeft: 16,
        backgroundColor: '#F1F1F2',
    },
    inputPassword: {
        width: '100%',
        height: 46,
        borderRadius: 23,
    }
});

export default LoginModal;