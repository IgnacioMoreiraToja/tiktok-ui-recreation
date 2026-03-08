import "./index.css"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Toast from "../Toast/index.jsx";
import {addPost} from "../Servicio/Api.js";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState("");

    const [networkError, setNetworkError] = useState(null)
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let auth = localStorage.getItem('Authorization');

        !auth && navigate("/login");
    }, [navigate]);

    const createPost = () => {
        let auth = localStorage.getItem('Authorization');

        const postData = {
            "title": title,
            "description": description,
            "video": video,
        };
        const headersConfig = {
            headers: {
                Authorization: auth
            }
        };
        const postString = JSON.stringify(postData);
        (title && description && video)
            ? addPost(postString, headersConfig)
            .then(() => {
                navigate("/");
            })
            .catch((e) => {
                if (e.response && e.response.status === 401) {
                    navigate('/login')
                } else if (e.response && e.response.status === 400) {
                    setError("You must fill all the fields")
                } else {
                    setNetworkError("Network Error")
                    setTimeout(() => setNetworkError(null), 3000);
                }
            })
            : setError("You must fill all the fields")
    }

    return(
            <div className ={error ? "CreatePostContainerBig" : "CreatePostContainer"}>
                {networkError && <Toast/>}
                <div className ='LoginText'>
                    <div className='AboveText'> Title</div>
                    <input
                        className='inputTiktok'
                        placeholder="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className ='LoginText'>
                    <div className='AboveText'> Description </div>
                    <input
                        className='inputTiktok'
                        placeholder="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className ='LoginText'>
                    <div className='AboveText'> Video </div>
                    <input
                        className='inputTiktok'
                        placeholder="video"
                        value={video}
                        onChange={(e) => setVideo(e.target.value)}
                    />
                </div>
                <button className='LoginButton' onClick={createPost}> Create Post </button>
                {error && <div className="error">{error}</div>}
            </div>
    )
}

export default CreatePost;