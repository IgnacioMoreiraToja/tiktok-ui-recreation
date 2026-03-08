import './index.css';
import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import Toast from "../Toast/index.jsx";
import {alterFollow} from '../utils'

const Friend = ({data: {id, image, username}, listFollowing, userId}) => {
    const [following, setFollowing] = useState(listFollowing?.some(followed => followed.id === id));

    const [networkError, setNetworkError] = useState(null)
    const navigate = useNavigate();
    const auth = localStorage.getItem('Authorization');
    const headersConfig = {
        headers: {
            Authorization: auth
        }
    };

    const handleAlterFollow = () => {
        auth ? alterFollow(navigate,id, headersConfig, setFollowing, setNetworkError) : navigate('/login')
    }

    const goProfile = () => {
        navigate('/user/' + id)
    }

    return (
          <div className ="friendContainer">
              {networkError && <Toast/>}
            <div className='friendThingsContainer' >
              <img className = "userImageFriend" src={image} alt="userImage" onClick={goProfile}></img>
              <p className = "userNameFriend" onClick={goProfile}>{username}</p>

                {userId === id  ? <div className="buttonFollowHidden"></div> :

                    <button className={"buttonFollow " + (following ? 'buttonUnfollowFriend' : 'buttonFollowFriend')} onClick={handleAlterFollow}> {following ? 'Unfollow' : 'Follow'} </button>
                }
            </div>
          </div>
    )
}

export default Friend;