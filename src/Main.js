import React, { useEffect, useState } from 'react';
import Login from '../components/Login.js';
import Logout from '../components/Logout.js';
import TopNavBar from '../components/TopNavBar.js';
import Contact from '../components/Contact.js';
import Home from '../components/Home.js';
import Dashboard from '../components/Dashboard.js';
import UserPage from '../components/UserPage.js';
import Menu from '../components/Menu.js';
import NoPageFound from '../components/NoPageFound.js';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Main() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState([]);
  const [token, setToken] = useState();
  const [canCheckOut, setCanCheckOut] = useState(false);
  const navigate = useNavigate();
  const getToken = localStorage.getItem('user_token');

  useEffect(() => {
    if (getToken != null) {
      setToken(token);
    }
  }, token);

  return (
    <Routes>
      <Route
        path="/"
        element={<TopNavBar token={token} canCheckOut={canCheckOut} />}
      >
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route
          path="login"
          element={<Login setToken={setToken} setUser={setUser} />}
        />
        <Route path="user" element={<UserPage />} />
        <Route
          path="menu"
          element={<Menu token={token} setCanCheckOut={setCanCheckOut} />}
        />
        <Route path="contact" element={<Contact />} />
        <Route
          path="logout"
          element={
            <Logout setToken={setToken} setCanCheckOut={setCanCheckOut} />
          }
        />
        <Route path="dashboard" element={<Dashboard token={token} />} />
        <Route path="checkout" element={<NoPageFound />} />
        {/*<Route path="*" element={<NoPageFound />} />*/}
      </Route>
    </Routes>
  );
}
