import './index.css';
import {useState, useEffect} from 'react';
import PostExplore from '../PostExplore';
import Loader from '../Loader';
import { getLoggedUser, getTopTrends, getPostsByTrend } from '../Servicio/Api';

const Explore = ({setPage}) => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    const [tags, setTags] = useState([]);
    const [posts, setPosts] = useState([]);
    const [chosenTag, setChosenTag] = useState(undefined)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")
    const auth = localStorage.getItem('Authorization');
    const headersConfig = {
        headers: {
            Authorization: auth
        }
    };

    useEffect(() => {
        setPage('/explore');
        getTopTrends()
            .then((response) => {
                const data = response.data
                setTags(data);
                setChosenTag(data[0]);
                getPostsInTrend(data[0]);
                auth && getLoggedUser(headersConfig)
                    .then((response) => {
                        setLoggedInUser( response.data);
                    })
                    .catch(() => {
                        setLoggedInUser(null)
                    })
            })
            .catch((error) => {
                if (error.message.includes("Network Error") || error.message.includes("CONNECTION REFUSED")) {
                    setError("Network error, please try again later.")
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const getPostsInTrend = (tag) => {
        const tagSearch = tag.slice(1)
        getPostsByTrend(tagSearch)
            .then((response) => {
                const data = response.data
                setChosenTag(tag)
                setPosts(data);
            })
    }

    const TagButton = ({tag}) => {
        return (
        <button className={'TagButton ' + (chosenTag === tag? "Chosen" : "Unchosen")} onClick={() => getPostsInTrend(tag)}>{tag}</button>
        )
    }
   
    return(
        loading? <Loader/> :
            error ? <div className='errorFriends'>{error}</div> :
        <div className='ExploreContainer'>
            <div className='TagButtonContainer'>
                {tags.map((tag) => <TagButton key={tag} tag = {tag}/>)}
            </div>
            
            <div className='ExplorePostsContainer'>
                {posts.map((post) => <PostExplore key={post.id} data={post} loggedInUser= {loggedInUser}/>)}
            </div>
        </div>
    )
}


export default Explore;