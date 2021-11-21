import React, { useEffect, useState } from 'react';
import Login from '../components/Login.js';
import Logout from '../components/Logout.js';
import TopNavBar from '../components/TopNavBar.js';
import Contact from '../components/Contact.js';
import Home from '../components/Home.js';
import Dashboard from '../components/Dashboard.js'
import UserPage from '../components/UserPage.js';
import Menu from '../components/Menu.js';
import {
  Route,
  Routes,
} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Main() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState([]);
  const [token, setToken] = useState();
  const navigate = useNavigate();
  const getToken = localStorage.getItem('user_token');

  useEffect(() => {
    console.log("main 1")
    if(getToken != null) {
      console.log("main 2.")
      setToken(token)
    } 
  }, token)

  return (
    <Routes>
        <Route path="/" element={<TopNavBar token={token}/>}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login setToken={setToken} setUser={setUser}/>} />
        <Route path="user" element={<UserPage />} />
        <Route path="menu" element={<Menu token={token}/>} />
        <Route path="contact" element={<Contact />} />
        <Route path="logout" element={<Logout setToken={setToken}/>} />
        <Route path="dashboard" element={<Dashboard token={token}/>} />
        {/*<Route path="*" element={<NoPageFound />} />*/}
        </Route>
    </Routes>
  );
}
