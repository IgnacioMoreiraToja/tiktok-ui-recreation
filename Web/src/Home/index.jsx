import {useState, useEffect} from 'react';
import Post from "../Post";
import { getLatestPost, getLoggedUser } from "../Servicio/Api";
import Loader from "../Loader/index.jsx";

const Home = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    const [posts, setPosts] = useState([])

    const [needRender, setNeedRender] = useState(false);
    const [loading, setLoading] = useState(true);
    const auth = localStorage.getItem('Authorization');
    const headersConfig = {
        headers: {
            Authorization: auth
        }
    };

    useEffect(() => {
        Promise.all([
            getLatestPost().then((request) => setPosts(request.data)).catch(() => {
                setPosts([])

            }),
            auth &&
            getLoggedUser(headersConfig).then((response) => setLoggedInUser(response.data)).catch(() => {})
        ])
            .finally(() => setLoading(false))
    }, [needRender])

    return (
        <div className="postsHome">
            {loading ? <Loader/> :
                !posts.length ? <div className='errorFriends'>Network error, please try again later.</div> :
                posts.map((post) => <Post key={post.id} data = {post} loggedInUser= {loggedInUser} setNeedRender={setNeedRender}/>)
            }
            </div>
    );
}

export default Home;