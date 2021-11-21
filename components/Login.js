import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Login({ setToken }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (name.length > 0 && password.length > 0) {
      const endpoint = 'http://localhost:8080/api/user/login';

      const data = {
        username: name,
        password: password,
      };

      axios
        .post(endpoint, JSON.stringify(data))
        .then((res) => {
          if (res.status == 200) {
            var token = res.data.access_token;
            var decoded = jwt_decode(token);
            console.log("decoded " + JSON.stringify(decoded));
            localStorage.setItem("user_token_decoded", JSON.stringify(decoded));
            localStorage.setItem("user_token", token);
            setToken(JSON.stringify(decoded));
            
            
            navigate('/home')
          }
        })
        .catch((err) => console.log(err));
    }
  };

  
  const handleUsernameChange = (event) => {
    setName(event.target.value);
  };

  
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>
          username:{' '}
          <input
            type="text"
            name="username"
            value={name}
            onChange={handleUsernameChange}
          />
          <br />
          <br />
          password:{' '}
          <input
            type="text"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </p>
        <br />
        <button onClick={() => {}}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
