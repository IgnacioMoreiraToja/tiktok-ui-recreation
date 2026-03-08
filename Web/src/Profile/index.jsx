import './index.css'
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import PostProfile from '../PostProfile';
import UserProfile from "../UserProfile";
import Loader from '../Loader';
import {getUser, getLoggedUser} from '../Servicio/Api'


const Profile = ({setPage}) => {
    let {userID} = useParams();
    const [loggedInUser, setLoggedInUser] = useState(null);

    const [posts, setPosts] = useState([]);
    const [user, setUser]       = useState(null);
    const [emptyPosts, setEmptyPosts] = useState(false);

    const [networkError, setNetworkError] = useState(false)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const auth = localStorage.getItem('Authorization');
    const headersConfig = {
        headers: {
            Authorization: auth
        }
    };

    useEffect(() => {
        setLoading(true); 

        setPage('/user/'+userID)
        getUser(userID)
        .then((userResponse) => {
            const userData = userResponse.data;
            setUser(userData);
            if (userData.posts.length === 0) {
                setEmptyPosts(true);
            } else {
                setEmptyPosts(false);
                setPosts(userData.posts);
            }
            if (!auth) {
                return;
            }
            return getLoggedUser(headersConfig); // Chain the next promise here
        })
        .then((loggedUserResponse) => {
            setLoggedInUser(loggedUserResponse.data);
        })
        .catch((e) => {
            e.message === "Network Error" && setNetworkError(true)
        })
        .finally(() => {
            setLoading(false);
        });
}, [userID]);
    
    const goCreate = () => {
        navigate('/addPost');
    }
    return (
        loading? <Loader/> :
            networkError ? <div className="errorFriends">Network error. Please, try again later.</div> :
            !user ? <div className="errorFriends">User not found</div> :
            <div className='ProfileContainer'>
                <UserProfile setPage = {setPage} data={user} loggedInUser = {loggedInUser} />
            <div className="postsProfileSection">
                {emptyPosts ? 
                <div className="errorFriends">Currently there are no posts.&nbsp; <a onClick={goCreate}> Try creating one!</a></div> : 
                posts.map((post) => <PostProfile key={post.id} data={post} />)
                }
            </div>

        </div>
    );
}

export default Profile;