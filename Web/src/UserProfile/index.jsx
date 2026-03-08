import './index.css'
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import Toast from "../Toast/index.jsx";
import {addRemoveFollow} from '../Servicio/Api';


const UserProfile = ({ setPage, data, loggedInUser}) => {
    let itsMe= data.id === loggedInUser?.id;

    const [follows, setFollows] = useState(loggedInUser && data.followers.some((follower) => follower.id === loggedInUser.id));

    const [networkError, setNetworkError] = useState(false)
    const navigate = useNavigate();
    const auth = localStorage.getItem('Authorization');

    const headersConfig = {
        headers: {
            Authorization: auth
        }
    };

    const { id, username, image, followers, following } = data;
    const [followersAmmount, setFollowersAmmount] = useState(followers.length)

    const logOut = () => {
        localStorage.removeItem('Authorization');
        navigate('/');
        setPage('/');
    }

    const handlealterFollow = () => {
        auth && addRemoveFollow(id, headersConfig)
        .then(() =>{ 
            setFollows(x => !x);
            setFollowersAmmount(x => follows ? x -1 : x + 1);
        })
        .catch((e) => {
            if (e.response && e.response.status === 401) {
                navigate('/login')
            } else {
                setNetworkError(true)
                setTimeout(() => setNetworkError(false), 3000);
            }
        }
        )
    }


    return (
        <div className='userProfileContainer'>
            {networkError && <Toast/>}
            <div className='userThingsUserProfileContainer'>
                <img className='roundedImage userImageUserProfile' src={image} alt='UserImageUserProfile' />
                <div className='userNameUserProfile'>{username}</div>
            </div>

            <div className='buttonLogOutContainer'>
                {itsMe ?

                <button className='buttonLogOut' alt='Button Log Out'     onClick={logOut}>Log out</button>
                :
                <button className={"buttonLogOut " + (follows ? 'buttonUnfollowFriend' : 'buttonFollowFriend')}
                        onClick={handlealterFollow}> {follows ? 'Unfollow' : 'Follow'}
                </button>
                }
            </div>


            <div className='followsUserProfileContainer'>
                <div className='followInfo FollowingUserProfile'>
                    <div className='number numberFollows'>{following ? following.length : 0}</div>
                    <div className='Follow'>Follow</div>
                </div>
                <div className='followInfo FollowersUserProfile'>
                    <div className='number numberFollowers'>{followers ? followersAmmount : 0}</div>
                    <div className='Followers'>Followers</div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;