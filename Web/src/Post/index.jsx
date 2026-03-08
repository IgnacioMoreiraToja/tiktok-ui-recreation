import './index.css';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import Toast from "../Toast/index.jsx";
import {alterLike, alterFollow} from '../utils';


const Post = ({data: {id, user, title, description, video, comments, likes}, loggedInUser, setNeedRender}) => {
    const myId = (loggedInUser ? loggedInUser.id : null);

    const [like, setLike] = useState(loggedInUser && likes.some((like) => like.id === loggedInUser.id));
    const [likesAmmount, setLikesAmmount] = useState(likes.length);
    const [following, setFollowing] = useState(loggedInUser && loggedInUser.following.some((follow) => follow.id === user.id));

    const [networkError, setNetworkError] = useState(false);
    const navigate = useNavigate();
    const auth = localStorage.getItem('Authorization');

    const headersConfig = {
        headers: {
            Authorization: auth
        }
    };

    useEffect(() => {
        setLike(loggedInUser && likes.some((like) => like.id === loggedInUser.id));
        setFollowing(loggedInUser && loggedInUser.following.some((follow) => follow.id === user.id));
    }, [loggedInUser, likes, user]);
    
    const handleAlterFollow = () => {
        if (auth) {
            alterFollow(navigate, user.id, headersConfig, setFollowing, setNetworkError, setNeedRender)
        } else {
            navigate('/login')
        }
    }

    const handleAlterLike = () => {
        auth ? alterLike(navigate, id, headersConfig, setLike, setLikesAmmount, setNetworkError)
            : navigate('/login')
    }

    const navigateToPost = () => {
        navigate('/post/'+id)
    }

    const goProfile = () => {
        navigate('/user/'+user.id)
    }

        return (
        <div className="PostContainer">
            {networkError && <Toast/>}
                <div className="SuperiorContainer">
                    <Link to={`/user/${user.id}`}>
                    <img className="imageUser" src={user.image} alt="User image"></img>
                    </Link>
                    <div className="textContainer">
                        <div className="userCont" onClick={goProfile}>{user.username}</div>
                        <div className="titleCont">{title}</div>
                        <div className="descriptionCont">{description}</div>
                    </div>
                    {myId === user.id  ? <div className="buttonFollowHidden"></div> :
                    <button
                        className={"buttonFollow " + (following ? 'buttonUnfollowFriend' : 'buttonFollowFriend')}
                        onClick={handleAlterFollow}> {following ? 'Unfollow' : 'Follow'}
                    </button>
                    }
                </div>
                <div className="inferiorContainer">
                    <div className='VideoContainer'>
                        <video controls>
                            <source src={video} type="video/mp4"></source>
                        </video>
                    </div>
                    <div className="RoundedButtons">
                        <button className={"roundedButton" + (like ? 'Liked' : '')} onClick={handleAlterLike}>
                            <img src="../public/heart.png" alt="like" id="corazon"></img>
                        </button>
                        <span>{likesAmmount}</span>
                        <button className="roundedButton" onClick={navigateToPost}>
                            <img src="../public/comments.png" alt="comment"></img>
                        </button>
                        <span>{comments}</span>
                        <button className="roundedButton" id="share">
                            <img src="../public/NavBar/share.png" alt="share"></img>
                        </button>
                    </div>
                </div>
            </div>
        )
}

export default Post;