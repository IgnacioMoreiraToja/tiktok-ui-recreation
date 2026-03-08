import "./index.css"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getLoggedUser, postRegister} from "../Servicio/Api.js";
import Loader from "../Loader/index.jsx";
import Toast from "../Toast/index.jsx";

const Register = ({page}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");

    const [loading, setLoading] = useState(true)
    const [networkError, setNetworkError] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('Authorization');
        const headersConfig = {
            headers: {
                Authorization: auth
            }
        };

        auth ?
            getLoggedUser(headersConfig)
                .then(() => {
                    navigate(page);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        navigate("/login")
                    } else if (error.message === "Network Error") {
                        setNetworkError("Network error. Please, try again later.")
                    }
                })
                .finally(() => setLoading(false))
            : setLoading(false)
    }, [navigate]);

    const register = () => {
        const userData = {
            "username": username,
            "password": password,
            "email": email,
            "image": image
        };

        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
        const regexImg = /^(http|https|ftp):\/\/.*/;

        const userDataString = JSON.stringify(userData);
        (username && password && email && image) ? (
            !regex.test(email) ? setError("Invalid email. Try writing one with @ and .com") :
                !regexImg.test(image) ? setError("Invalid image. Try writing one with http:// or https://") :
            postRegister(userDataString)
            .then((request) => {
                navigate(page);
                localStorage.setItem("Authorization", request.headers.get("Authorization"))
            })
            .catch((e) => {
                if (e.message === "Network Error") {
                    setNetworkError(true)
                    setTimeout(() => setNetworkError(false), 3000)
                    setError('')
                } else {
                    setError("Username already exists.")
                }
            })
            .finally(() => setLoading(false))
        ) : setError("Please, fill all the fields.");
    }

    return (
        loading ? <Loader/> :
            <div className = {error? "RegisterContainerBig" : "RegisterContainer"}>
                {networkError && <Toast />}
                <div className ='LoginText'>
                    <div className='AboveText'>Username</div>
                    <input
                        className ='inputTiktok'
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}/>
                </div>  
                <div className ='LoginText'>
                <div className='AboveText'>Password</div>
                    <input
                        className ='inputTiktok'
                        placeholder="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className ='LoginText'>
                    <div className='AboveText'>Email</div>
                    <input
                        className ='inputTiktok'
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className ='LoginText'> 
                    <div className='AboveText'>Image</div>
                    <input
                        className ='inputTiktok'
                        placeholder="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}/>
                </div>
                <button className = 'LoginButton' onClick={register}> Register </button>
                {error && <div className="error">{error}</div>}
            </div>
    )
}

export default Register;