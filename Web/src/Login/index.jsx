import "./index.css"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getLoggedUser, postLogin} from "../Servicio/Api.js";
import Loader from "../Loader/index.jsx";
import Toast from "../Toast/index.jsx";


const Login = ({page}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
                        localStorage.removeItem('Authorization');
                        setError("Session expired. Please log in again.");
                    } else if (error.message === "Network Error") {
                        navigate(page)
                    }
                })
                .finally(() => setLoading(false))
            : setLoading(false)
    }, [navigate]);

    const login = () => {

        const userData = {
            username: username,
            password: password,
        };

        const userDataString = JSON.stringify(userData);

        (username && password) ?
        postLogin(userDataString)
            .then((request) => {
                    navigate(page);
                    localStorage.setItem("Authorization", request.headers.get("Authorization"))

            })
            .catch((e) => {
                if (e.message === "Network Error") {
                    setNetworkError(true)
                    setTimeout(() => setNetworkError(false), 3000);
                } else {
                    setError("Wrong email or password.")
                }
            })
            : setError("Please, fill in all the fields.")
    }

    return (
        loading ? <Loader/> :
            <div className = {error? "LoginContainerBig" : "LoginContainer"}>
                {networkError && <Toast/>}
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
                <button className = 'LoginButton' onClick={login}> Log in </button>
                {error && <div className="error">{error}</div>}
            </div>
    )
}

export default Login;