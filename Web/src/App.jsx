import "./App.css"; 
import { useState } from 'react';
import NavBar from './NavBar'
import SideBar from "./SideBar"
import RouterApp from "./Router";
import {BrowserRouter as Router} from 'react-router-dom'



const App = () => {
  const [page, setPage] = useState("/")
  return (
    <>
    <Router>
      <NavBar className="NavBar"/>
      <div className="BelowNavBar">
        <SideBar setPage={setPage} className="SideBar"/>
        <div className="BodyContainer">
          <RouterApp page ={page} setPage= {setPage}/>
        </div>
      </div>
    </Router>
    </>
  );
};

export default App;