import './index.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CommentSection from '../CommentSection'
import Loader from '../Loader';
import {getPost} from '../Servicio/Api'

const PostPage = ({setPage}) => {
    let {postID} = useParams();

    const [post, setPost] = useState(null);

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setPage("/post/" + postID)
        getPost(postID)
          .then((response) => {
            setError(false);
            setPost(response.data);
          })
          .catch((e) => {
            if (e.response && e.response.status === 404) {
                setError("Post not found")
            } else {
                setError("Network error. Please try again later.")
            }
          })
      }, []);



    return (
        error ? <div className='errorFriends'>{error} </div> :
            !post ? <Loader/> :
        <div className='PostPageContainer'>
            <div className='videoPostPageContainer'> 
                <video src={post?.video} alt="Video" controls></video>
            </div>
            <div className='commentSectionPostPageContainer'>
                <CommentSection data={post}/>
            </div> 
        </div>
    )
}

export default PostPage;