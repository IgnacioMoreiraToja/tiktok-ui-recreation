import './index.css'
import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import Post from "../Post";
import Loader from "../Loader/index.jsx";
import {getTimeline, getLoggedUser} from '../Servicio/Api'


const Following = ({setPage}) => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    const [posts, setPostsFollows] = useState([]);
    const [emptyFollows, setEmptyFollows] = useState(false)

    const [needRender, setNeedRender] = useState(false);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate();
    const auth = localStorage.getItem('Authorization');
    const headersConfig = {
        headers: {
            Authorization: auth
        }
    };
    useEffect(() => {
        setPage('/following')
        !auth ? navigate('/login') :
        Promise.all([
            getLoggedUser(headersConfig),
            getTimeline(headersConfig)
        ]).then(([loggedUserResponse, timelineResponse]) => {
            const loggedUser = loggedUserResponse.data;
            setLoggedInUser(loggedUser);
    
            if (timelineResponse.data === "No posts in the timeline.") {
                setEmptyFollows(true);
            } else {
                setEmptyFollows(false);
                setPostsFollows(timelineResponse.data);
            }
        }).catch( () => {
            setError("Network error, please try again later.")
        }).finally(() => {
            setLoading(false)
        });
    }, [auth, needRender]);

    return (
        <div className="postsHome">
            {loading ? <Loader/> :
             error ? <div className='errorFriends'>{error}</div> :
             emptyFollows ?
             (<div className='errorFriends'>There are no post to see!</div>) 
             : 
             posts.map((post) => <Post key={post.id} data={post} loggedInUser={loggedInUser} setNeedRender={setNeedRender}/>)
            }
        </div>
    );
}

export default Following;