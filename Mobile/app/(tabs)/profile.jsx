import React, { useState } from 'react';
import { SafeAreaView } from "react-native";
import {useRouter} from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import LoginModal from "../../components/login";
import ProfilePage from "../../components/ProfilePage";
import Spinner from '../../components/Spinner';
import { useLoggedUser } from "../../context/LoggedUser";
import { getLoggedUser } from "../../service/api";

const ProfileLogged = () => {
    const { token, loggedUserID }        = useLoggedUser();
    const [loggedUser, setLoggedUser]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    // When rendering we got the logged user, if there is no user the app navigates to Login!
    useFocusEffect(
        React.useCallback(() => {
            token ?
                getLoggedUser(token)
                .then((response) => {
                    setLoggedUser(response.data);
                })
                .catch((e) => {
                    if (e.response.status === 401) {
                        setIsModalOpen(true)
                    } else {
                        router.push('/networkError')
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
                :
                setLoading(false)
                setIsModalOpen(true)
        }, [token]))

    return (
        <SafeAreaView>
            {loading ? (
                <Spinner />
            ) : 
                (!loggedUserID ? (
                    <LoginModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                ) : (
                    <ProfilePage user={loggedUser} setLoggedUser={setLoggedUser}/>
                )
            )}
        </SafeAreaView>
    );
    
}

export default ProfileLogged;