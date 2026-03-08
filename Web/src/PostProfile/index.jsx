import './index.css';
import { useNavigate } from 'react-router-dom';

const PostProfile = ( {data : {id, title, description, video }}) => {
  const navigate = useNavigate();

  const navigateToPost = () => {
    navigate('/post/'+id)
  }
    return (
        <div className="PostProfileContainer" onClick={navigateToPost}>
          <div className="VideoContainerPostProfile">
            <video>
              <source src={video} type="video/mp4"></source>
            </video>
          </div>
          <div className="textContainerPostProfile">
            <div className="titleContPostProfile">{title}</div>
            <div className="descriptionContPostProfile">{description}</div>
          </div>
        </div>
    );
  };

export default PostProfile;