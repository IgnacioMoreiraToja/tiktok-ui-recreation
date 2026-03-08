import './index.css'
import { useNavigate } from 'react-router-dom'

const Comment = ({data :{ user, text}}) => {
    const navigate = useNavigate();

    const goProfile = () => {
        navigate('/user/'+user.id);
    }
    return (
        <div className='CommentContainer'>
            <div className='CommentImageContainer'>
                <img src={user.image} alt='userImage' onClick={goProfile}></img>
            </div>
            <div className='CommentDescriptionContainer'>
                <div className='CommentUsername' onClick={goProfile}>{user.username}</div>
                <div className='CommentText'>{text}</div>
            </div>
        </div>
    )
}

export default Comment