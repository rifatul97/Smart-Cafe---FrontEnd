import React, { useEffect, useState } from 'react';
import Login from '../components/Login.js';
import Logout from '../components/Logout.js';
import TopNavBar from '../components/TopNavBar.js';
import Contact from '../components/Contact.js';
import NoPageFound from '../components/NoPageFound.js';
import Home from '../components/Home.js';
import Dashboard from '../components/Dashboard.js'
import App from './App.js';
import UserPage from '../components/UserPage.js';
import Menu from '../components/Menu.js';
import { RouteObject } from "react-router-dom";
import ProductIndex from '../components/ProductIndex.js'
import {
  BrowserRouter,
  Router,
  Switch,
  useRoutes,
  Route,
  Link,
  Routes,
} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Main() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState([]);
  const [token, setToken] = useState();
  const navigate = useNavigate();

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
