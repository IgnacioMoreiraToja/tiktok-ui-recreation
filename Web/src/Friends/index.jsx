import './index.css'
import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import Friend from "../Friend";
import Loader from '../Loader';
import {getLoggedUser} from '../Servicio/Api'

const Friends = () => {
    const [myId, setMyId] = useState(-1);

    const [friends, setFriends] = useState([]);
    const [emptyFriends, setEmptyFriends] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")
    const navigate = useNavigate();
    const auth = localStorage.getItem('Authorization');
    const headersConfig = {
        headers: {
            Authorization: auth
        }
    };
    
    useEffect(() => {

        !auth ? navigate('/login') :
        getLoggedUser(headersConfig)
            .then((response) => {
                const following = response.data.following
                setMyId(response.data.id);
                if (following.length === 0) {
                    setEmptyFriends(true); //If the list is empty, a div is shown.
                } else {
                    setEmptyFriends(false);
                    setFriends(following); //If the list is not empty,we map it to Friend components.
                }
            })
            .catch(() => {
                setError("Network error, please try again later.")
            })
            .finally(() => setLoading(false))
    }, []);

    const goHome = () => {
        navigate('/')
    }
    return (
        loading ? <Loader/> :
            error ? <div className='errorFriends'>{error}</div> :
        <div className="friendSection">
        {emptyFriends ? 
        <div className="errorFriends">You are not following people!&nbsp; <a onClick={goHome}>Try following people</a></div> : 
        friends.map((friend) => <Friend key={friend.id} data={friend} listFollowing={friends} userId={myId} />)
        }
        </div>
    );
}

export default Friends;