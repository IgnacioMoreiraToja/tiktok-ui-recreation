import './index.css';
import {useState, useEffect} from'react';
import { useSearchParams } from 'react-router-dom';
import PostProfile from '../PostProfile';
import Friend from '../Friend';
import Loader from '../Loader';
import {getLoggedUser, getSearch} from '../Servicio/Api'

const Search = ({setPage}) => {
    const [myId, setMyId] = useState(null)

    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [friends, setFriends] = useState([]);

    const [loading, setLoading] = useState(true);
    const [invalidArgument, setInvalidArgument] = useState(false);
    const auth = localStorage.getItem('Authorization');
    const headersConfig = {
        headers: {
            Authorization: auth
        }
    };

    useEffect(() => {
        setLoading(true);
        setPage('/search');

        getSearch(query)
            .then((request) => {
                if (request.data === "Search term was empty." || request.data === "No users or posts found with that filter.") {
                    setInvalidArgument("Search term is invalid");
                } else {
                    setInvalidArgument(false);
                    setUsers(request.data.users);
                    setPosts(request.data.posts);
                }
            })
            .catch(() => {
                setInvalidArgument("Network error. Please try again later");
            })
            .finally(() => {
                auth ? getLoggedUser(headersConfig)
                    .then((response) => {
                        setFriends(response.data.following)
                        setMyId(response.data.id);
                    })
                    .catch(() => {
                        setFriends([])
                        setMyId(null)
                    })
                    .finally(() => {
                         setLoading(false);
                    })
                    : setLoading(false)
            });
    }, [searchParams, query]);

    return(
        loading ? <Loader/> :
        <div className='SearchContainer'>
            {invalidArgument ? <div className='errorFriends'>
                                    <div className='Info'>{invalidArgument}</div>
                                  </div> :
            <div className='ValidArgument'>
                <div className='SearchText'>
                    <div className='SearchWord'>Search:</div>
                    <div className='QueryWord'>{query}</div>
                </div>
                <div className='Title'>Users</div>
                <div className='SearchUsersContainer'>
                    {users.length == 0 ? <div className='Error'><div className='Info'>There are no users with that query!</div></div> :
                    users.map((user) => <Friend key={user.id} data = {user} listFollowing={friends} userId={myId}/>)}
                </div>
                <div className='Title'>Posts</div>
                <div className='SearchPostsContainer'>
                    {posts.length == 0 ? <div className='Error'><div className='Info'>There are no posts with that query!</div></div> :
                    posts.map((post) => <PostProfile key={post.id} data = {post}/>)}
                </div>
            </div>
            }
        </div>
    )
}

export default Search;