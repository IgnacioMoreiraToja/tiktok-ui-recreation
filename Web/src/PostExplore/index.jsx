import './index.css';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PostProfile from '../PostProfile';
import Toast from "../Toast/index.jsx";
import {alterLike} from '../utils'


const PostExplore = ({data : {id, user, title, description,video, likes}, loggedInUser }) => {
   const [likesAmmount, setLikesAmmount] = useState(likes.length);
   const [like, setLike] = useState(loggedInUser && likes.some((like) => like.id === loggedInUser.id));

   const [networkError, setNetworkError] = useState(false);
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

    const profileData = {
      id: id,
      user: user,
      video: video,
      title: title,
      description: description,
    };

    const auth = localStorage.getItem('Authorization');

    const headersConfig = {
        headers: {
            Authorization: auth
        }
    };

  const goProfile = () => {
    navigate('/user/'+user.id)
  }

  const handleAlterLike = () => {
      auth ? alterLike(navigate, id, headersConfig, setLike, setLikesAmmount, setNetworkError) : navigate('/login')
  }
    return (
    <div className="PostExploreContainer">
        {networkError && <Toast/>}
      <PostProfile
        data={profileData}
      />
      <div className="userLikesContainer">
        <div className='userPostExplore'>
            <img className='roundedFigures imageUserPostExplore' src={user.image} alt='userImage' onClick={goProfile}></img>
            <div className="nombreDeUsuarioPostExplore" onClick={goProfile}> {user.username} </div>
        </div>
        <div className="likesPostExploreContainer">
            
              <button
                className={"roundedFigures roundedButtonExplore " + (like ? 'Liked' : '')}
                onClick={handleAlterLike}
              >
                <img src={"../public/heart.png"} alt="likesAmmount" />
              </button>

          
          <div className="likesPostExplore"> {newLikes()} </div>
        </div>
      </div>
    </div>
  );
};

export default PostExplore;