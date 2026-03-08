import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

import { LOGGED_USER_ID, TOKEN } from '../utils/constants';



const LoggedUserContext = createContext()

const LoggedUserProvider = ( {children} ) => {
    const [loggedUserID, setLoggedUserID] = useState(null)
    const [token, setToken] = useState(null)

    useEffect(() => {
        Promise.all([
            AsyncStorage.getItem(LOGGED_USER_ID),
            AsyncStorage.getItem(TOKEN)
        ])
        .then(([id, token]) => {
            if (id) setLoggedUserID(id);
            if (token) setToken(token);
        })
        .catch(error => {
            console.error('No logged in user.', error);
        });
    }, []);

    const logIn = (id, token) => {
        setLoggedUserID(id);
        setToken(token);
        return Promise.all([
            AsyncStorage.setItem(LOGGED_USER_ID, id),
            AsyncStorage.setItem(TOKEN, token)
        ]);
    };

    const logOut = () => {
        setLoggedUserID(null);
        setToken(null);
        return Promise.all([
            AsyncStorage.removeItem(LOGGED_USER_ID),
            AsyncStorage.removeItem(TOKEN)
        ]);
    }

    return (
        <LoggedUserContext.Provider value={{ loggedUserID, token, logIn, logOut }}>
            {children}
        </LoggedUserContext.Provider>
    );

};

export const useLoggedUser = () => useContext(LoggedUserContext)

export default LoggedUserProvider;

