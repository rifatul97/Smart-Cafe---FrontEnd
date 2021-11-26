import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard(props) {
  const navigate = useNavigate();

  const getUsers = () => {
    const endpoint = 'http://localhost:8080/api/users';
    const token = localStorage.getItem('user_token');
    var users = ''

    axios
      .get(endpoint, { headers: { Authorization: 'Bearer ' + token } })
      .then((res) => {
        users = JSON.stringify(res)
        console.log(users.length)
      })
      .catch((err) => console.log(err));
// for loops
      return <p>{users}</p>;
  };

  return <div>{getUsers()}</div>;
}

export default Dashboard;
