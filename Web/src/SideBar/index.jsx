import './index.css';
import {useEffect, useState} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {getLoggedUser} from "../Servicio/Api.js";

const SideBar = ({setPage}) => {
    let location = useLocation();

    const [myId, setMyId] = useState(null);
    const navigate = useNavigate();
    const auth = localStorage.getItem('Authorization');
    const headersConfig = {
        headers: {
            Authorization: auth
        }
    };

    useEffect(() => {
        auth &&
        getLoggedUser(headersConfig)
            .then((response) => {
                    const loggedInUser = response.data;
                    setMyId(loggedInUser.id)
                })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                    setMyId(null)
                }
            });
    }, [auth]);

    const goHome = () =>  { 
        navigate('/');
        setPage('/')
    } 

    const goFollowing = () => {
        navigate('/following')
        setPage('/following');
    }

    const goFriends = () => {
        setPage('/friends');
        navigate('/friends');
    }

    const goExplore = () => {
        navigate('/explore');
        setPage('/explore');
        
    }

    const goProfile = () => {
        if (auth) {
            navigate('/user/' + myId)
        } else {
            goLogin()
        }
    }
    const goLogin = () => {
        navigate('/login');
    }

    return (
        <div className="sidebar">
            <ul className="sidebar-menu">
                <li className={(location.pathname === "/") ? "clicked" : "nonClicked"} onClick={goHome} >
                    <div className="imageSidebar">
                        <img src="../public/NavBar/home.png" alt="home"/>
                    </div> For You
                </li>
                <li className={(location.pathname === "/following") ? "clicked" : "nonClicked"} onClick={goFollowing}>
                    <div className="imageSidebar">
                        <img src="../public/NavBar/following.png" alt="following"/>
                    </div> Following
                </li>
                <li className={(location.pathname === "/friends") ? "clicked" : "nonClicked"} onClick={goFriends}>
                    <div className="imageSidebar">
                        <img src="../public/Navbar/friends.png" alt="friends"/>
                    </div> Friends
                </li>
                <li className={(location.pathname === "/explore") ? "clicked" : "nonClicked"} onClick={goExplore}>
                    <div className="imageSidebar">
                        <img src="../public/Navbar/explore.png" alt="explore"/>
                    </div>Explore
                </li>
                <li className={(location.pathname === "/user/"+myId) ? "clicked" : "nonClicked"} onClick={goProfile}>
                    <div className="imageSidebar">
                        <img src="../public/Navbar/profile.png" alt="profile"/>
                    </div>Profile
                </li>
            </ul>
            <hr/>
            {auth && myId ? null :
                <>
                    <div className="sidebar-message">
                        <p>Log in to follow creators, like videos, and view comments</p>
                    </div>
                    <div className='sidebar-menu-button'>
                        <button className='sidebar-button' alt='Button Log in Side Bar' onClick={goLogin}>Log In</button>
                    </div>
                </>
            }
        </div>
    );
}

export default SideBar