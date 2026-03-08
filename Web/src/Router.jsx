import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import CreatePost from './CreatePost'
import Following from './Following'
import Friends from './Friends'
import Search from './Search'
import Explore from './Explore'
import Profile from './Profile'
import PostPage from './PostPage'

const RouterApp = ({page, setPage,}) => (
        <Routes>
            <Route path ="/"                    element = {<Home        setPage = {setPage}/>}/>
            <Route path ="/login"               element = {<Login       page    = {page}   />}/>
            <Route path ="/register"            element = {<Register    page    = {page}   />}/>
            <Route path ="/addPost"             element = {<CreatePost                     />}/>
            <Route path ="/following"           element = {<Following   setPage = {setPage}/>}/>
            <Route path ="/friends"             element = {<Friends     setPage = {setPage}/>}/>
            <Route path ="/explore"             element = {<Explore     setPage = {setPage}/>}/>
            <Route path ="/post/:postID"        element = {<PostPage    setPage = {setPage}/>}/>
            <Route path ="/search"              element = {<Search      setPage = {setPage}/>}/>
            <Route path ="/user/:userID"        element = {<Profile     setPage = {setPage}/>}/>
            <Route path ="/*"                   element = {<div className={"errorFriends"}> This site doesn't exist. </div>}/>
        </Routes>
);

export default RouterApp