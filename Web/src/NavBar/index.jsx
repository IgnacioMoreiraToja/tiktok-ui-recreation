import './index.css';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {getLoggedUser} from "../Servicio/Api.js";

const NavBar = () => {
    const [myId, setMyId] = useState(null);

    const [query, setQuery] = useState('');
    const [image, setImage] = useState(null);

    const navigate = useNavigate();
    const auth = localStorage.getItem('Authorization');
    const configHeader = {
        headers: {
            Authorization: auth
        }
    }

    const goHome = () =>  { 
        navigate('/');
    }

    const goLogin = () => {
        navigate('/login');
    }

    const goRegister = () => {
        navigate('/register');
    }

    const goCreatePost = () => {
        navigate('/addPost');
    }

    const search = (event) => {
        event.preventDefault();
        navigate('/search?query='+query);
        setQuery("");
    }

    useEffect(() => {
        auth &&
        getLoggedUser(configHeader)
            .then((response) => {
                const loggedInUser = response.data;
                setImage(loggedInUser.image);
                setMyId(loggedInUser.id)
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    setMyId(null)
                }
            })
    }, [auth]);


    return(
        <div className="NavBarContainer">
            <img className='TikTokLogo' src='../NavBar/tiktok.png'
                 alt='TikTok Logo'
                 onClick={goHome}></img>
            <div className='SearchBarContainer'>
                <form className='SearchBar' onSubmit={search}>
                    <input className='SearchBarInput' type='text'
                    placeholder='Buscar' alt='Search Bar'
                    value={query} onChange={(e) => setQuery(e.target.value)}></input>
                    <button type='submit' className='SearchLogoButton'>
                    <img className='SearchLogo' src='../NavBar/Search.png' onClick={search} alt='Search'></img>
                    </button>
                </form>
            </div>
            <div className='ButtonsContainer'>
                {auth && myId ? (
                    <>
                        <button className="addButton" onClick={goCreatePost}>
                            <img className='uploadLogo' src='../NavBar/Add.png' alt='Upload Logo'/>
                            Upload
                        </button>
                        <Link to={"/user/"+myId}>
                        <img className='roundedImage userImageUserProfile' src={image} alt='UserImageUserProfile' />
                        </Link>
                    </>
                ) : (
                    <>
                        <button className='Buttons ButtonRegister'
                                onClick={goRegister}>
                            Register
                        </button>
                        <button className='Buttons ButtonLogIn'
                                onClick={goLogin}>
                            Log In
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default NavBar

