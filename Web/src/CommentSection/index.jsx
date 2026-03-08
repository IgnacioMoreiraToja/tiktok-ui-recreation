import './index.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Comment from '../Comment';
import {alterLike, alterFollow, addAComment} from '../utils'
import { getLoggedUser} from '../Servicio/Api';
import Toast from "../Toast/index.jsx";


const CommentSection = ({ data:{id, user, title, description, comments, likes}}) => {
    const [logged, setLogged] = useState(false);
    const [myId, setMyId] = useState(null);

    const [comment, setComment] = useState("");
    const [newComments, setNewComments] = useState(comments)
    const [like, setLike] = useState(false);
    const [likesAmmount, setLikesAmmount] = useState(likes.length)
    const [following, setFollowing] = useState(false);

    const [networkError, setNetworkError] = useState(false)
    const [error, setError]     = useState(false);
    const navigate = useNavigate();

    const newLikes = () => {
        if (likesAmmount < 1000) {
            return likesAmmount;
        } else if (likesAmmount < 1000000) {
            return Math.trunc((likesAmmount / 1000) * 10) / 10 + 'K';
        } else {
            return Math.trunc((likesAmmount / 1000000) * 10) / 10 + 'M';
        }
    }

    let auth = localStorage.getItem('Authorization');
    const headersConfig = {
        headers: {
            Authorization: auth
        }
    }
    useEffect(() => {
        auth && getLoggedUser(headersConfig)
                .then((response) => {
                    setLogged(true);
                    const userLogged = response.data;
                    const isFollowing   = userLogged.following.some(followed => followed.id === user.id);
                    const isLiked= likes.some(like => like.id === userLogged.id);
                    setMyId(userLogged.id)
                    setFollowing(isFollowing);
                    setLike(isLiked);
                });
    }, []);
    
    const handleAddComment = () => {
        !comment ? setError("You must write a comment") :
        addAComment(navigate, id, comment, headersConfig, setComment, setNewComments, setNetworkError)
    }

    const handleAlterLike = () => {
        auth ? alterLike(navigate, id, headersConfig, setLike, setLikesAmmount, setNetworkError) : navigate('/login')
    }

    const handleAlterFollow = () => {
        auth ? alterFollow(navigate, user.id, headersConfig, setFollowing, setNetworkError) : navigate('/login')
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            handleAddComment()
        }
    }

    const wantToComment = () => {
        navigate('/login');
    }

    const goProfile = () => {
        navigate('/user/'+user.id)
    }

    return(
            <div className="CommentSectionContainer">
                {networkError && <Toast/>}
                <div className="CommentSectionUserContainer">
                    <img className="CommentSectionImageUser" src={user.image} alt="User image" onClick={goProfile}></img>
                    <div className="CommentSectionTextContainer">
                        <div className="CommentSectionUsernameCont" onClick={goProfile}>{user.username}</div>
                        <div className="CommentSectionTitleCont">{title}<br></br>{description}</div>

                        {myId === user.id  ? <div className="CommentSectionButtonHidden"></div> :

                        <button className={"CommentSectionButtonFollow buttonFollow " + (following ? 'buttonUnfollowFriend' : 'buttonFollowFriend')}
                        onClick={handleAlterFollow}> {following ? 'Unfollow' : 'Follow'} </button> }
                    </div>

                </div>
                <div className="CommentSectionImagesContainers">
                    <div className="ContainerImageAndNumber">
                    <button className={"CommentSectionRoundedButton " + (like ? 'liked' : '')} onClick={handleAlterLike}>
                        <img src="../public/heart.png" alt="like" id="heart"></img>
                    </button>
                    <span>{newLikes()}</span>
                    </div>
                    <div className="ContainerImageAndNumber">
                    <button className="CommentSectionRoundedButton">
                        <img src="../public/comments.png" alt="comment"></img>
                    </button>
                    <span>{newComments.length}</span>
                    </div>
                    <button className="CommentSectionRoundedButton" id="share">
                        <img src="../public/NavBar/share.png" alt="share"></img>
                    </button>
                </div>
                <div className="CommentSectionCommentsContainer">
                  <div className="CommentsAmmount">Comments ({newComments.length})</div>
                  <div className="Comments">
                      {newComments.map((comment) => <Comment key={comment.id} data={comment} />)}
                  </div>
                </div>
                <div className="CommentSectionInsertComment">
                   {logged ?     
                            <> 
                                <input
                                    onKeyDown={handleKeyPress}
                                    className ='inputComment'
                                    placeholder="Add a comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}>
                                </input>
                                <button className='rectangleButton' onClick={handleAddComment}>
                                    <img src="../public/send.png" alt="send"/>
                                </button>
                                {error ? <div className='error errorComment'> {error}</div> : <> </>}
                              </>
                            : <div className='RedText' onClick={wantToComment}> Log in to comment</div> }
                    
                </div>
            </div>
    )

}

export default CommentSection;